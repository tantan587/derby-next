const knex = require('../../server/db/connection')
const createSport = require('./create_sport_helpers')
const nflPlayoffs2017 = require('./data/nflPlayoffs2017')
const logos = require('./data/extra_logos')
const initialElos = require('./initialElos')

const createSports = async (exitProcess) => {
  await createSport.createProfessionalSport(knex, '104', 'NHL', 'NHLv3StatsClient', 'getTeamsActivePromise')
  await createSport.createProfessionalSport(knex, '102', 'NFL', 'NFLv3StatsClient', 'getTeamsActivePromise')
  await createSport.createProfessionalSport(knex, '101', 'NBA', 'NBAv3StatsClient', 'getTeamsActivePromise')
  await createSport.createProfessionalSport(knex, '103', 'MLB', 'MLBv3StatsClient', 'getTeamsActivePromise')
  await createSport.createSoccerLeague(knex, '107', 'EPL', 'Soccerv3StatsClient', 'getSeasonTeamsPromise', 64, 37)
  await createSport.createCollegeSport(knex, '105', 'CFB', 'CFBv3ScoresClient', 'getTeamsPromise')
  await createSport.createCollegeSport(knex, '106', 'CBB', 'CBBv3StatsClient', 'getTeamsPromise')
  await nflPlayoffs2017.updateNFL()
  await logos.addLogos(knex)
  await initialElos.create_initial_elos(knex)
  if(exitProcess)
  {
    process.exit()
  }
}

module.exports = {createSports}
