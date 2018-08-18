var data = require('../../data/startingElo.json')

const create_initial_elos = async (knex, truncate = false) => {
  if(truncate){
    await knex('analysis.historical_elo').truncate()
  }

  await knex('analysis.current_elo').truncate()
    
  await knex('analysis.current_elo')
    .insert(data)
    
  let historical_data = data.map(team => {
    return {...team, day_count: 1469}
  })
    
  await knex('analysis.historical_elo')
    .insert(historical_data)

}

module.exports = {create_initial_elos}