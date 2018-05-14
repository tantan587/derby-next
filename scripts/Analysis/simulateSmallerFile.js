const knex = require('../../server/db/connection')
const fantasyHelpers = require('../../server/routes/helpers/fantasyHelpers')
const eloHelpers = require('./elo_helpers.js')
const Game = require('./GameClass.js')
const Team = require('./TeamClass.js')
const simulateHelpers = require('./simulateHelpers.js')
const playoffFunctions = require('./playoffFunctions.js')


const pullPastGames = (knex) =>
{
    var today = new Date(); 
    var dayCount = simulateHelpers.dayCount(today)
    return knex('sports.schedule')
        .where('sports.schedule.day_count', "<", dayCount) //need to test if want to go past today, or include this day count
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

const pullFutureGames = (knex) =>
{
    var today = new Date()
    var dayCount = simulateHelpers.dayCount(today)
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

const getTeamInfo = (knex) => 
{
    return knex('sports.team_info')
        .innerJoin('sports.standings', 'sports.standings.team_id', 'sports.team_info.team_id')
        .innerJoin('analysis.current_elo','analysis.current_elo.team_id', 'sports.team_info.team_id')
        .select('*')
        .then(teams => {
            //console.log('working')
            return teams})

}

async function createTeams() {
    var all_teams = {101:{}, 102:{},103:{},104:{},105:{},106:{},107:{}}
    return getTeamInfo(knex)
        .then(teams => {
            //console.log(teams)
            teams.forEach(team => {
                //console.log(team.team_id)
                all_teams[team.sport_id][team.team_id]= new Team(team.name, team.sport_id, team.elo, team.wins, team.losses, team.division, team.conference_id, team.sport_id, team.team_id)
            })
        //all_teams[103111].add_wins(5)
        //console.log(all_teams[103103].elo)
        //console.log(all_teams)
        return all_teams
    })
}

//creates an array of unplayed games by sport, with each game a member of the class Game
const createGamesArray = (all_teams) => {
    all_games = {101:[], 102:[],103:[],104:[],105:[],106:[],107:[]}
    return pullFutureGames(knex)
    .then(games => {
        games.forEach(game => {
            all_games[game.sport_id].push(new Game(game.global_game_id, all_teams[game.sport_id][game.home_team_id], all_teams[game.sport_id][game.away_team_id], game.sport_id))
        })
    return all_games
    })}

//creates an array of unplayed games by sport, with each game a member of the class Game
const createPastGamesArray = (all_teams) => {
    all_games = {101:[], 102:[],103:[],104:[],105:[],106:[],107:[]}
    return pullPastGames(knex)
    .then(games => {
        games.forEach(game => {
            all_games[game.sport_id].push(new Game(game.global_game_id, all_teams[game.sport_id][game.home_team_id], all_teams[game.sport_id][game.away_team_id], game.sport_id))
        })
    return all_games
    })}

//function which simulates NBA, NFL, NHL, MLB - default set to 10 for now to modify later
const simulateProfessionalLeague = (all_games_list, teams, sport_id, simulations = 10) => {
    //var simulations = 10
    const sport_teams = individualSportTeams(teams, sport_id)
    //console.log(mlb_teams)
    //console.log(mlb_games)
    for(var x=0; x<simulations; x++){
        all_games_list[sport_id].forEach(game => {game.play_game()})
        //console.log(teams_div_conf)
        sport_teams.sort(function(a,b){return b.wins-a.wins})
        //find both world series participants
        console.log(sport_id)
        console.log(sport_teams[0])
        let finalist_1 = eloHelpers.leagues[103].playoffFunction(sport_teams.filter(team => team.conference === eloHelpers.leagues[sport_id].conferences[0]))
        console.log('works')
        let finalist_2 = eloHelpers.leagues[sport_id].playoffFunction(sport_teams.filter(team => team.conference === eloHelpers.leagues[sport_id].conferences[1]))
        let finalists = simulateHelpers.moreWins(finalist_1, finalist_2)
        finalists.forEach(team=>{team.finalist++})
        let champion = sport_id === '102' ? simulateHelpers.Series(finalists[0], finalists,1, sport_id, 4,neutral = true):simulateHelpers.Series(finalists[0], finalists,7, sport_id, 4)
        champion.champions++
        //console.log(WS_teams)
        //console.log("Champ: ", WS_Winner.name)
        //console.log(NL_one)
        sport_teams.forEach(team => {
            team.reset()})}
        //console.log(`${teams[team].name}: ${teams[team].wins}/${teams[team].losses}, defaultElo: ${teams[team].defaultElo}, finalElo: ${teams[team].elo}`)})
    sport_teams.forEach(team => {
        team.averages(simulations)
        console.log(team.average_playoff_wins)
        console.log(`${team.name}: ${team.average_wins}/${team.average_losses}`)
    })
    //console.log(mlb_teams)
    return sport_teams
    //process.exit()
    }

async function work()
{
    let all_teams = await createTeams()
    //console.log(all_teams)
    //console.log(all_teams[103103])
    return createGamesArray(all_teams)
        .then(games => {
            let mlb_teams = simulateProfessionalLeague(games, all_teams, '103')
            simulateHelpers.updateProjections(knex,mlb_teams)
            .then(a => {process.exit()})
            })
            
}

const individualSportTeams = (all_teams, sport_id) => {
    let sport_teams = Object.keys(all_teams[sport_id]).map(team => {return all_teams[sport_id][team]})
    return sport_teams
}

async function testFunctionsWithPastGames()
{
    let all_teams = await createTeams()
    //console.log(all_teams)
    //console.log(all_teams[103103])
    return createPastGamesArray(all_teams)
        .then(games => {
            simulateNBA(games, all_teams)

})
}

//testFunctionsWithPastGames()

work()