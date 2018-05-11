const knex = require('../server/db/connection')
const fantasyHelpers = require('../server/routes/helpers/fantasyHelpers')
const eloHelpers = require('./elo_helpers.js')

const updateOneElo = (knex, team_id, team_elo) =>
{
    return knex
        .withSchema('analysis')
        .table('elo')
        .where('team_id', team_id)    
        .update('elo',team_elo)
        .then(() => {
            var today = new Date()
            return knex
            .withSchema('analysis')
            .table('historical_elo')
            .insert({'team_id': team_id, 'elo': team_elo, 'date': today})
            .then(() => {console.log('done')})
})}

const getTodaysGames = (knex) =>
{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    } 

    if(mm<10) {
        mm = '0'+mm
    } 
    var dayCount = fantasyHelpers.getDayCount(yyyy, mm, dd)
    console.log(dayCount)
    return knex('sports.schedule')
        .where('sports.schedule.day_count', dayCount)
        .innerJoin('sports.results','sports.results.global_game_id','sports.schedule.global_game_id')
        .innerJoin('analysis.current_elo as a', 'sports.schedule.home_team_id', 'a.team_id')
        .leftJoin('analysis.current_elo as b', 'sports.schedule.away_team_id', 'b.team_id')
        //.innerJoin('analysis.elo', 'sports.schedule.away_team_id', 'analysis.elo.team_id')
        .select('sports.results.global_game_id', 'sports.schedule.home_team_id', 
        'sports.results.home_team_score','sports.schedule.away_team_id', 'sports.results.away_team_score',
        'sports.results.winner','sports.schedule.sport_id','a.elo as home_team_elo','b.elo as away_team_elo')
        .then(game => {
            console.log(game)
            return game})
    }

async function calculate_new_elos()
{
    return getTodaysGames(knex)
    .then(x => {
        let new_elos = []
        x.map(game => {
            let home_court = eloHelpers.leagues[game.sport_id].home_advantage //this needs to be adjusted for neutral court games later
            let elo_difference = game.home_team_elo - game.away_team_elo + home_court
            let home_win_value = game.winner === 'H' ? 1:0
            let margin = game.home_team_score - game.away_team_score
            let elo_adjust = eloHelpers.leagues[game.sport_id].elo_adjust //needs to be adjusted for playoffs, with different elo-adjust. 
            /*if (game.sport_id = 103){ //what is the best way to do this for multiple sports?
                elo_adjust = 4
            }*/
            let home_win_chance = 1/(Math.pow(10,(-1*elo_difference/400))+1)
            console.log('work')
            let margin_adjust = eloHelpers.leagues[game.sport_id].MOVmod(margin, elo_difference)
            console.log(margin_adjust)
            let home_new_elo = Number(game.home_team_elo) + elo_adjust*(home_win_value-home_win_chance)*margin_adjust
            let away_new_elo = Number(game.away_team_elo) + elo_adjust*(home_win_chance-home_win_value)*margin_adjust //Same thing as awayVal-awayWin: math follows: 1-winVal - (1-winChance) = 1 - winVal - 1 + winChance = winChance-winVal
            //updateElos(knex, game.home_team_id, home_new_elo)
            //updateElos(knex, game.away_team_id, away_new_elo)
            new_elos.push({team_id: game.home_team_id, elo: home_new_elo},{team_id: game.away_team_id, elo: away_new_elo})
        })
        console.log(new_elos)
        return new_elos
        //process.exit()
    })
    .catch(function(err){console.log('mistake')})
}

async function updateElos()
{
    let elo_adjusted = await calculate_new_elos()
    for(team in elo_adjusted){
        let prom = await updateOneElo(knex, elo_adjusted[team]['team_id'], elo_adjusted[team]['elo'])
    }
    process.exit()
}

updateElos()