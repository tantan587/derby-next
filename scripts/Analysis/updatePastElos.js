const knex = require('../../server/db/connection')
const leagues = require('./leagues.js')
const getDayCount = require('./dayCount.js')
const rpiUpdate = require('./cbbRPItracker.js')
const dbSimulateHelpers = require('./databaseSimulateHelpers.js')
const simulateHelpers = require('./simulateHelpers.js')


const updatePastElos = async (knex) => {
    let teams =
        await knex('analysis.current_elo')
            //.where('team_id',"<",107000)
            .select('*')
    
    let team_object = {}
    //should make this an object of the year and the team id, like it is elsewhere. 
    //not needed now, but will be needed if it is updating in the middle of a second season
    teams.forEach(team => {
        team_object[team.team_id] = {elo: Number(team.elo), year: team.year}
    })


    
    var today = new Date()
    //this is the calculation of day count normally:
    let day_count = getDayCount(today)
    console.log('day count: ', day_count)

    let schedule = 
        await knex('sports.schedule')
            .where('day_count', "<", day_count)
            .whereNot('sport_id', 107)
            .whereIn('status', ['Final', 'F/OT', 'F/SO'])
            .orderBy('day_count')
            .select('*')
    
    updateElosBySchedule(schedule, team_object)
    //for college basketball - need to add in that this doesn't happen during the playoffs
    //below won't work, since it is just for one game, i don't think...
    //any_cbb ? rpiUpdate.cbbUpdateAllRpi(home_wins, away_wins, neutral_wins, home_losses, away_losses, neutral_losses) : 0
    await deleteAndUpdateElos(knex, team_object, day_count)
    console.log('done!')
    process.exit()

}
//should I add in code to deal with ties in hockey?
const updateElosBySchedule = (game_list, team_list) => {
    game_list.forEach(game => {
        let home_court = leagues[game.sport_id].home_advantage //this needs to be adjusted for neutral court games later
        let elo_difference = team_list[game.home_team_id].elo - team_list[game.away_team_id].elo + home_court
        let home_win_value = game.home_team_score > game.away_team_score ? 1: game.home_team_score < game.away_team_score ? 0:.5
        let margin = game.home_team_score - game.away_team_score
        let elo_adjust = game.season_type === 1 ? leagues[game.sport_id].elo_adjust : leagues[game.sport_id].playoff_elo_adjust //needs to be adjusted for playoffs, with different elo-adjust. 
        let home_win_chance = 1/(Math.pow(10,(-1*elo_difference/400))+1)
        let margin_adjust = leagues[game.sport_id].MOVmod(margin, elo_difference)
        team_list[game.home_team_id].elo += elo_adjust*(home_win_value-home_win_chance)*margin_adjust
        team_list[game.away_team_id].elo += elo_adjust*(home_win_chance-home_win_value)*margin_adjust //Same thing as awayVal-awayWin: math follows: 1-winVal - (1-winChance) = 1 - winVal - 1 + winChance = winChance-winVal

        //keeping code for this in below becasue will be needed to update rpi, if done in bulk, for cbb
        //below needs to filter out march madness games
        // let home_wins = []
        // let home_losses = []
        // let away_losses = []
        // let away_wins = []
        // let neutral_wins = []
        // let neutral_losses = []
        // game.sport_id === '106' ? (
        //     any_cbb = true,
        //     home_win_value === 1 ?  (
        //         home_wins.push(game.home.team_id), away_losses.push(game.away.team_id)
        //     ) : home_win_value === 0 ? (
        //         home_losses.push(game.home.team_id), away_wins.push(game.away.team_id) 
        //     ) : ( //this is wrong - this needs to be further updated, will work on it down the line - neutral games added
        //         neutral_wins.push(game.home.team_id), neutral_losses.push(game.away.team_id)
        //     )
        // ) : 0
    })
}
//this one below isn't used anymore - the old version
const updateElosPerLeague = (sport_id, game_list) => {
    let games = game_list[sport_id]
    games.forEach(game => {
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
        let home_wins = []
        let home_losses = []
        let away_losses = []
        let away_wins = []
        let neutral_wins = []
        let neutral_losses = []
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
}
const deleteAndUpdateElos = async (knex, team_list, today) => {

    let teams_for_insert = Object.keys(team_list).map(team_id =>{
        return {team_id: team_id, elo: team_list[team_id].elo, year: team_list[team_id].year}
    })
    //will need this to be update when have multiple years
    await knex('analysis.current_elo').truncate()
    await knex('analysis.current_elo').insert(teams_for_insert)
    
    let insert_for_historical = teams_for_insert.map(team => {
        return {...team, day_count: today}
    })

    await knex('analysis.historical_elo').insert(insert_for_historical)
}


updatePastElos(knex)