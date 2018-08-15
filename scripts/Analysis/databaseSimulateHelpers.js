const Game = require('./GameClass.js')
const Team = require('./TeamClass.js')

const getSportStructures = async (knex) => {
    let structures = 
        await knex('fantasy.sports_structure')
        .innerJoin('fantasy.league_bundle', 'fantasy.league_bundle.league_bundle_id', 'fantasy.sports_structure.league_bundle_id')
        .select('*')
    
    return structures
}

const yearSeasonIds = async (knex) => {
    let seasons = 
        await knex('sports.sport_season')
            .select('*')
    
    let year_season = {}
    seasons.forEach(season =>{
        if(!(season.sport_id in year_season)){
            year_season[season.sport_id] = {}
        }
        if(!(season.year in year_season[season.sport_id])){
            year_season[season.sport_id][season.year] = []
        }
        year_season[season.sport_id][season.year].push(season.sport_season_id)
    })

    return year_season
}

//function to pull the past games, to use if we want to update elos, or to test simulation for other sports
const pullPastGames = (knex, day) =>
{
    return knex('sports.schedule')
        .where('sports.schedule.day_count', "<", day) //need to test if want to go past today, or e this day count
        //.where('season_type',1) 
        .select('*')
        .then(game => {
            //console.log(game)
            return game})
}

//this would be the normal simulate function, used to pull the future games 
const pullFutureGames = async (knex, day) =>
{
    let schedules = 
        await knex('sports.schedule')
            .leftOuterJoin('sports.sport_season', 'sports.schedule.sport_season_id', 'sports.sport_season.sport_season_id')
            .where('sports.schedule.day_count', ">", day) //need to test if want to go past today, or include this day count
            .where('sports.schedule.season_type',1) 
            .whereNot('sports.schedule.status', 'Postponed')
            //.whereIn('sport_season_id',"<",22)
            .select('*')
    return schedules
}

const pullCBBGames2018 = async (knex) =>
{
    let cbb_2018_games = 
        await knex('sports.schedule')
            .leftOuterJoin('sports.sport_season', 'sports.schedule.sport_season_id', 'sports.sport_season.sport_season_id')
            .where('sports.schedule.year', 2018)
            .where('sports.schedule.season_type',1) 
            .where('sports.sport_season.sport_id', 106)
            .whereNot('sports.schedule.status', 'Postponed')
            //.whereIn('sport_season_id',"<",22)
            .select('*')
    
    return cbb_2018_games

}

const pullCFBGames2017 = async (knex) =>
{
    let cfb_2017_games = 
        await knex('sports.schedule')
            .leftOuterJoin('sports.sport_season', 'sports.schedule.sport_season_id', 'sports.sport_season.sport_season_id')
            .where('sports.schedule.year', 2018)
            .where('sports.schedule.season_type',1) 
            .where('sports.sport_season.sport_id', 105)
            .whereNot('sports.schedule.status', 'Postponed')
            //.whereIn('sport_season_id',"<",22)
            .select('*')
    
    return cfb_2017_games

}

//pulls the teams info from knex, merging elo and the standings
const getTeamInfo = (knex) => 
{
    return knex('sports.team_info')
        .innerJoin('sports.standings', 'sports.standings.team_id', 'sports.team_info.team_id')
        .leftOuterJoin('sports.playoff_standings', function(){
            this.on('sports.playoff_standings.year','=', 'sports.standings.year').andOn('sports.playoff_standings.team_id','=', 'sports.standings.team_id')
        })
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
                //below added in to make sport season ids work
                if(!(team.year in all_teams[team.sport_id])){
                    all_teams[team.sport_id][team.year] = {}
                }
                //test formula with no wins for every team
                all_teams[team.sport_id][team.year][team.team_id]= new Team(team.name, team.sport_id, team.elo, team.wins, team.losses, team.ties, team.division,
                     team.conference_id, team.team_id, team.sport_season_id, team.year, team.playoff_wins, team.playoff_losses, team.playoff_status)
                //actual formula below
                // all_teams[team.sport_id][team.team_id]= new Team(team.name, team.sport_id, team.elo, team.wins, team.losses, team.ties, team.division, team.conference_id, team.team_id)
            })
        return all_teams
    })
}

//creates an array of unplayed games by sport, with each game a member of the class Game
const createGamesArray = async (knex, all_teams, day) => {
    let all_games = {101:{}, 102:{},103:{},104:{},105:{},106:{},107:{}}
    let games = await pullFutureGames(knex, day)
    games.forEach(game => {
        if(!(game.year in all_games[game.sport_id])){
            all_games[game.sport_id][game.year] = []
        }
        all_games[game.sport_id][game.year].push(new Game(game.global_game_id, all_teams[game.sport_id][game.year][game.home_team_id], all_teams[game.sport_id][game.year][game.away_team_id], game.sport_id, game.sport_season_id))
    })
    let cbb_games = await pullCBBGames2018(knex)
    let cfb_games = await pullCFBGames2017(knex)
    all_games[106][2018] = []
    all_games[105][2017] = []
    cbb_games.forEach(game =>{
        all_games[106][2018].push(new Game(game.global_game_id, all_teams[106][2019][game.home_team_id], all_teams[106][2019][game.away_team_id], game.sport_id, game.sport_season_id))
    })
    cfb_games.forEach(game =>{
        all_games[105][2017].push(new Game(game.global_game_id, all_teams[105][2018][game.home_team_id], all_teams[105][2018][game.away_team_id], game.sport_id, game.sport_season_id))
    })
    return all_games
}


//creates an array of played games by sport, with the past games, to use either for  testing simulate functions
const createPastGamesArray = (all_teams, day) => {
    all_games = {101:[], 102:[],103:[],104:[],105:[],106:[],107:[]}
    return pullPastGames(knex, day)
    .then(games => {
        games.forEach(game => {
            all_games[game.sport_id].push(new Game(game.global_game_id, all_teams[game.sport_id][game.home_team_id], all_teams[game.sport_id][game.away_team_id], game.sport_id))
        })
    return all_games
    })}

//creates an array of played games by sport, with the past games, to use either for updating elos
const createPastGamesArrayWithScores = async (knex, all_teams, day) => {
    all_games = {101:[], 102:[],103:[],104:[],105:[],106:[],107:[]}
    return pullPastGames(knex, day)
    .then(games => {
        games.forEach(game => {
            all_games[game.sport_id].push(new Game(game.global_game_id, all_teams[game.sport_id][game.year][game.home_team_id], all_teams[game.sport_id][game.year][game.away_team_id], game.sport_id, game.sport_season_id, game.year, game.home_team_score, game.away_team_score))
        })
    return all_games
    })}

const getPointsStructure = async (knex, scoring_type = 1) => {
    return knex
        .withSchema('fantasy')
        .table('scoring')
        .where('scoring_type_id', scoring_type)
        .then((points)=>{
        let point_map = {}
        points.forEach(structure => {
            points_map[strucure.sport_id] = {...structure}
        })
        return point_map
        })
    }
module.exports = {createGamesArray, createPastGamesArray, createTeams, createPastGamesArrayWithScores, getSportStructures, yearSeasonIds}