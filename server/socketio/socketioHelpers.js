
const knex = require('../db/connection')

const GetDraftTime = (room_id) =>
{
  return knex
    .withSchema('draft')
    .table('settings')
    .where('room_id', room_id)
    .then(res => {
      return res[0].start_time})
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
  GetDraftTime,
  InsertDraftAction,
  RestartDraft
}