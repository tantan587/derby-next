const knex = require('../server/db/connection')


const resetTables = async (exitProcess) => {
  return Promise.all([
    knex('sports.standings').truncate(),
    knex('sports.schedule').truncate(),
    knex('sports.team_info').truncate(),
    knex('sports.playoff_standings').truncate(),
    knex('sports.premier_status').truncate(),
    knex('fantasy.team_points').truncate()
  ])
    .then(()=>{
      if(exitProcess)
        process.exit()
    })
    .catch(err => console.log(err))
}

module.exports = {resetTables}