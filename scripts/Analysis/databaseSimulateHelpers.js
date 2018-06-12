const Game = require('./GameClass.js')
const Team = require('./TeamClass.js')

//function to pull the past games, to use if we want to update elos, or to test simulation for other sports
const pullPastGames = (knex, day) =>
{
    return knex('sports.schedule')
        .where('sports.schedule.day_count', "<", day) //need to test if want to go past today, or e this day count
        .innerJoin('sports.results','sports.results.global_game_id','sports.schedule.global_game_id')
        .select('sports.results.global_game_id', 'sports.schedule.home_team_id', 
        'sports.results.home_team_score','sports.schedule.away_team_id', 'sports.results.away_team_score',
        'sports.results.winner','sports.schedule.sport_id')
        .then(game => {
            //console.log(game)
            return game})
}

//this would be the normal simulate function, used to pull the future games 
const pullFutureGames = (knex, day) =>
{
    return knex('sports.schedule')
        .where('sports.schedule.day_count', ">", day) //need to test if want to go past today, or include this day count
        .innerJoin('sports.results','sports.results.global_game_id','sports.schedule.global_game_id')
        .select('sports.results.global_game_id', 'sports.schedule.home_team_id', 
        'sports.results.home_team_score','sports.schedule.away_team_id', 'sports.results.away_team_score',
        'sports.results.winner','sports.schedule.sport_id')
        .then(game => {
            //console.log(game)
            return game})
}

//pulls the teams info from knex, merging elo and the standings
const getTeamInfo = (knex) => 
{
    return knex('sports.team_info')
        .innerJoin('sports.standings', 'sports.standings.team_id', 'sports.team_info.team_id')
        .innerJoin('analysis.current_elo','analysis.current_elo.team_id', 'sports.team_info.team_id')
        .select('*')
        .then(teams => {
            return teams})

}

//uses the team info to create all the Teams in a class. Places it into an object, which it returns, containing all instances of the class
async function createTeams(knex) {
    var all_teams = {101:{}, 102:{},103:{},104:{},105:{},106:{},107:{}}
    return getTeamInfo(knex)
        .then(teams => {
            teams.forEach(team => {
                all_teams[team.sport_id][team.team_id]= new Team(team.name, team.sport_id, team.elo, team.wins, team.losses, team.ties, team.division, team.conference_id, team.team_id)
            })
        return all_teams
    })
}

//creates an array of unplayed games by sport, with each game a member of the class Game
const createGamesArray = async (knex, all_teams, day) => {
    all_games = {101:[], 102:[],103:[],104:[],105:[],106:[],107:[]}
    return pullFutureGames(knex, day)
    .then(games => {
        games.forEach(game => {
            all_games[game.sport_id].push(new Game(game.global_game_id, all_teams[game.sport_id][game.home_team_id], all_teams[game.sport_id][game.away_team_id], game.sport_id))
        })
    return all_games
    })}


//creates an array of played games by sport, with the past games, to use either for updating elos or testing simulate functions
const createPastGamesArray = (all_teams, day) => {
    all_games = {101:[], 102:[],103:[],104:[],105:[],106:[],107:[]}
    return pullPastGames(knex, day)
    .then(games => {
        games.forEach(game => {
            all_games[game.sport_id].push(new Game(game.global_game_id, all_teams[game.sport_id][game.home_team_id], all_teams[game.sport_id][game.away_team_id], game.sport_id))
        })
    return all_games
    })}

module.exports = {createGamesArray, createPastGamesArray, createTeams}