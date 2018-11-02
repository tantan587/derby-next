const knex = require('../../server/db/connection')
const leagues = require('./leagues.js')
const getDayCount = require('./dayCount.js')
const rpiUpdate = require('./cbbRPItracker')


const updateOneElo = (knex, team_id, team_elo, year) =>
{
    return knex
        .withSchema('analysis')
        .table('current_elo')
        .where('team_id', team_id)    
        .andWhere('year', year)
        .update('elo',team_elo)
        .then(() => {
            var today = new Date()
            let dayCount = getDayCount(today)
            return knex
            .withSchema('analysis')
            .table('historical_elo')
            .insert({'team_id': team_id, 'elo': team_elo, 'day_count': dayCount})
            .then(() => {console.log('done')})
})}

const getTodaysGames = (knex) =>
{
    const today = new Date()
    let dayCount = getDayCount(today)
    return knex('sports.schedule')
        .where('sports.schedule.day_count', dayCount-1)
        .whereIn('status', ['Final', 'F/OT', 'F/SO'])
        .innerJoin('analysis.current_elo as a', function(){
            this.on('sports.schedule.home_team_id', '=','a.team_id').andOn('sports.schedule.year', '=', 'a.year')})
        .leftJoin('analysis.current_elo as b', function(){
            this.on('sports.schedule.away_team_id', '=', 'b.team_id').andOn('sports.schedule.year', '=', 'b.year')})
        //.innerJoin('analysis.elo', 'sports.schedule.away_team_id', 'analysis.elo.team_id')
        .select('sports.schedule.*', 'a.elo as home_team_elo','b.elo as away_team_elo')
        .then(game => {
            return game})
    }

async function calculate_new_elos()
{
    return getTodaysGames(knex)
    .then(games => {
        let new_elos = []
        //for college basketball rpi - to add the win values to the database
        let home_wins = []
        let away_wins = []
        let neutral_wins = []
        let home_losses = []
        let away_losses = []
        let neutral_losses = []
        let any_cbb = false
        //currently, we are updating epl games through a different feed.
        let games_for_update = games.filter(game => game.sport_id !== '107')
        games_for_update.map(game => {
            let home_court = leagues[game.sport_id].home_advantage //this needs to be adjusted for neutral court games later
            let elo_difference = game.home_team_elo - game.away_team_elo + home_court
            let home_win_value = game.winner === 'H' ? 1:0
            let margin = game.home_team_score - game.away_team_score
            let elo_adjust = leagues[game.sport_id].elo_adjust //needs to be adjusted for playoffs, with different elo-adjust. 
            let home_win_chance = 1/(Math.pow(10,(-1*elo_difference/400))+1)
            let margin_adjust = leagues[game.sport_id].MOVmod(margin, elo_difference)
            let home_new_elo = Number(game.home_team_elo) + elo_adjust*(home_win_value-home_win_chance)*margin_adjust
            let away_new_elo = Number(game.away_team_elo) + elo_adjust*(home_win_chance-home_win_value)*margin_adjust //Same thing as awayVal-awayWin: math follows: 1-winVal - (1-winChance) = 1 - winVal - 1 + winChance = winChance-winVal
            //updateElos(knex, game.home_team_id, home_new_elo)
            //updateElos(knex, game.away_team_id, away_new_elo)
            new_elos.push({team_id: game.home_team_id, elo: home_new_elo, year: game.year},{team_id: game.away_team_id, elo: away_new_elo, year: game.year})
            //for college basketball rpi
            game.sport_id === '106' ? (
                any_cbb = true,
                home_win_value === 1 ?  (
                    home_wins.push(game.home_team_id), away_losses.push(game.away_team_id)
                ) : home_win_value === 0 ? (
                    home_losses.push(game.home_team_id), away_wins.push(game.away_team_id) 
                ) : ( //this is wrong - this needs to be further updated, will work on it down the line - neutral games added
                    neutral_wins.push(game.home_team_id), neutral_losses.push(game.away_team_id)
                )
            ) : 0
        })
        console.log(new_elos)
        //for college basketball - need to add in that this doesn't happen during the playoffs
        any_cbb ? rpiUpdate.cbbUpdateAllRpi(home_wins, away_wins, neutral_wins, home_losses, away_losses, neutral_losses) : 0
        return new_elos
        //process.exit()
    })
    .catch(function(err){console.log('mistake')})
}

async function updateElos(exitProcess)
{
    let elo_adjusted = await calculate_new_elos()
    for(team in elo_adjusted){
        let prom = await updateOneElo(knex, elo_adjusted[team]['team_id'], elo_adjusted[team]['elo'], elo_adjusted[team]['year'])
    }
    //this is to keep track of each day count that we update the elo for
    let today = new Date()
    let dayCount = getDayCount(today) - 1
    await insertTrueDayCount(knex, 'analysis', 'elo_updates', dayCount)
    if(exitProcess)
        process.exit()
}

const insertTrueDayCount = async (knex, schema, table, day_count) => {
    await knex.withSchema(schema).table(table).insert({day_count: day_count, updated: true})
}

module.exports = {updateElos}

