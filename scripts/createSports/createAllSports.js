const knex = require('../../server/db/connection')
const createSport = require('./create_sport_helpers')

const create_all_sports = async () => {
await createSport.createProfessionalSport(knex, '104', 'NHL', 'NHLv3StatsClient', 'getTeamsActivePromise')
await createSport.createProfessionalSport(knex, '102', 'NFL', 'NFLv3StatsClient', 'getTeamsActivePromise')
await createSport.createProfessionalSport(knex, '101', 'NBA', 'NBAv3StatsClient', 'getTeamsActivePromise')
await createSport.createProfessionalSport(knex, '103', 'MLB', 'MLBv3StatsClient', 'getTeamsActivePromise')
await createSport.createSoccerLeague(knex, '107', 'EPL', 'Soccerv3StatsClient', 'getSeasonTeamsPromise', 64, 37)
await createSport.createCollegeSport(knex, '105', 'CFB', 'CFBv3ScoresClient', 'getTeamsPromise')
await createSport.createCollegeSport(knex, '106', 'CBB', 'CBBv3StatsClient', 'getTeamsPromise')
}

create_all_sports()
