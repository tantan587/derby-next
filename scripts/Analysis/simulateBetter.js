const knex = require('../../server/db/connection')
const fantasyHelpers = require('../../server/routes/helpers/fantasyHelpers')
const eloHelpers = require('./elo_helpers.js')
const Game = require('./GameClass.js')
const Team = require('./TeamClass.js')


const pullPastGames = (knex) =>
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
                all_teams[team.sport_id][team.team_id]= new Team(team.name, team.sport_id, team.elo, team.wins, team.losses, team.division, team.conference_id, team.sport_id)
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

//function which simulates MLB season
const simulateMLB = (all_games_list, teams) => {
    var simulations = 10
    const mlb_teams = individualSportTeams(teams, "103")
    //console.log(mlb_teams)
    //console.log(mlb_games)
    for(var x=0; x<simulations; x++){
        all_games_list['103'].forEach(game => {game.play_game()})
        //console.log(teams_div_conf)
        mlb_teams.sort(function(a,b){return b.wins-a.wins})
        //find both world series participants
        let WS_from_NL = simulateAndFindWSTeams(mlb_teams.filter(team => team.conference === '10302'))
        let WS_from_AL = simulateAndFindWSTeams(mlb_teams.filter(team => team.conference === '10301'))
        let WS_teams = WS_from_AL.wins > WS_from_NL.wins ? [WS_from_AL, WS_from_NL]:[WS_from_NL, WS_from_AL]
        WS_teams.forEach(team=>{team.finalist++})
        let WS_Winner = Series(WS_teams[0], WS_teams[1],7, '103', 4)
        WS_Winner.champions++
        //console.log(WS_teams)
        //console.log("Champ: ", WS_Winner.name)
        //console.log(NL_one)
        mlb_teams.forEach(team => {
            team.reset()})}
        //console.log(`${teams[team].name}: ${teams[team].wins}/${teams[team].losses}, defaultElo: ${teams[team].defaultElo}, finalElo: ${teams[team].elo}`)})
    mlb_teams.forEach(team => {
        team.averages(simulations)
        console.log(team.average_playoff_wins)
        console.log(`${team.name}: ${team.average_wins}/${team.average_losses}`)
    })
    //console.log(mlb_teams)
    //return mlb_teams
    process.exit()
    }

async function work()
{
    let all_teams = await createTeams()
    //console.log(all_teams)
    //console.log(all_teams[103103])
    return createGamesArray(all_teams)
        .then(games => {
            simulateMLB(games, all_teams)
            })
            
}


const individualSportTeams = (all_teams, sport_id) => {
    let sport_teams = Object.keys(all_teams[sport_id]).map(team => {return all_teams[sport_id][team]})
    return sport_teams
}

//creates wildcards from a conference, adds a playoff appearance, plays their game, returns a winner, and adds a win to playoff results
const create_wildcards = (potential_wildcards, all_teams, sport_id) => {
    var first = potential_wildcards.shift().Team_ID 
    var second = potential_wildcards.shift().Team_ID
    all_teams[first].pApp += 1
    all_teams[second].pApp += 1
    let results = eloHelpers.gameSimulate(first, second, sport_id, all_teams)
    all_teams[results[0]].playoff_wins += 1 //adds a playoff win for whoever won the game
    return results[0]
}


//Function to simulate an entire series - round is what round of the playoffs this is (1,2,3, etc.)
const Series = (home, away, games, sport_id, round) => {
    round --
    let clinch = Math.ceil(games/2)
    let homeGames = [0,1,4,6]
    let roadGames = [2,3,5]
    let x = 0
    while(home.playoff_wins[round] < clinch && away.playoff_wins[round] < clinch){
        let results = homeGames.includes(x) ? eloHelpers.simulateGame(home, away, sport_id):eloHelpers.simulateGame(away, home, sport_id)
        results[0].playoff_wins[round]++
        x++
    }
    if(home.playoff_wins[round] === clinch){
        return home
    } else{
        return away
    }
} 

//function simulates up until the world series, and returns the world series participant from either AL/NL
const simulateAndFindWSTeams = (conference_teams) => {
    let playoffs = []
    let one_seed = conference_teams.shift()
    let two_seed = conference_teams.find(team => {return team.division != one_seed.division})
    let three_seed = conference_teams.find(team => {return team.division != one_seed.division && team.division != two_seed.division})
    playoffs.push(one_seed, two_seed, three_seed)
    playoffs.forEach(team => {team.playoff_wins[0] += 1})
    let wildcard_eligible = conference_teams.filter(team => {return playoffs.includes(team) === false})
    playoffs.push(wildcard_eligible[0], wildcard_eligible[1])
    playoffs.forEach(team => {team.playoff_appearances++})
    //playoffs.forEach(team => {console.log(`${team.name}`)})
    let wildcard_winner = Series(playoffs[3], playoffs[4], 1, '103', 1)
    let conference_finalist_one = Series(playoffs[0],wildcard_winner, 5, '103', 2)
    let conference_finalist_two = Series(playoffs[1],playoffs[2], 5, '103', 2)
    //this below figures out who should have homefield advantage in conference finalists by checking if wildcard team won
    let conference_finalists = conference_finalist_one === wildcard_winner ? [conference_finalist_two, conference_finalist_one]:[conference_finalist_one, conference_finalist_two]
    return Series(conference_finalists[0], conference_finalists[1], 7, '103', 3)
}

//simulate NBA Season, reset, repeat, over multiple simulations
const simulateNBA = (all_games_list, teams) => {
    var simulations = 1
    const nba_teams = individualSportTeams(teams, "101")
    for(var x=0; x<simulations; x++){
        all_games_list['101'].forEach(game => {game.play_game()})
        nba_teams.sort(function(a,b){return b.wins-a.wins})
        //find both NBA finalists
        let NBA_East_Champ = simulateConferencePlayoffs(nba_teams.filter(team => team.conference === '10101'))
        let NBA_West_Champ = simulateConferencePlayoffs(nba_teams.filter(team => team.conference === '10102'))
        let NBA_finalists = moreWins(NBA_East_Champ, NBA_West_Champ)
        let NBA_Champ = Series(NBA_finalists[0], NBA_finalists[1], 7, '101', 4)
        NBA_Champ.champions++
        //console.log(NL_one)
        nba_teams.forEach(team => {
            team.reset()})}
        //console.log(`${teams[team].name}: ${teams[team].wins}/${teams[team].losses}, defaultElo: ${teams[team].defaultElo}, finalElo: ${teams[team].elo}`)})
    nba_teams.forEach(team => {
        team.averages(simulations)
        console.log(team.average_playoff_wins)
        console.log(`${team.name}: ${team.average_wins}/${team.average_losses}`)
    })
    //return nba_teams
    process.exit()
    }

const simulateConferencePlayoffs = (conference) => {
    let playoffs = conference.slice(0,8)
    playoffs.forEach(team => {team.playoff_appearances++})
    let next_round = []
    let teams_remaining = playoffs.length
    console.log(playoffs)
    for(var round=1; round<4; round++){ //rounds
        for(y=0; y<(teams_remaining/2); y++){
            console.log(playoffs.length)
            let a = playoffs.shift()
            let b = playoffs.pop()
            let teams = moreWins(a,b)
            let winner = Series(teams[0], teams[1], 7, '101', round)
            next_round.push(winner)
        }
        playoffs.push(...next_round)
        next_round.length = 0
        teams_remaining = playoffs.length
        }
    playoffs[0].finalist++
    return playoffs[0]
    }

const moreWins = (team_a, team_b) => {
    let teams = team_a.wins > team_b.wins ? [team_a,team_b]:[team_b,team_a]
    return teams
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