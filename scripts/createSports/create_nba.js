//const db_helpers = require('../helpers').data
const knex = require('../../server/db/connection')
const createSport = require('./create_sport_helpers')



createSport.createProfessionalSport(knex, '101', 'NBA', 'NBAv3StatsClient', 'getTeamsActivePromise')


  
