
const knex = require('../../server/db/connection')
const Game = require('./GameClass.js')
const simulateHelpers = require('./simulateHelpers.js')
const playoffFunctions = require('./playoffFunctions.js')
const dbSimulateHelpers = require('./databaseSimulateHelpers.js')
const getDayCount = require('./dayCount.js')
const db_helpers = require('../helpers.js').data
const points = require('./getPointsStructure.js') //this pulls all the differnet point strtuctures
const randomSchedules = require('./randomSchedules.js')
const math = require('mathjs')
const updateProjections = require('./updateProjections')
const fantasyHelpers = require('../../server/routes/helpers/fantasyHelpers')
const findMissingElos = require('./findMissingElos')
const midPlayoffSim = require('./playoffSim')

//this is the overall simulate function - runs for each sport
//eventually needs to add in how it detects if in the middle of a season
async function simulate(exitProcess, simulations = 10000, all=false)
{
  await findMissingElos(knex)
  console.log('Simulation with ' + simulations + ' simulations')
  const sport_structures = await dbSimulateHelpers.getSportStructures(knex)
  const year_seasons = await dbSimulateHelpers.yearSeasonIds(knex)
  let all_teams = await dbSimulateHelpers.createTeams(knex)
  let all_points = await points.getScoringTypes(knex)
  //this is the old way, commented out
  //let all_points = await points.getPointsStructure(knex)
  var today = new Date()
  //this is the calculation of day count normally:
  let day_count = getDayCount(today) //note that this is changed
  //this is the first day of the season of 2017
  //day_count = 1469
  /* this to be added back in later
  rpiHelpers.addRpiToTeamClass(knex,all_teams) */
  const games = await dbSimulateHelpers.createGamesArray(knex, all_teams,day_count)
  const seasonData = await dbSimulateHelpers.findAllCurrentSeasonTypes(knex)
  const seasonTypeIds = seasonData[0] //1 is regular, 3 playoffs, 4 postseason
  const playoffSeasonsInfo = seasonData[1]
  const pastPlayoffGames = await dbSimulateHelpers.createPastGamesArrayWithScores(knex, all_teams, day_count, [3], playoffSeasonsInfo[0], playoffSeasonsInfo[1])
  //these are the functions for each individual season. 
  const epl_teams = simulateEPL(games, all_teams, all_points, seasonTypeIds, simulations)
  const cfb_teams = simulateCFB(games, all_teams, all_points, seasonTypeIds, simulations)
  const mlb_teams = simulateProfessionalLeague(games, all_teams, '103', all_points, seasonTypeIds, simulations, pastPlayoffGames)
  const nba_teams = simulateProfessionalLeague(games, all_teams, '101', all_points, seasonTypeIds, simulations, pastPlayoffGames)
  const nfl_teams = simulateProfessionalLeague(games, all_teams, '102', all_points, seasonTypeIds, simulations, pastPlayoffGames)
  const nhl_teams = simulateProfessionalLeague(games, all_teams, '104', all_points, seasonTypeIds, simulations, pastPlayoffGames)
  const cbb_teams = simulateCBB(games, all_teams, all_points, simulations)
  
  //team variables contain team projections as first object, game projections as second.
  //the following three functions find the team projections, game projections, and then find fantasy.projections
  const projection_team_list = [...nba_teams[0], ...nfl_teams[0], ...mlb_teams[0], ...nhl_teams[0], ...cbb_teams[0], ...cfb_teams[0], ...epl_teams[0]]
  //inserting cbb game projections separately since too large
  const game_projections = [...nba_teams[1], ...mlb_teams[1], ...nfl_teams[1], ...nhl_teams[1], ...cfb_teams[1], ...epl_teams[1], ...cbb_teams[1]]
  console.log('Total Game Projections: ', game_projections.length)
  const projections = simulateHelpers.updateProjections(projection_team_list, day_count)
  const fantasy_projections = simulateHelpers.fantasyProjections(all_teams, day_count, all_points, sport_structures, year_seasons)
  console.log('before inserting data')

  //insert record, game, and fantasy projections into table
  // await Promise.all([
  //   updateProjections.updateRecordProjections(knex, projections, all),
  //   //db_helpers.insertIntoTable(knex, 'fantasy', 'projections', fantasy_projections),
  //   updateProjections.updateGameProjections(knex, game_projections),
  //   updateProjections.updateFantasyProjections(knex, fantasy_projections)
  // ])
  await updateProjections.updateRecordProjections(knex, projections, all)
  await updateProjections.updateGameProjections(knex, game_projections)
  await updateProjections.updateFantasyProjections(knex, fantasy_projections)
  await fantasyHelpers.updateLeagueProjectedPoints()
  console.log('done')
  if(exitProcess)
    process.exit()

}

//function which simulates NBA, NFL, NHL, MLB - default set to 10 for now to modify later
const simulateProfessionalLeague = (all_games_list, teams, sport_id, points, seasonTypeIds, simulations = 10, pastPlayoffGames) => {
  const years = Object.keys(teams[sport_id])
  let game_projections = []
  let all_seasons_sport_teams = []
  years.forEach(year => { 
    let sport_teams = simulateHelpers.individualSportTeamsWithYear(teams, sport_id, year)
    let currentSeasonId = seasonTypeIds[sport_id][year]
    // if(seasonsFinished[sport_id][year]){
    // current season ID represents wehre the season is at. 4 means after playoffs, 1 reg, 2 pr, 3 post
    if(currentSeasonId === 4){
      sport_teams.forEach(team =>
      {
        team.reset()
        team.averages(1)
      })
      all_seasons_sport_teams.push(...sport_teams)}
    else if (currentSeasonId < 3){
      let sport_games = year in all_games_list[sport_id] ? all_games_list[sport_id][year] : createRandomGameSchedule(sport_id, year, teams)

      for(var x=0; x<simulations; x++){
        sport_games.forEach(game => {
          //console.log(game)
          sport_id != '104' ? game.play_game(): game.play_NHL_game()
        })
        professionalPlayoffSimulation(sport_teams, sport_id, sport_games);

        //below is way to test how many games the team is playing, to test. Keeping it so can easily build and test for future.
        /*  sport_teams.forEach(team=>{
                  let total = team.wins + team.losses
                  console.log(team.name, ':', total)
              })
              process.exit() */
        //resets the team values, back to the original
        sport_teams.forEach(team => {
          team.reset()})
      }
      //finds the averages after all the simulations, for each team
      sport_teams.forEach(team => {
        team.averages(simulations)
      })
      buildAllSeasonSportsTeams(year, all_games_list, sport_id, game_projections, sport_games, points, all_seasons_sport_teams, sport_teams);
      //return {...sport_teams}
    }
    else if(currentSeasonId == 3){
      let playoff_teams = sport_teams.filter(team => {
        return team.playoff_status > 2
      })
      let playoffsNotStarted = playoff_teams.every(team => {return team.playoff_wins === 0})
      playoffsNotStarted  = true //this is not accurate - just as such so that it will work for now.
      if(playoffsNotStarted){
        for(var x=0; x<simulations; x++){
          professionalPlayoffSimulation(sport_teams, sport_id, sport_games)
          sport_teams.forEach(team => {team.reset()})
        }
        sport_teams.forEach(team => {
          team.averages(simulations)
        })
        buildAllSeasonSportsTeams(year, all_games_list, sport_id, game_projections, sport_games, points, all_seasons_sport_teams, sport_teams);
      }
      else{
        let sport_past_playoff_games = pastPlayoffGames[sport_id]
        for(var x=0; x<simulations; x++){
          let finalists = midPlayoffSim[sport_id](playoff_teams, sport_playoff_games, all_games_list[sport_id][year], simulateHelpers, playoffFunctions)
          professionPlayoffChampionshipSimulation(finalists[0], finalists[1], sport_id)
          sport_teams.forEach(team => {team.reset()})
        }
        sport_teams.forEach(team => {
          team.averages(simulations)
        })
        buildAllSeasonSportsTeams(year, all_games_list, sport_id, game_projections, sport_games, points, all_seasons_sport_teams, sport_teams);
        //need to fill in formula for what to do when playoffs are ongoing
        /*
        for each sport: need to pull schedule to find out where the standings are right now
        after pulling the schedule, need to simulate from that point

        */
      }
    }
  })

  //creates game projections for impact, and also calculating each temas iwnning percentage
  //let game_projections = simulateHelpers.createImpactArray(all_games_list, sport_id, points, years)
  return [all_seasons_sport_teams, game_projections]
}

//function to simulate CFB - also figures out most likely playoff teams using formula
const simulateCFB = (all_games_list, teams, points, seasonTypeIds, simulations = 10) => {
  const years = Object.keys(teams['105'])
  let game_projections = []
  let all_seasons_cfb_teams = []
  years.forEach(year => { 
    let cfb_teams = simulateHelpers.individualSportTeamsWithYear(teams, '105', year)
    let currentSeasonId = seasonTypeIds['105'][year]
    if(currenSeasonId === 4){
      cfb_teams.forEach(team =>{
        team.reset()
        team.averages(1)
      })
      all_seasons_cfb_teams.push(...cfb_teams)
    }
    else if (currentSeasonId<3){
    //need to build in functionality to randomize college football schedule, and insert that below
      let cfb_games = year in all_games_list['105'] ? all_games_list['105'][year] : all_games_list['105'][year-1]
      for(var x=0; x<simulations; x++){
        cfb_games.forEach(game => {
          game.play_game()})
        cfb_teams.sort(function(a,b){return b.wins-a.wins})
        //play the conference championship games, add winners to array conference champions
        const conference_ids = ['10501', '10502', '10503', '10504', '10505']
        let conference_champions = conference_ids.map(id => {return playoffFunctions['105'](cfb_teams.filter(team => team.conference === id), simulateHelpers)})
        //calculate there CFB playoff value, sort them from highest to lowest, and put the four highest teams into playoffs
        cfb_teams.forEach(team => {
          let champ_boost = conference_champions.includes(team) ? 1:0
          team.calculateCFBValue(champ_boost)})
        cfb_teams.sort(function(a,b){return b.cfb_value - a.cfb_value})
        let playoffs = cfb_teams.slice(0,4)

        playoffs.forEach(team=>{team.playoffs++})
        //find finalists, add finalist value, play championship, add champ value
        let finalist_1 = simulateHelpers.Series(playoffs[0],playoffs[3],1,'105',1, true)
        let finalist_2 = simulateHelpers.Series(playoffs[1],playoffs[2],1,'105',1, true)
        finalist_1.finalist++
        finalist_2.finalist++
        let champion = simulateHelpers.Series(finalist_1, finalist_2,1,'105', 2, true)
        champion.champions++

        //calculate bowl games, to simulate
        //first, slice all teams that did not make the playoffs
        let non_playoff_teams = cfb_teams.slice(4)
        //next find bowl eligible teams, be sure it is an even number
        let bowl_eligible_teams = non_playoff_teams.filter(team => team.wins>5)
        if(bowl_eligible_teams.length%2 === 1){bowl_eligible_teams.pop()}
        
        //matches up each bowl team against one within rank 7 of them. Is this the right amount of difference? tbd
        //we want to use array.splice - splice returns an array
        
        let tot = 0
        while(bowl_eligible_teams.length !== 0){
          let team_1 = bowl_eligible_teams.shift()
          let max = tot > 12 ? 8:5
          let index_other_team = math.randomInt(0,max)
          let ind = bowl_eligible_teams.length > index_other_team ? index_other_team : 0
          let team_2 = bowl_eligible_teams.splice(ind, 1)
          simulateHelpers.simulateBowlGame(team_1, team_2[0])
          tot++
        }

        cfb_games.forEach(game=>{
          game.adjustImpact()
        })
        cfb_teams.forEach(team =>{team.reset()})
      }
      //calculates average season
      cfb_teams.forEach(team => {
        team.averages(simulations)
      })
      //creates game projections for impact, and also calculating each temas iwnning percentage
      if(year in all_games_list['105']){
        game_projections.push(...simulateHelpers.createImpactArray(cfb_games, '105', points))
      }
      all_seasons_cfb_teams.push(...cfb_teams)
    }
    else if (currentSeasonId == 3){

    } 
  })
  //creates game projections for impact, and also calculating each temas iwnning percentage
  //let game_projections = simulateHelpers.createImpactArray(all_games_list, '105', points, years)
  return [all_seasons_cfb_teams, game_projections]
}

//function to simulate CBB - also figures out most likely march madness teams using formula
const simulateCBB = (all_games_list, teams, points, simulations = 10) => {
  const years = Object.keys(teams['106'])
  let game_projections = []
  let all_seasons_cbb_teams = []
  years.forEach(year => {
    let cbb_teams = simulateHelpers.individualSportTeamsWithYear(teams, '106', year)
    if(seasonsFinished[106][year]){
      cbb_teams.forEach(team => {
        team.reset()
        team.averages(1)
      })
      all_seasons_cbb_teams.push(...cbb_teams)
    }else{
      let cbb_games = year in all_games_list['106'] ? all_games_list['106'][year] : all_games_list['106'][year-1]
      for(var x=0; x<simulations; x++){
        //console.log('test')
        cbb_games.forEach(game => {game.play_CBB_game()})
        //below needs to calculate conference wins, not overall wins
        cbb_teams.sort(function(a,b){return b.wins-a.wins})
        //play the conference championship games, add winners to array conference champions
        //following array is all the conference
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
        //create a CBB value approximation for tournament teams. This will be used to find march madness
        cbb_teams.forEach(team=>{team.calculateCBBValue()})
        cbb_teams.sort(function(a,b){return b.cbb_value - a.cbb_value})
        //conf champs automatically qualify. This filters those out.
        let non_conf_champs = cbb_teams.filter(team => conference_champions.includes(team) === false)
        //this grabs the rest of the tournament teams: at large teams, the last 4 at large, and then the last four conference champions who don't receive byes
        let at_large = non_conf_champs.slice(0,32)
        let last_four = non_conf_champs.slice(32,36)
        let last_four_conference_champions = conference_champions.splice(28,4)

        //each team that made tournament and received by scores one playoff win for first round, equivalent to bye
        conference_champions.forEach(team => {team.playoff_wins[0]++})
        at_large.forEach(team=>{
          team.playoff_wins[0]++
          team.playoff_appearances++
        })
        //last four separate - only have playoff appearance so far
        last_four.forEach(team=>{team.playoff_appearances++})
        //first round of march madness: simulate games of last 4 and bottom 4
        let last_four_winner_1 = simulateHelpers.Series(last_four[0],last_four[3],1,'106', 1, true)
        let last_four_winner_2 = simulateHelpers.Series(last_four[1],last_four[2],1,'106', 1, true)
        let last_conference_champ_winner_1 = simulateHelpers.Series(last_four_conference_champions[0],last_four_conference_champions[3],1,'106',1, true)
        let last_conference_champ_winner_2 = simulateHelpers.Series(last_four_conference_champions[1],last_four_conference_champions[2],1,'106',1, true)
        //creates bracket of 64 teams, and sorts them
        let march_madness = [...conference_champions, ...at_large, last_four_winner_1, last_four_winner_2,last_conference_champ_winner_1, last_conference_champ_winner_2]
        march_madness.sort(function(a,b){return b.cbb_value - a.cbb_value})
        //runs the tournament
        //this function goes round by round, and in each round, takes team at top of list and they play team at bottom.
        //this therefore simulates a bracket
        let next_round = []
        for(let round = 2; round <8; round++){
          if(round === 6){
            march_madness.forEach(team => {team.finalist++})
          }
          while(march_madness.length != 0){
            let team_1 = march_madness.shift()
            let team_2 = march_madness.pop()
            let winner = simulateHelpers.Series(team_1, team_2, 1, '106', round, true)
            next_round.push(winner)
          }
          march_madness.push(...next_round)
          next_round.length = 0
        }
        march_madness[0].champions++ //team remaining is champ
        cbb_games.forEach(game=>{
          game.adjustImpact()
        })
        cbb_teams.forEach(team =>{
          team.reset()
          team.cbb_reset() //cbb reset also reset rpi
        })
      }
      cbb_teams.forEach(team => {
        team.averages(simulations)
      })
      if(year in all_games_list[106]){
        game_projections.push(...simulateHelpers.createImpactArray(cbb_games, '106', points))
      }
      all_seasons_cbb_teams.push(...cbb_teams)
    }
  })

  //let game_projections = simulateHelpers.createImpactArray(all_games_list, '106', points, years)

  return [all_seasons_cbb_teams, game_projections]
}

//function which simulates NBA, NFL, NHL, MLB - default set to 10 for now to modify later
const simulateEPL = (all_games_list, teams, points, simulations = 10) => {
  const years = Object.keys(teams['107'])
  let game_projections = []
  let all_seasons_epl_teams = []
  years.forEach(year => { 
    const epl_teams = simulateHelpers.individualSportTeamsWithYear(teams, '107', year)
    if(seasonsFinished[107][year]){
      epl_teams.forEach(team =>{
        team.reset()
        team.averages(1)
      })
      all_seasons_epl_teams.push(...epl_teams)
    }
    else{
      let epl_games =  all_games_list['107'][year]
      //console.log(leagues)
      for(let x=0; x<simulations; x++){
        epl_games.forEach(game => {
          game.play_EPL_game()})
        
        //sort by EPL points
        epl_teams.sort(function(a,b){return 3*b.wins+b.ties-3*a.wins-a.ties})
        
        //EPL does not have playoffs, just a top 4 that qualify for champions league
        let playoffs = epl_teams.slice(0,4)
        playoffs.forEach(team => {team.playoffs++})
        playoffs[0].champions++
        playoffs[0].finalist++
        playoffs[1].finalist++
        epl_games.forEach(game=>{game.adjustImpact()})
        epl_teams.forEach(team => {
          team.reset()})
      }
      //console.log(`${teams[team].name}: ${teams[team].wins}/${teams[team].losses}, defaultElo: ${teams[team].defaultElo}, finalElo: ${teams[team].elo}`)})
      epl_teams.forEach(team => {
        team.averages(simulations)
      })
      game_projections.push(...simulateHelpers.createImpactArray(epl_games, '107', points))
      all_seasons_epl_teams.push(...epl_teams)
    }
  })
  //creates game projections for impact, and also calculating each temas iwnning percentage
  //let game_projections = simulateHelpers.createImpactArray(all_games_list, '107', points, years)
  return [all_seasons_epl_teams, game_projections]

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

const createRandomGameSchedule = (sport_id, year, all_teams) => {
  console.log(sport_id)
  let sportRandom = randomSchedules.randomScheduleBySportID[sport_id].random(all_teams[sport_id][year])
  let fake_global = 1
  let game_list = sportRandom.map(game => {
    fake_global++
    return new Game(fake_global, all_teams[sport_id][year][game.home_team_id], all_teams[sport_id][year][game.away_team_id], sport_id, 1, year)
  })
  return game_list
}
//testFunctionsWithPastGames()

const seasonsFinished = {
  101: {2018: true, 2019: false}, 
  102: {2017: true, 2018: false}, 
  103: {2018: true, 2019: false},
  104: {2018: true, 2019: false}, 
  105: {2017: true, 2018: true},
  106: {2018: true, 2019: false},
  107: {2018: true, 2019: false}
}

module.exports = {simulate}

function buildAllSeasonSportsTeams(year, all_games_list, sport_id, game_projections, sport_games, points, all_seasons_sport_teams, sport_teams) {
  if (year in all_games_list[sport_id]) {
    game_projections.push(...simulateHelpers.createImpactArray(sport_games, sport_id, points));
  }
  all_seasons_sport_teams.push(...sport_teams);

}

function professionalPlayoffSimulation(sport_teams, sport_id, sport_games) {
  sport_teams.sort(function (a, b) { return b.wins - a.wins; });
  //find both finalists
  let finalist_1 = playoffFunctions[sport_id](sport_teams.filter(team => team.conference === league_conference[sport_id][0]), simulateHelpers);
  let finalist_2 = playoffFunctions[sport_id](sport_teams.filter(team => team.conference === league_conference[sport_id][1]), simulateHelpers);
  professionalPlayoffChampionshipSimulation(finalist_1, finalist_2, sport_id);
  //adjusts game by game impact, and update result with results of this sim
  sport_games.forEach(game => {
    game.adjustImpact();
  });
}

function professionPlayoffChampionshipSimulation(finalist_1, finalist_2, sport_id) {
  let finalists = simulateHelpers.moreWins(finalist_1, finalist_2);
  finalists.forEach(team => { team.finalist++; });
  //finds champion. different for each sport because super bowl is neutral
  let champion = sport_id === '102' ? simulateHelpers.Series(finalists[0], finalists[1], 1, sport_id, 4, true) : simulateHelpers.Series(finalists[0], finalists[1], 7, sport_id, 4);
  champion.champions++;
}

