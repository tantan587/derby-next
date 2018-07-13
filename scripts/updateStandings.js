const db_helpers = require('./helpers').data
const fantasyHelpers = require('../server/routes/helpers/fantasyHelpers')
const knex = require('../server/db/connection')
const getDayCount = require('./Analysis/dayCount.js')

//note: college basketball has an extra, old functino below: waiting to be sure we don't need this again

//for CFB - this function also updates the post season standings.
async function updateStandings()
{
  //let cbbData = await getCBBstandings(knex, 'CBB', 'CBBv3StatsClient', 'getTeamSeasonStatsPromise', '2018')
  let cbbData = await standingsBySport(knex, 'CBB', 'CBBv3StatsClient', 'getTeamSeasonStatsPromise', '2018')
  let cfbData = await getCFBstandings(knex, 'CFB', 'CFBv3ScoresClient', 'getTeamSeasonStatsStandingsPromise', '2017')
  let nhlData = await standingsBySport(knex, 'NHL', 'NHLv3StatsClient', 'getStandingsPromise', '2018')
  let nbaData = await standingsBySport(knex, 'NBA', 'NBAv3StatsClient', 'getStandingsPromise', '2018')
  let mlbData = await standingsBySport(knex, 'MLB', 'MLBv3StatsClient', 'getStandingsPromise', '2018')
  let nflData = await standingsBySport(knex, 'NFL', 'NFLv3StatsClient', 'getStandingsPromise', '2017')
  let eplData = await standingsBySport(knex, 'EPL', 'Soccerv3StatsClient', 'getStandingsPromise', '144')
  let data = nhlData.concat(nbaData).concat(mlbData).concat(nflData).concat(cfbData).concat(eplData).concat(cbbData)

  db_helpers.updateStandings(knex, data)
    .then(result => {
      console.log('Number of Standings Updated: ' + result)
      //we will need to figure out if below needs to be added in, where this function updates fantasy points. Unclear, can't remember off top of head
      fantasyHelpers.updatePoints()
        .then(() =>{
          process.exit()
        })
      
    })
}

const standingsBySport = async (knex, sportName, api, promiseToGet, year) => {
  let standings_info = await db_helpers.createStandingsData(knex, sportName, api, promiseToGet, year)
  let newStandings = standings_info.map(team=>{
    let ties = sportName === 'NHL' ? team.OvertimeLosses : 
              sportName === 'NFL' ? team.Ties : 
              sportName === 'EPL' ? team.Draws : 0

    return {team_id: team.team_id, wins: team.Wins, losses: team.Losses, ties: ties, year: team.Season}
  })

  return newStandings
}

const getCFBstandings = async (knex, sportName, api, promiseToGet, year) =>{
  const standings = await standingsBySport(knex, sportName, api, promiseToGet, year)
  //check if current week is after the start of the post season, or is null. 
  //This could also be done with dates and season status table, as had been discussed
  //table hasn't yet been created
  let current_week = await db_helpers.getFdata(knex, sportName, api, 'getCurrentWeekPromise')
  if(current_week !== "" && current_week < 16){
    return standings
  }else{
    //pull, and then make readable, playoff games (including bowl games)
    let post_year = year.concat("POST")
    let non_parse_games = await db_helpers.getFdata(knex, sportName, api, 'getGamesByWeekPromise', post_year, 1)
    let playoff_games = JSON.parse(non_parse_games)

    let teamIdMap = await db_helpers.getTeamIdMap(knex, '105')

    let standings_by_team_id = {}
    standings.forEach(team => standings_by_team_id[team.team_id]={...team})
    //below are the stadiums where playoffs are played
    //in order: rose bowl, cotton bowl, sugar bowl, orange bowl, peach bowl, fiesta bowl
    //note these stadiums have multiple games played there, often, so will need to figure that out
    //3 year hosting cycle: rose/sugar, orange/cotton, fiesta/peach. 2017 was rose/sugar

    let playoff_stadium_ids =[114, 70, 148, 55, 163, 79]
    let finalist_stadium_ids_by_year = {
      2017: [114, 148],
      2018: [70, 55],
      2019: [163, 79]
    }
    let playoff_teams = []
    let bowl_wins = []
    let finalist_team_ids = []
    let new_playoff_teams = []
    playoff_games.forEach(game=>{
      if(game.Status[0] === 'F'){
        let results = game.HomeTeamScore > game.AwayTeamScore ? [teamIdMap[game.GlobalHomeTeamID], teamIdMap[game.GlobalAwayTeamID]] : [teamIdMap[game.GlobalAwayTeamID], teamIdMap[game.GlobalHomeTeamID]]
        if(results[0] != undefined && results[1] !== undefined){
          standings_by_team_id[results[0]].wins--
          standings_by_team_id[results[1]].losses--
          bowl_wins.push({team_id: results[0], bowl_wins: 1})
        }
      }
      if(playoff_stadium_ids.includes(game.StadiumID)){
        let split = game.Day.split('T')[0].split('-')
        if(split[2] >29 || split[2]<10){
          //next year playoff stadiums are orange, cotton: ids are 70, 
          if(finalist_stadium_ids_by_year[year].includes(game.StadiumID)){//||(split[1]==1 && split[2]>3)){
            let playoff_result = [0, 0]
            if(game.Status[0] === 'F'){
              playoff_result = game.HomeTeamScore > game.AwayTeamScore ? [1,0] : [0,1]
            }
            playoff_teams.push(
              {team_id: teamIdMap[game.GlobalHomeTeamID], playoff_wins: playoff_result[0], playoff_losses: playoff_result[1], playoff_status: 'finalist', bowl_wins: 0},
              {team_id: teamIdMap[game.GlobalAwayTeamID], playoff_wins: playoff_result[1], playoff_losses: playoff_result[0], playoff_status: 'finalist', bowl_wins: 0}
            )
            finalist_team_ids.push(teamIdMap[game.GlobalHomeTeamID], teamIdMap[game.GlobalAwayTeamID])
          }else if(split[1]==1 && split[2]>3){
            if(game.Status[0] === 'F'){
              let finalists = game.HomeTeamScore > game.AwayTeamScore ? [teamIdMap[game.GlobalHomeTeamID], teamIdMap[game.GlobalAwayTeamID]] : [teamIdMap[game.GlobalAwayTeamID], teamIdMap[game.GlobalHomeTeamID]]
              new_playoff_teams = playoff_teams.filter(team => finalists.includes(team.team_id) === false)
              new_playoff_teams.push(
                {team_id: finalists[0], playoff_wins: 2, playoff_losses: 0, playoff_status: 'champions', year: game.Season},
                {team_id: finalists[1], playoff_wins: 1, playoff_losses: 1, playoff_status: 'finalist', year: game.Season})
            }
          }else
          {
            playoff_teams.push({team_id: teamIdMap[game.GlobalHomeTeamID], playoff_status: 'in_playoffs', playoff_wins: 0, playoff_losses: 0, year: game.Season}, {team_id: teamIdMap[game.GlobalAwayTeamID], playoff_status: 'in_playoffs', playoff_wins: 0, playoff_losses: 0, year: game.Season})
          }
        }
        //note: still need to figure out a way to differentiate between playoff wins and normal bowl wins. NY6 teams all get playoff appearance points
      }
    
    })
    let new_bowl_wins = bowl_wins.filter(team => finalist_team_ids.includes(team.team_id)===false)
    let new_standings = Object.keys(standings_by_team_id).map(key => standings_by_team_id[key])
    
    let playoff_updated = await db_helpers.updateBowlWins(knex, new_bowl_wins, new_playoff_teams)

    return new_standings
  }
}

const getCBBstandings = async (knex, sportName, api, promiseToGet, year) =>{
  const standings = await standingsBySport(knex, sportName, api, promiseToGet, year)
  var today = new Date()
  let today_day_count = getDayCount(today)
  console.log(today_day_count)

  //note: below is an approximation of date count of start of post season
  //this should be pulled from table, with start dates
  //we can create this table using get current season, which is a pull from fantasy data
  //will want to create that
  if(today_day_count<1667){
    return standings
  }else{
    //pull ALL postseason games (includes NIT)
    const post_year = year.concat("POST")
    const unparsed_post_season_games = await db_helpers.getFdata(knex, sportName, api, "getSchedulesPromise", post_year)
    const post_season_games = JSON.parse(unparsed_post_season_games)
    let teamIdMap = await db_helpers.getTeamIdMap(knex, '106')
    //break standings up by teamID, into object
    let standings_by_team_id = {}
    standings.forEach(team => standings_by_team_id[team.team_id]={...team})
    //for each postseason game: take results away from standings
    post_season_games.forEach(game =>{

      let results = game.HomeTeamScore > game.AwayTeamScore ? [teamIdMap[game.GlobalHomeTeamID],teamIdMap[game.GlobalAwayTeamID]] : [teamIdMap[game.GlobalAwayTeamID],teamIdMap[game.GlobalHomeTeamID]]
      standings_by_team_id[results[0]].wins--
      standings_by_team_id[results[1]].losses--
    })
    //put standings back together into object
    let new_standings = Object.keys(standings_by_team_id).map(key => standings_by_team_id[key])
    return new_standings
  }
}

//this I'm saving for later, to keep track of for EPL when we need it.
//this is the round for each year, when we end up only using the year that is needed.
const round_year = {
  2018: 144,
  2019: 274
}


updateStandings()