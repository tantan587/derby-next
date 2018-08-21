
const knex = require('../db/connection')

const GetActiveDrafts = async () =>
{
  const str1 = `SELECT room_id from draft.settings 
  WHERE start_time < NOW() + INTERVAL '100 days'
  and state != 'post'`

  const resp = await knex.raw(str1)
  return resp.rows.map(x =>x.room_id)
}

const GetFutureDrafts = async () =>
{
  const str1 = `SELECT room_id from draft.settings WHERE start_time 
   > NOW() - INTERVAL '1 days'`

  const resp = await knex.raw(str1)
  return resp.rows.map(x =>x.room_id)
}

const GetDraftInfo = async (room_id) =>{

  const knexStr0 = `select league_id, seconds_pick, state from draft.settings
   where room_id = '` + room_id + '\''

  const knexStr1 = 'select (select sum(b.number_teams) from draft.settings a, fantasy.sports b where room_id = \'' + room_id +
   '\' and a.league_id = b.league_id group by a.league_id) as total_teams, * from  draft.settings where room_id = \'' + room_id + '\''

  //this needs to adjust for relgated teams.
  const knexStr2 = `select distinct c.team_id, c.sport_id, c.conference_id, f.ranking
  from draft.settings a, fantasy.conferences b, sports.team_info c, sports.premier_status d, fantasy.leagues e, fantasy.projections f
  where a.league_id = b.league_id  
  and b.conference_id = c.conference_id
  and ((c.sport_id = 107 and d.division_1 = 't' and c.team_id = d.team_id) OR c.sport_id != 107)
  and a.league_id = e.league_id
  and e.sport_structure_id = f.sport_structure_id
  and f.team_id = c.team_id
  AND f.day_count = (
    SELECT max(day_count) 
    FROM fantasy.projections
  )
  and a.room_id = '` + room_id + '\' order by 4'
 
  const knexStr3 = `select owner_id from fantasy.owners a, 
   draft.settings b where a.league_id = b.league_id and b.room_id = '` + room_id + '\' order by 1'
 
  const knexStr4 = `select * from draft.results 
    where action_type ='QUEUE' and room_id = '` + room_id + '\' order by server_ts'

  const knexStr5 = `select sum(number_teams) from fantasy.sports a, 
    draft.settings b where a.league_id = b.league_id and b.room_id = '` + room_id + '\''

  const simpleSettings = await knex.raw(knexStr0)
  const settings = await knex.raw(knexStr1)
  const teamsByRank = await knex.raw(knexStr2)
  const owners = await knex.raw(knexStr3)
  const allQueues = await knex.raw(knexStr4)
  const numberOfPicks = await knex.raw(knexStr5)
  
  const queueByOwner = {}
  allQueues.rows.map(x => {
    queueByOwner[x.initiator] = x.action.queue
  })

  const rtnOwners = owners.rows.map(x =>x.owner_id)

  return {
    ...settings.rows[0],
    leagueId:simpleSettings.rows[0].league_id,
    seconds_pick:simpleSettings.rows[0].seconds_pick,
    allTeamsByRank:teamsByRank.rows.map(x =>x.team_id),
    owners:rtnOwners,
    queueByOwner:queueByOwner,
    totalPicks:parseInt(numberOfPicks.rows[0].sum) * rtnOwners.length
  }
}

const InsertDraftState = (roomId, state) =>
{
  return knex.withSchema('draft').table('settings')
    .update('state', state)
    .where('room_id',roomId)
    .then(() => {
      return InsertDraftAction(roomId, 'server', 'STATE', {'mode':state} )
    })
}

const CheckDraftBeforeInsertingPick = (roomId, pick) =>
{
  let str = `select action ->> 'pick' as pick, server_ts 
   from draft.results where room_id = '`+ roomId + `' 
   and action_type  = 'PICK' order by 2 desc limit 1;`
  return knex.raw(str)
    .then((result) => {
      return result.rows.length === 0 || result.rows[0].pick !== pick
    })
}

const InsertDraftAction = (roomId, initiator, actionType, action, client_ts ='' ) =>
{
  return knex.withSchema('draft').table('results')
    .insert({
      room_id : roomId,
      initiator: initiator,
      client_ts : client_ts === '' ? undefined : client_ts,
      server_ts : new Date().toJSON(),
      action_type : actionType,
      action: action
    })
    .then( () => {return} )
}

const RestartDraft = (roomId) =>{
  return knex.transaction(function (t) {
    return knex.withSchema('draft').table('results')
      .transacting(t)
      .where('room_id', roomId)
      .del()
      .then( () => {
        return InsertDraftAction(roomId, 'server', 'STATE', {'mode':'pre'})
          .then(() => {return})
      })
      .then(()=>{
        t.commit
        return
      })
  })
}

module.exports = {
  GetActiveDrafts,
  GetFutureDrafts,
  GetDraftInfo,
  InsertDraftState,
  InsertDraftAction,
  RestartDraft,
  CheckDraftBeforeInsertingPick
}