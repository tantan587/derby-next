
const knex = require('../db/connection')

const GetActiveDrafts = async () =>
{
  const str1 = `SELECT room_id from draft.settings WHERE start_time >
   NOW() AND start_time < NOW() + INTERVAL '100 days'`

  const resp = await knex.raw(str1)
  return resp.rows.map(x =>x.room_id)
}

const GetDraftInfo = async (room_id) =>{
  const knexStr1 = 'select (select sum(b.number_teams) from draft.settings a, fantasy.sports b where room_id = \'' + room_id +
   '\' and a.league_id = b.league_id group by a.league_id) as total_teams, * from  draft.settings where room_id = \'' + room_id + '\''

  const knexStr2 = `select team_id from fantasy.team_points a, 
   draft.settings b where a.league_id = b.league_id and b.room_id = '` + room_id + '\' order by 1'

  const knexStr3 = `select owner_id from fantasy.owners a, 
   draft.settings b where a.league_id = b.league_id and b.room_id = '` + room_id + '\' order by 1'
 
  const knexStr4 = `select * from draft.results 
    where action_type ='QUEUE' order by server_ts`

  const settings = await knex.raw(knexStr1)
  const teams = await knex.raw(knexStr2)
  const owners = await knex.raw(knexStr3)
  const allQueues = await knex.raw(knexStr4)


  const queueByOwner = {}
  allQueues.rows.map(x => {
    queueByOwner[x.initiator] = x.action.queue
  })

  return {
    ...settings.rows[0],
    teams:teams.rows.map(x =>x.team_id),
    owners:owners.rows.map(x =>x.owner_id),
    queueByOwner:queueByOwner
  }
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

//obviously needs to be derived from the db
const GetDraftRules = async (roomId) => {

  const knexStr = `select distinct 
    c.sport_id, b.conference_id, 
    b.number_teams as conf_teams, c.number_teams as sport_teams 
    from draft.settings a, fantasy.conferences b, fantasy.sports c 
    where a.league_id = b.league_id 
    and a.league_id = c.league_id 
    and b.sport_id = c.sport_id 
    and a.room_id = '` + roomId + '\''

  const rtnObj = {}
  return knex.raw(knexStr)
    .then(rules => {
      rules.rows.map(rule => 
      {
        if(!rtnObj[rule.sport_id])
        {
          rtnObj[rule.sport_id] = 
          {max:parseInt(rule.sport_teams), total:0, conferences:{}}
        }

        rtnObj[rule.sport_id].conferences[rule.conference_id] = 
        {max:parseInt(rule.conf_teams), total:0, team:''}
      })
      return rtnObj
    })
}

const GetTeamMap = async (roomId) =>{
  const teamMapStr = `select c.team_id, c.sport_id, c.conference_id 
  from draft.settings a, fantasy.team_points b, sports.team_info c 
  where a.league_id = b.league_id  and b.team_id = c.team_id and a.room_id = '` +  roomId + '\''

  const rtnObj = {}
  return knex.raw(teamMapStr)
    .then(teams => {
      teams.rows.map(team => 
      {
        rtnObj[team.team_id] = 
        {'conference_id':team.conference_id,
          'sport_id': team.sport_id}
        if(!rtnObj[team.sport_id])
        {
          rtnObj[team.sport_id] = []
        }
        if(!rtnObj[team.conference_id])
        {
          rtnObj[team.conference_id] = []
        }
        rtnObj[team.sport_id].push(team.team_id)
        rtnObj[team.conference_id].push(team.team_id)
      })
      return rtnObj
    })
}

module.exports = {
  GetActiveDrafts,
  GetDraftInfo,
  InsertDraftAction,
  RestartDraft,
  GetDraftRules,
  GetTeamMap
}