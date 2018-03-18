
const knex = require('../db/connection')

const GetActiveDrafts = async () =>
{
  const str1 = `SELECT room_id from draft.settings WHERE start_time >
   NOW() AND start_time < NOW() + INTERVAL '100 days'`

  const resp = await knex.raw(str1)
  return resp.rows.map(x =>x.room_id)
}

const GetDraftInfo = async (room_id) =>
{
  const knexStr1 = 'select (select sum(b.number_teams) from draft.settings a, fantasy.sports b where room_id = \'' + room_id +
   '\' and a.league_id = b.league_id group by a.league_id) as total_teams, * from  draft.settings where room_id = \'' + room_id + '\''

  const knexStr2 = `select team_id from fantasy.team_points a, 
   draft.settings b where a.league_id = b.league_id and b.room_id = '` + room_id + '\' order by 1'

  const knexStr3 = `select owner_id from fantasy.owners a, 
   draft.settings b where a.league_id = b.league_id and b.room_id = '` + room_id + '\' order by 1'
 
  const settings = await knex.raw(knexStr1)
  const teams = await knex.raw(knexStr2)
  const owners = await knex.raw(knexStr3)

  return {
    ...settings.rows[0],
    teams:teams.rows.map(x =>x.team_id),
    owners:owners.rows.map(x =>x.owner_id)
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
const RestartDraft = (roomId) =>
{
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
  GetDraftInfo,
  InsertDraftAction,
  RestartDraft
}