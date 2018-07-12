

const knex = require('../../server/db/connection')
const createSport = require('./create_sport_helpers')

createSport.createProfessionalSport(knex, '104', 'NHL', 'NHLv3StatsClient', 'getTeamsActivePromise')
