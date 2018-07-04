const createSport = require('./create_sport_helpers')
//const db_helpers = require('../helpers').data
const knex = require('../../server/db/connection')

createSport.createProfessionalSport(knex, '103', 'MLB', 'MLBv3StatsClient', 'getTeamsActivePromise')

