
const knex = require('../../db/connection')

const createDraftSetting = () =>
{
  return knex.withSchema('draft').table('settings')                  
    .insert({
      league_id: '700e1011-5891-404c-a7f6-75dd176c95f3',
      start_time: '2018-04-22 21:10:25-05',
      type: 'Snake',
      room_id: Math.random().toString(36).substr(2, 10)
    })
    .then(()=> {return true})
}

module.exports = {createDraftSetting}