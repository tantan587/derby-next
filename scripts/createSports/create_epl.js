//const db_helpers = require('../helpers').data
const createSport = require('./create_sport_helpers')
//const db_helpers = require('../helpers').data
const knex = require('../../server/db/connection')

createSport.createSoccerLeague(knex, '107', 'EPL', 'Soccerv3StatsClient', 'getSeasonTeamsPromise', 64, 37)

//2018 season id: 37
//2019 season id: 64