//const db_helpers = require('../helpers').data
const createSport = require('./create_sport_helpers')
//const db_helpers = require('../helpers').data
const knex = require('../../server/db/connection')

createSport.createSoccerLeague(knex, '107', 'EPL', 'Soccerv3StatsClient', 'getCompetitionFixturesLeagueDetailsPromise', 1)

