const knex = require('../../server/db/connection')
//const fantasyHelpers = require('../../server/routes/helpers/fantasyHelpers')
const leagues = require('./leagues.js')
const Game = require('./GameClass.js')
const Team = require('./TeamClass.js')
const simulateHelpers = require('./simulateHelpers.js')

//function to pull the past games, to use if we want to update elos, or to test simulation for other sports
const pullPastGames = (knex) =>
{
    var today = new Date(); 
    var dayCount = simulateHelpers.dayCount(today)
    return knex('sports.schedule')
        .where('sports.schedule.day_count', "<", dayCount) //need to test if want to go past today, or include this day count
        .innerJoin('sports.results','sports.results.global_game_id','sports.schedule.global_game_id')
        .select('sports.results.global_game_id', 'sports.schedule.home_team_id', 
        'sports.results.home_team_score','sports.schedule.away_team_id', 'sports.results.away_team_score',
        'sports.results.winner','sports.schedule.sport_id')
        .then(game => {
            //console.log(game)
            return game})
}

//this would be the normal simulate function, used to pull the future games 
const pullFutureGames = (knex) =>
{
    var today = new Date()
    var dayCount = simulateHelpers.dayCount(today)
    console.log(dayCount)
    return knex('sports.schedule')
        .where('sports.schedule.day_count', ">", dayCount) //need to test if want to go past today, or include this day count
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
async function createTeams() {
    var all_teams = {101:{}, 102:{},103:{},104:{},105:{},106:{},107:{}}
    return getTeamInfo(knex)
        .then(teams => {
            teams.forEach(team => {
                all_teams[team.sport_id][team.team_id]= new Team(team.name, team.sport_id, team.elo, team.wins, team.losses, team.division, team.conference_id, team.sport_id, team.team_id)
            })
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

//creates an array of played games by sport, with the past games, to use either for updating elos or testing simulate functions
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
    const sport_teams = individualSportTeams(teams, sport_id)
    for(var x=0; x<simulations; x++){
        all_games_list[sport_id].forEach(game => {game.play_game()})
        sport_teams.sort(function(a,b){return b.wins-a.wins})
        //find both finalists
        let finalist_1 = leagues[sport_id].playoffFunction(sport_teams.filter(team => team.conference === leagues[sport_id].conferences[0]))
        let finalist_2 = leagues[sport_id].playoffFunction(sport_teams.filter(team => team.conference === leagues[sport_id].conferences[1]))
        let finalists = simulateHelpers.moreWins(finalist_1, finalist_2)
        finalists.forEach(team=>{team.finalist++})
        let champion = sport_id === '102' ? simulateHelpers.Series(finalists[0], finalists[1],1, sport_id, 4,neutral = true):SeriesAgain(finalists[0], finalists[1],7, sport_id, 4)
        champion.champions++
        sport_teams.forEach(team => {
            team.reset()})}
        //console.log(`${teams[team].name}: ${teams[team].wins}/${teams[team].losses}, defaultElo: ${teams[team].defaultElo}, finalElo: ${teams[team].elo}`)})
    sport_teams.forEach(team => {
        team.averages(simulations)
        console.log(team.average_playoff_wins)
        console.log(`${team.name}: ${team.average_wins}/${team.average_losses}`)
    })
    return sport_teams
    //process.exit()
    }

//function to simulate CFB - also figures out most likely playoff teams using formula
const simulateCFB = (all_games_list, teams, simulations = 10) => {
    const cfb_teams = individualSportTeams(teams, '105')
    for(var x=0; x<simulations; x++){
        all_games_list['105'].forEach(game => {game.play_game()})
        cfb_teams.sort(function(a,b){return b.wins-a.wins})
        //play the conference championship games, add winners to array conference champions
        const conference_ids = [10501, 10502, 10503, 10504, 10505]
        let conference_champions = conference_ids.map(id => {return leagues[105].playoffFunction(cfb_teams.filter(team => team.conference_id === id))})
        //calculate there CFB playoff value, sort them from highest to lowest, and put the four highest teams into playoffs
        cfb_teams.forEach(team => {
            champ_boost = conference_champions.include(team) ? 1:0
            team.calculateCFBValue(champ_boost)})
        cfb_teams.sort(function(a,b){return b.cfb_value - a.cfb_value})
        let playoffs = cfb_teams.slice(0,4)
        playoffs.forEach(team=>{team.playoffs++})
        //find finalists, add finalist value, play championship, add champ value
        let finalist_1 = simulateHelpers.Series(playoffs[0],playoffs[3],1,'105',1,neutral=true)
        let finalist_2 = simulateHelpers.Series(playoffs[1],playoffs[2],1,'105',1,neutral=true)
        finalist_1.finalist++
        finalist_2.finalist++
        let champion = simulateHelpers.Series(finalist_1, finalist_2,1,'105', 2,neutral=true)
        champion.champions++
        cfb_teams.forEach(team =>{team.reset})
    }
    cfb_teams.forEach(team => {
        team.averages(simulations)
    })
    return cfb_teams        
    }


async function work()
{
    let all_teams = await createTeams()
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

