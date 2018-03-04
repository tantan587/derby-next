
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

module.exports = {
  GetDraftTime
}