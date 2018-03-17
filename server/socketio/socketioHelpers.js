
const knex = require('../db/connection')

const GetDraftInfo = (room_id) =>
{
  const knexStr1 = 'select (select sum(b.number_teams) from draft.settings a, fantasy.sports b where room_id = \'' + room_id +
   '\' and a.league_id = b.league_id group by a.league_id) as total_teams, * from  draft.settings where room_id = \'' + room_id + '\''

  const knexStr2 = `select team_id from fantasy.team_points a, 
   draft.settings b where a.league_id = b.league_id and b.room_id = '` + room_id + '\' order by 1'

  return knex.raw(knexStr1)
    .then(res1 => {
      return knex.raw(knexStr2)
        .then(res2 => 
        {return {...res1.rows[0], availableTeams:res2.rows.map(x =>x.team_id)}})
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
  GetDraftInfo,
  InsertDraftAction,
  RestartDraft
}