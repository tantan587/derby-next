const hash = require('object-hash')

const knex = require('../../server/db/connection')
const initialElos = require('../createSports/initialElos')
const simulateHelpers = require('./simulateHelpers')
const dbSimulateHelpers = require('./databaseSimulateHelpers')

// const t = async () => {

//     let playoff_teams = await knex('sports.playoff_standings').where('team_id',"<",103999).andWhere('team_id',">",103000).andWhere('playoff_status',">",2).select('team_id')
//     let p = playoff_teams.map(team => team.team_id)
//     console.log(p)
// }


// initialElos.create_initial_elos(knex)

const m = async () => {
    const sport_structures = await dbSimulateHelpers.getSportStructures(knex)
    const year_seasons = await dbSimulateHelpers.yearSeasonIds(knex)

    console.log(sport_structures)
    console.log(year_seasons)
    }

m()