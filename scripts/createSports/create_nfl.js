const knex = require('../../server/db/connection')
const createSport = require('./create_sport_helpers')


createSport.createProfessionalSport(knex, '102', 'NFL', 'NFLv3StatsClient', 'getTeamsActivePromise')

