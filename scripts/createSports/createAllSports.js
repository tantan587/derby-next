const knex = require('../../server/db/connection')
const createSport = require('./create_sport_helpers')
const update2017NflPlayoffs = require('./2017NflPlayoffs')
const add_logos = require('./extra_logos')

const createSports = async (exitProcess) => {
  await createSport.createProfessionalSport(knex, '104', 'NHL', 'NHLv3StatsClient', 'getTeamsActivePromise')
  await createSport.createProfessionalSport(knex, '102', 'NFL', 'NFLv3StatsClient', 'getTeamsActivePromise')
  await createSport.createProfessionalSport(knex, '101', 'NBA', 'NBAv3StatsClient', 'getTeamsActivePromise')
  await createSport.createProfessionalSport(knex, '103', 'MLB', 'MLBv3StatsClient', 'getTeamsActivePromise')
  await createSport.createSoccerLeague(knex, '107', 'EPL', 'Soccerv3StatsClient', 'getSeasonTeamsPromise', 64, 37)
  await createSport.createCollegeSport(knex, '105', 'CFB', 'CFBv3ScoresClient', 'getTeamsPromise')
  await createSport.createCollegeSport(knex, '106', 'CBB', 'CBBv3StatsClient', 'getTeamsPromise')
  await update2017NflPlayoffs()
  await add_logos(knex)
  if(exitProcess)
  {
    process.exit()
  }
}

module.exports = {createSports}
