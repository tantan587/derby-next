
const knex = require('../../server/db/connection')
const createSport = require('./create_sport_helpers')

createSport.createCollegeSport(knex, '105', 'CFB', 'CFBv3ScoresClient', 'getConferenceHierarchyPromise')


