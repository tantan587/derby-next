
const knex = require('../../server/db/connection')
const Game = require('./GameClass.js')
const simulateHelpers = require('./simulateHelpers.js')
const playoffFunctions = require('./playoffFunctions.js')
const dbSimulateHelpers = require('./databaseSimulateHelpers.js')
const getDayCount = require('./dayCount.js')
const db_helpers = require('../helpers.js').data
const points = require('./getPointsStructure.js') //this pulls all the differnet point strtuctures
const randomSchedules = require('./randomSchedules.js')
const math = require('mathjs')
const updateProjections = require('./updateProjections')
const fantasyHelpers = require('../../server/routes/helpers/fantasyHelpers')
const findMissingElos = require('./findMissingElos')
const playoffSimHelpers = require('./playoffSim')

const testFunction = async () => {
    const sport_structures = await dbSimulateHelpers.getSportStructures(knex)
    const year_seasons = await dbSimulateHelpers.yearSeasonIds(knex)
    const seasonTypeIds = await dbSimulateHelpers.findAllCurrentSeasonTypes(knex)

    let all_teams = await dbSimulateHelpers.createTeams(knex)
    let all_points = await points.getScoringTypes(knex)
    var today = new Date()
    //this is the calculation of day count normally:
    let day_count = getDayCount(today)
    const games = await dbSimulateHelpers.createPastGamesArrayWithScores(knex, all_teams, day_count, [3], [101])
    const futureGames = await dbSimulateHelpers.createGamesArray(knex, all_teams, day_count)
    // games[101].forEach(game => {
    //     game.print_game()
    // })
    let nba_teams = simulateHelpers.individualSportTeamsWithYear(all_teams, 101, 2018)
    let playoffTeams = nba_teams.filter(team => {
        return team.playoff_status > 2
    })
    playoffSimHelpers.NBAPlayoffSim(playoffTeams, games[101], games[101], simulateHelpers, playoffFunctions)
    // playoffSimHelpers.buildCurrentPlayoffResults(nba_teams, games[101], 4, 4)
    // nba_teams.forEach(team => {
    //     team.printTeam()
    // })
}

testFunction()


//t()