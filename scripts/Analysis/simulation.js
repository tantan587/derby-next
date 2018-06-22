const knex = require('../../server/db/connection')
//const fantasyHelpers = require('../../server/routes/helpers/fantasyHelpers')
//const leagues = require('./leagues.js')
const Game = require('./GameClass.js')
const Team = require('./TeamClass.js')
const simulateHelpers = require('./simulateHelpers.js')
const playoffFunctions = require('./playoffFunctions.js')
const dbSimulateHelpers = require('./databaseSimulateHelpers.js')
const rpiHelpers = require('./cbbRPItracker.js')
const getDayCount = require('./dayCount.js')
const db_helpers = require('../helpers.js').data
const points = require('./getPointsStructure.js')

async function simulate(knex)
{
    console.log('im in')
    let simulations = 1000
    let all_teams = await dbSimulateHelpers.createTeams(knex)
    let all_points = await points.getPointsStructure(knex)
    var today = new Date()
    //this is the calculation of day count normally:
    let day_count = getDayCount(today)
    //this is the first day of the seasno
    day_count = 1467
    /* this to be added back in later
    rpiHelpers.addRpiToTeamClass(knex,all_teams) */
    const games = await dbSimulateHelpers.createGamesArray(knex, all_teams,day_count)
    //.then(games => {
    const mlb_teams = [[],[]] //await simulateProfessionalLeague(games, all_teams, '103', all_points, simulations)
    //code below to be added in once all simulations tested, ready to go
    const nba_teams = await simulateProfessionalLeague(games, all_teams, '101', all_points, simulations)
    const nfl_teams = [[],[]]//await simulateProfessionalLeague(games, all_teams, '102', all_points, simulations)
    const nhl_teams = [[],[]] //await simulateProfessionalLeague(games, all_teams, '104', all_points, simulations)
    const cfb_teams = [[],[]] //simulateCFB(games, all_teams)
    const cbb_teams = [[],[]] //simulateCBB(games, all_teams)
    const epl_teams = [[],[]] //simulateEPL(games, all_teams)
    //projection team list needs to be the first value of array
    const projection_team_list = [...nba_teams[0], ...nfl_teams[0], ...mlb_teams[0], ...nhl_teams[0], ...cbb_teams[0], ...cfb_teams[0], ...epl_teams[0]]
    const game_projections = [...nba_teams[1], ...mlb_teams[1], ...nfl_teams[1], ...nhl_teams[1]]
    const projections = simulateHelpers.updateProjections(projection_team_list, day_count)
    const fantasy_projections = simulateHelpers.fantasyProjections(all_teams, knex, day_count, all_points)
    //console.log(fantasy_projections)
    //console.log(projections[0])
    return db_helpers.insertIntoTable(knex,'analysis', 'record_projections', projections)
    .then(()=>{
        //the insert for game_projections should be the second value of each array
        return db_helpers.insertIntoTable(knex, 'fantasy', 'projections', fantasy_projections)
        .then(() => {
            return db_helpers.insertIntoTable(knex, 'analysis', 'game_projections', game_projections)
            .then(()=> {
                console.log('done')
                process.exit()
            })
        })
    })
}

//function which simulates NBA, NFL, NHL, MLB - default set to 10 for now to modify later
const simulateProfessionalLeague = async (all_games_list, teams, sport_id, points, simulations = 10) => {
    console.log(simulations)
    const sport_teams = individualSportTeams(teams, sport_id)
    //console.log(leagues)
    let y = 1
    for(var x=0; x<simulations; x++){
        all_games_list[sport_id].forEach(game => {
            //console.log(game)
            sport_id != '104' ? game.play_game(): game.play_NHL_game()
        })
        sport_teams.sort(function(a,b){return b.wins-a.wins})
        //find both finalists
        let finalist_1 = playoffFunctions[sport_id](sport_teams.filter(team => team.conference === league_conference[sport_id][0]), simulateHelpers)
        let finalist_2 = playoffFunctions[sport_id](sport_teams.filter(team => team.conference === league_conference[sport_id][1]), simulateHelpers)
        let finalists = simulateHelpers.moreWins(finalist_1, finalist_2)
        finalists.forEach(team=>{team.finalist++})
        let champion = sport_id === '102' ? simulateHelpers.Series(finalists[0], finalists[1],1, sport_id, 4,neutral = true):simulateHelpers.Series(finalists[0], finalists[1],7, sport_id, 4)
        champion.champions++
        all_games_list[sport_id].forEach(game=>{
            game.adjustImpact()
        })
        sport_teams.forEach(team => {
            team.reset()})}
        //console.log(`${teams[team].name}: ${teams[team].wins}/${teams[team].losses}, defaultElo: ${teams[team].defaultElo}, finalElo: ${teams[team].elo}`)})
    sport_teams.forEach(team => {
        team.averages(simulations)
        /* console.log(team.average_playoff_wins)
        console.log(`${team.name}: ${team.average_wins}/${team.average_losses}`) */
    })
    //shouldn't the below have the impact function? might need to be added in
    //all_games_list[sport_id][0].calculateRawImpact()
    //process.exit()
    let all_champs = 0
    let game_projections = simulateHelpers.createImpactArray(all_games_list, sport_id, knex, points)
    /* return db_helpers.insertIntoTable(knex, 'analysis', 'game_projections', game_projections)
    .then(()=>{
        console.log(sport_teams[0])
        return sport_teams
    }) */
    return [sport_teams, game_projections]
    }

//function to simulate CFB - also figures out most likely playoff teams using formula
//this needs to include something to simulate likely bowl game results, eventually
const simulateCFB = (all_games_list, teams, simulations = 10) => {
    const cfb_teams = individualSportTeams(teams, '105')
    for(var x=0; x<simulations; x++){
        all_games_list['105'].forEach(game => {game.play_game()})
        cfb_teams.sort(function(a,b){return b.wins-a.wins})
        //play the conference championship games, add winners to array conference champions
        const conference_ids = [10501, 10502, 10503, 10504, 10505]
        let conference_champions = conference_ids.map(id => {return playoffFunctions['105'](cfb_teams.filter(team => team.conference_id === id))})
        //calculate there CFB playoff value, sort them from highest to lowest, and put the four highest teams into playoffs
        cfb_teams.forEach(team => {
            champ_boost = conference_champions.includes(team) ? 1:0
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
        cfb_teams.forEach(team =>{team.reset()})
    }
    cfb_teams.forEach(team => {
        team.averages(simulations)
    })
    return cfb_teams
    }

//function to simulate CBB - also figures out most likely march madness teams using formula
const simulateCBB = (all_games_list, teams, simulations = 10) => {
    const cbb_teams = individualSportTeams(teams, '106')
    console.log(simulations)
    for(var x=0; x<simulations; x++){
        //console.log('test')
        all_games_list['106'].forEach(game => {game.play_CBB_game()})
        //below needs to calculate conference wins, not overall wins
        cbb_teams.sort(function(a,b){return b.wins-a.wins})
        //play the conference championship games, add winners to array conference champions
        //following array is all the conference
        const conference_ids = ['10601', '10602', '10603', '10604', '10605', '10606', '10607', '10608',
            '10609', '10610', '10611', '10612', '10613', '10614', '10615', '10616', '10618',
            '10619', '10620', '10621', '10622', '10623', '10624', '10625', '10626',
            '10627', '10628', '10629', '10630', '10631','10632', '10633' ]
        let conference_champions = league_conference['106'].map(id => {return playoffFunctions[106](cbb_teams.filter(team => team.conference === id), simulateHelpers)})
        conference_champions.forEach(team=>{team.playoff_appearances++})
        //calculate RPI
        cbb_teams.forEach(team => {team.calculateRPIWinPercentage()})
        cbb_teams.forEach(team => {team.calculateOpponentWinPercentage()})
        cbb_teams.forEach(team => {team.calculateRPI()})
        //sort by RPI, add in the rank of the RPI for each team
        cbb_teams.sort(function(a,b){return b.cbb_rpi_value - a.cbb_rpi_value})
        let rank = 1
        cbb_teams.forEach(team =>{
            team.cbb_rpi_rank = rank
            rank++
        })
        cbb_teams.forEach(team=>{team.calculateCBBValue()})
        cbb_teams.sort(function(a,b){return b.cbb_value - a.cbb_value})
        let non_conf_champs = cbb_teams.filter(team => conference_champions.includes(team) === false)
        let at_large = non_conf_champs.slice(0,32)
        let last_four = non_conf_champs.slice(32,36)
        let last_four_conference_champions = []
        for(y=0;y<4;y++){last_four_conference_champions.unshift(conference_champions.pop())}
        conference_champions.forEach(team => {team.playoff_wins[0]++})
        at_large.forEach(team=>{
            team.playoff_wins[0]++
            team.playoff_appearances++
        })
        last_four.forEach(team=>{team.playoff_appearances++})
        let last_four_winner_1 = simulateHelpers.Series(last_four[0],last_four[3],1,'106',1,neutral=true)
        let last_four_winner_2 = simulateHelpers.Series(last_four[1],last_four[2],1,'106',1,neutral=true)
        let last_conference_champ_winner_1 = simulateHelpers.Series(last_four_conference_champions[0],last_four_conference_champions[3],1,'106',1,neutral=true)
        let last_conference_champ_winner_2 = simulateHelpers.Series(last_four_conference_champions[1],last_four_conference_champions[2],1,'106',1,neutral=true)
        let march_madness = [...conference_champions, ...at_large, last_four_winner_1, last_four_winner_2,last_conference_champ_winner_1, last_conference_champ_winner_2]
        march_madness.sort(function(a,b){return b.cbb_value - a.cbb_value})
        let next_round = []
        for(let round = 2; round <8; round++){
            if(round === 6){
                march_madness.forEach(team => {team.finalist++})
            }
            while(march_madness.length != 0){
                let team_1 = march_madness.shift()
                let team_2 = march_madness.pop()
                let winner = simulateHelpers.Series(team_1, team_2, 1, '106', round, neutral = true)
                next_round.push(winner)
            }
            march_madness.push(...next_round)
            next_round.length = 0
        }
        march_madness[0].champions++
        all_games_list['106'].forEach(game=>{
            game.adjustImpact()
        })
        cbb_teams.forEach(team =>{
            team.reset()
            team.cbb_reset()
        })
        console.log('test')
    }
    console.log('here')
    cbb_teams.forEach(team => {
        team.averages(simulations)
    })
    let game_projections = simulateHelpers.createImpactArray(all_games_list, '106')

    return [cbb_teams, game_projections]
    }

//function which simulates NBA, NFL, NHL, MLB - default set to 10 for now to modify later
const simulateEPL = (all_games_list, teams, simulations = 10) => {
    const epl_teams = individualSportTeams(teams, '107')
    //console.log(leagues)
    for(let x=0; x<simulations; x++){
        all_games_list[sport_id].forEach(game => {
            //console.log(game)
           game.play_EPL_game()})
        epl_teams.sort(function(a,b){return 2*b.wins+b.ties-2*a.wins-a.ties})
        //find both finalists
        let playoffs = epl_teams.slice(0,4)
        playoffs.forEach(team => {team.playoffs++})
        playoffs[0].champions++
        playoffs[0].finalist++
        playoffs[1].finalist++
        all_games_list['107'].forEach(game=>{game.adjustImpact()})
        epl_teams.forEach(team => {
            team.reset()})}
        //console.log(`${teams[team].name}: ${teams[team].wins}/${teams[team].losses}, defaultElo: ${teams[team].defaultElo}, finalElo: ${teams[team].elo}`)})
    epl_teams.forEach(team => {
        team.averages(simulations)
        console.log(team.average_playoff_wins)
        console.log(`${team.name}: ${team.average_wins}/${team.average_losses}`)
    })
    all_games_list['107'].forEach(game=>{
        console.log(`Home: ${game.home.name}, Away: ${game.away.name}`)
        console.log(game.EOS_results.home.win.regular)
        console.log(game.all_simulate_results.home)
        console.log(game.EOS_results.home.loss.regular)
        console.log(game.last_result.home)
    })
    simulateHelpers.updateProjections(knex,sport_teams)
    return epl_teams
    //process.exit()
    }


const individualSportTeams = (all_teams, sport_id) => {
    let sport_teams = Object.keys(all_teams[sport_id]).map(team => {return all_teams[sport_id][team]})
    return sport_teams
}



async function testFunctionsWithPastGames()
{
    let all_teams = await dbSimulateHelpers.createTeams()
    //console.log(all_teams)
    //console.log(all_teams[103103])
    return dbSimulateHelpers.createPastGamesArray(all_teams)
        .then(games => {
            simulateNBA(games, all_teams)

})
}

//variable that stores conferences for each sport. CBB is missing 10617, which is independents.
const league_conference = {
    101: ['10101', '10102'],
    102: ['10201', '10202'],
    103: ['10301', '10302'],
    104: ['10401', '10402'],
    106: ['10601', '10602', '10603', '10604', '10605', '10606', '10607', '10608',
    '10609', '10610', '10611', '10612', '10613', '10614', '10615', '10616', '10618',
    '10619', '10620', '10621', '10622', '10623', '10624', '10625', '10626',
    '10627', '10628', '10629', '10630', '10631','10632', '10633' ]
}
//testFunctionsWithPastGames()

/* const data = await simulate(knex)
db_helpers.insertIntoTable(knex,'analysis','record_projections',data)
.then(()

} */

simulate(knex)
.then((a)=>{
    console.log(a + 'done!')
})
