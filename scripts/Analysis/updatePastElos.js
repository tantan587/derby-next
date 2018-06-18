const knex = require('../../server/db/connection')
const leagues = require('./leagues.js')
const getDayCount = require('./dayCount.js')
const rpiUpdate = require('./cbbRPItracker.js')
const dbSimulateHelpers = require('./databaseSimulateHelpers.js')



const updatePastElos = async (knex) => {
    let all_teams = await dbSimulateHelpers.createTeams(knex)
    var today = new Date()
    //this is the calculation of day count normally:
    let day_count = getDayCount(today)
    const games = await dbSimulateHelpers.createPastGamesArrayWithScores(all_teams,day_count)
    let sports_for_update = ['101', '102', '103', '104', '106']
    let filtered_games = games.filter(game => sports_for_update.includes(game.sport_id))
    filtered_games.forEach(game => {
        let home_court = leagues[game.sport_id].home_advantage //this needs to be adjusted for neutral court games later
        let elo_difference = game.home.elo - game.away.elo + home_court
        let home_win_value = game.home_result > game.away_result ? 1:game.home_result<game.away_result ? 0:.5
        let margin = game.home_result - game.away_result
        let elo_adjust = leagues[game.sport_id].elo_adjust //needs to be adjusted for playoffs, with different elo-adjust. 
        let home_win_chance = 1/(Math.pow(10,(-1*elo_difference/400))+1)
        let margin_adjust = leagues[game.sport_id].MOVmod(margin, elo_difference)
        game.home.elo += elo_adjust*(home_win_value-home_win_chance)*margin_adjust
        game.away.elo += elo_adjust*(home_win_chance-home_win_value)*margin_adjust //Same thing as awayVal-awayWin: math follows: 1-winVal - (1-winChance) = 1 - winVal - 1 + winChance = winChance-winVal
        //below needs to filter out march madness games
        game.sport_id === '106' ? (
            any_cbb = true,
            home_win_value === 1 ?  (
                home_wins.push(game.home.team_id), away_losses.push(game.away.team_id)
            ) : home_win_value === 0 ? (
                home_losses.push(game.home.team_id), away_wins.push(game.away.team_id) 
            ) : ( //this is wrong - this needs to be further updated, will work on it down the line - neutral games added
                neutral_wins.push(game.home.team_id), neutral_losses.push(game.away.team_id)
            )
        ) : 0
    })
    //for college basketball - need to add in that this doesn't happen during the playoffs
    any_cbb ? rpiUpdate.cbbUpdateAllRpi(home_wins, away_wins, neutral_wins, home_losses, away_losses, neutral_losses) : 0
    deleteAndUpdateElos(knex, all_teams)
    .then(()=> {
        console.log('done!')
        process.exit()
    })

}

const deleteAndUpdateElos = (knex, teams) => {
    let teams_for_insert = teams.map(team => {
        return {team_id: team.team_id, elo: team.elo}
    })
    //currently have this going into dummy table, until we are sure this is what we want. Also, don't have premier league yet    
    return knex
        .withSchema('analysis')
        .table('current_elo_test')
        .del()
        .then(()=>{
            return knex
                .withSchema('analysis')
                .table('current_elo_test')
                .insert(teams_for_insert)

    })

}

updatePastElos()