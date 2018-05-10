
const knex = require('../server/db/connection')
const fantasyHelpers = require('../server/routes/helpers/fantasyHelpers')
const eloHelpers = require('./elo_helpers.js')
const classes = require('./elo_classes.js')

const pull_future_games = (knex) =>
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
        .where('sports.schedule.day_count', ">", dayCount) //need to test if want to go past today, or include this day count
        .innerJoin('sports.results','sports.results.global_game_id','sports.schedule.global_game_id')
        //.innerJoin('analysis.elo as a', 'sports.schedule.home_team_id', 'a.team_id')
        //.leftJoin('analysis.elo as b', 'sports.schedule.away_team_id', 'b.team_id')
        //.innerJoin('analysis.elo', 'sports.schedule.away_team_id', 'analysis.elo.team_id')
        .select('sports.results.global_game_id', 'sports.schedule.home_team_id', 
        'sports.results.home_team_score','sports.schedule.away_team_id', 'sports.results.away_team_score',
        'sports.results.winner','sports.schedule.sport_id')
        .then(game => {
            //console.log(game)
            return game})
}

const get_team_info = (knex) => 
{
    return knex('sports.team_info')
        .innerJoin('sports.standings', 'sports.standings.team_id', 'sports.team_info.team_id')
        .innerJoin('analysis.current_elo','analysis.current_elo.team_id', 'sports.team_info.team_id')
        .select('*')
        .then(teams => {
            //console.log('working')
            return teams})

}

async function create_teams() {
    all_teams = {}
    return get_team_info(knex)
        .then(teams => {
            //console.log(teams)
            teams.map(team => {
            all_teams[team.team_id] = new classes.Team(team.name, team.sport_id, team.elo, team.wins, team.losses, team.division, team.conference_id, team.sport_id)
            })
        //all_teams[103111].add_wins(5)
        console.log(all_teams[103103].elo)
        return all_teams
    })
}
/*
async function test() {
    let teams = await create_teams()
    console.log(teams[103130])
    process.exit()
}

test()*/


const simulate_MLB = (all_games_list, teams) => {
    //console.log(all_games_list)
    var simulations = 10000
    const mlb_games = individual_sport_games(all_games_list, "103")
    const mlb_teams = individual_sport_teams(teams, "103")
    //console.log(mlb_games)
    for(var x=0; x<simulations; x++){
        mlb_games.forEach(game => {all_games_list[game].play_game(teams)})
        mlb_teams.forEach(team => {
            teams[team].reset()})}
        //console.log(`${teams[team].name}: ${teams[team].wins}/${teams[team].losses}, defaultElo: ${teams[team].defaultElo}, finalElo: ${teams[team].elo}`)})
    mlb_teams.forEach(team => {
        teams[team].averages(simulations)
        console.log(`${teams[team].name}: ${teams[team].aWins}/${teams[team].aLosses}`)})
    process.exit()
    }

const create_games_array = () => {
    all_games = {}
    return pull_future_games(knex)
    .then(games => {
        games.map(game => {
            all_games[game.global_game_id] = new classes.Game(game.global_game_id, game.home_team_id, game.away_team_id, game.sport_id)
        })
    all_games_keys = Object.keys(all_games)
    console.log(all_games[90011921].sport_id)
    return all_games
    })}


async function work()
{
    let all_teams = await create_teams()
    //console.log(all_teams[103103])
    return create_games_array()
        .then(games => {
            simulate_MLB(games, all_teams)
})
}

const individual_sport_games = (all_games, sport_id) => {
    return Object.keys(all_games).filter(game => all_games[game].sport_id === sport_id)
}

const individual_sport_teams = (all_teams, sport_id) => {
    return Object.keys(all_teams).filter(team => all_teams[team].sport_id === sport_id)
}

work()