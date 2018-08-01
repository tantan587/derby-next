const knex = require('../server/db/connection')
const asyncForEach = require('./asyncForEach')

const update_sport_standings = async (sport_id, sport_season_id, playoffs = false) => {
  let table = playoffs ? 'sports.playoff_standings' : 'sports.standings'
  let lower = Number(sport_id)*1000
  let upper = (Number(sport_id)+1)*1000
  await knex(table)
    .where('team_id', '>', lower)
    .andWhere('team_id', '<', upper)
    .update('sport_season_id', sport_season_id)
        
}

const function_to_update = async () => {
  let data = await knex('sports.sport_season').select('*')
  
  asyncForEach(data,async (season) => {
    if(season.season_type === 1){
      await update_sport_standings(season.sport_id, season.sport_season_id)
    }
    if(season.season_type === 3){
      await update_sport_standings(season.sport_id, season.sport_season_id, true)
    }
  })
}

function_to_update()
