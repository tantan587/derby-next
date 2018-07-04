const db_helpers = require('./helpers').data
const fantasyHelpers = require('../server/routes/helpers/fantasyHelpers')
const knex = require('../server/db/connection')

// db_helpers.getFantasyData(knex, 'NHL', 'https://api.fantasydata.net/v3/nhl/scores/JSON/Standings/2018?', 'Key', 'Conference')
//   .then(result =>{ 
//     result.map(team => 
//     {
//       newStandings.push({team_id: team.team_id, wins : team.Wins, losses: team.Losses, ties: team.OvertimeLosses})    
//     })
//     db_helpers.updateStandings(knex, newStandings)
//       .then(result => {
//         console.log('Number of Standings Updated: ' + result)
//         process.exit()
//       })
//   })

//note: college basketball does not differentiate anywhere that i can tell between post and regular season
//additionally, it includes nit wins in with the regular season as well
async function updateStandings()
{
  let cfbData = await getCFBstandings(knex, 'CFB', 'CFBv3ScoresClient', 'getTeamSeasonStatsStandingsPromise', '2017')
  let nhlData = await standingsBySport(knex, 'NHL', 'NHLv3StatsClient', 'getStandingsPromise', '2018')
  let nbaData = await standingsBySport(knex, 'NBA', 'NBAv3StatsClient', 'getStandingsPromise', '2018')
  //let cbbData = await standingsBySport(knex, 'CBB', 'CBBv3StatsClient', 'get')
  //let cfbData = await getCfbData()
  let mlbData = await standingsBySport(knex, 'MLB', 'MLBv3StatsClient', 'getStandingsPromise', '2018')
  let nflData = await standingsBySport(knex, 'NFL', 'NFLv3StatsClient', 'getStandingsPromise', '2017')
  //let eplData = await getEplData()
  let data = nhlData.concat(nbaData).concat(mlbData).concat(nflData)//.concat(cbbData).concat(cfbData).concat(eplData)

  db_helpers.updateStandings(knex, data)
    .then(result => {
      console.log('Number of Standings Updated: ' + result)
      process.exit()
      //we will need to figure out if below needs to be added in, where this function updates fantasy points. Unclear, can't remember off top of head
      //fantasyHelpers.updatePoints()
        //.then(() =>{process.exit()})
      
    })
}

const standingsBySport = async (knex, sportName, api, promiseToGet, year) => {
  let standings_info = await db_helpers.createStandingsData(knex, sportName, api, promiseToGet, year)
  let newStandings = standings_info.map(team=>{
    let ties = sportName === 'NHL' ? team.OvertimeLosses : 
              sportName === 'NFL' ? team.Ties : 
              sportName === 'EPL' ? team.Draws : 0

    return {team_id: team.team_id, wins: team.Wins, losses: team.Losses, ties: ties}
  })

  return newStandings
}

const getCFBstandings = async (knex, sportName, api, promiseToGet, year) =>{
  const standings = await standingsBySport(knex, sportName, api, promiseToGet, year)

  let current_week = await db_helpers.getFdata(knex, sportName, api, 'getCurrentWeekPromise')
  if(current_week !== "" && current_week < 16){
    return standings
  }else{
    let non_parse_games = await db_helpers.getFdata(knex, sportName, api, 'getGamesByWeekPromise', '2017POST', 1)
    let playoff_games = JSON.parse(non_parse_games)

    let teamIds = await db_helpers.getTeamAndGlobalId(knex, '105')
    let teamIdMap = {}
    teamIds.forEach(team => teamIdMap[team.global_team_id] = team.team_id)

    let standings_by_team_id = {}
    console.log(standings)
    standings.forEach(team => standings_by_team_id[team.team_id]={...team})
    //below are the stadiums where playoffs are played
    //in order: rose bowl, cotton bowl, sugar bowl, orange bowl, peach bowl, fiesta bowl
    //note these stadiums have multiple games played there, often, so will need to figure that out
    //3 year hosting cycle: rose/sugar, orange/cotton, fiesta/peach. 2017 was rose/sugar
    playoff_stadium_ids =[114, 138, 163, 55, 163, 79]
    playoff_games.forEach(game=>{
      if(game.Status[0] === 'F'){
        let results = game.HomeTeamScore > game.AwayTeamScore ? [teamIdMap[game.GlobalHomeTeamID], teamIdMap[game.GlobalAwayTeamID]] : [teamIdMap[team.GlobalAwayTeamID], teamIdMap[team.GlobalHomeTeamID]]
        standings_by_team_id[result[0]].wins--
        standings_by_team_id[result[1]].losses--
      }
      if(playoff_stadium_ids.includes(game.StadiumID)){
        let date = game.Day.split("-")
        
      }
      
    })
    console.log(standings[2])
  

    process.exit()
  }

}
async function getNhlData()
{
  return db_helpers.getFantasyData(knex, 'NHL', 'https://api.fantasydata.net/v3/nhl/scores/JSON/Standings/2018?', 'Key', 'Conference')
    .then(result => { 
      let newStandings = []
      result.map(team => 
      {
        newStandings.push({team_id: team.team_id, wins : team.Wins, losses: team.Losses, ties: team.OvertimeLosses})    
      })
      return newStandings
    })
}

async function getNbaData()
{
  return db_helpers.getFantasyData(knex, 'NBA', 'https://api.fantasydata.net/v3/nba/scores/JSON/Standings/2018?', 'Key', 'Conference')
    .then(result => { 
      let newStandings = []
      result.map(team => 
      {
        newStandings.push({team_id: team.team_id, wins : team.Wins, losses: team.Losses, ties: 0})    
      })
      return newStandings
    })
}

async function getMlbData()
{
  return db_helpers.getFantasyData(knex, 'MLB', 'https://api.fantasydata.net/v3/mlb/scores/JSON/Standings/2018?', 'Key', 'League')
    .then(result => { 
      let newStandings = []
      result.map(team => 
      {
        newStandings.push({team_id: team.team_id, wins : team.Wins, losses: team.Losses, ties: 0})    
      })
      return newStandings
    })
}

async function getNflData()
{
  return db_helpers.getFantasyData(knex, 'NFL', 'https://api.fantasydata.net/v3/nfl/scores/JSON/Standings/2017?', 'Team', 'Conference')
    .then(result => { 
      let newStandings = []
      result.map(team => 
      {
        newStandings.push({team_id: team.team_id, wins : team.Wins, losses: team.Losses, ties: team.Ties})    
      })
      return newStandings
    })
}

async function getCbbData()
{
  return db_helpers.getFantasyData(knex, 'CBB', 'https://api.fantasydata.net/v3/cbb/scores/JSON/LeagueHierarchy?', 'Key', 'ConferenceID')
    .then(result => { 
      let newStandings = []
      result.map(team => 
      {

        newStandings.push({team_id: team.team_id, wins : team.Wins, losses: team.Losses, ties: 0})    
      })

      return newStandings
    })
}

async function getCfbData()
{
  return db_helpers.getFantasyData(knex, 'CFB', 'https://api.fantasydata.net/v3/cfb/scores/JSON/LeagueHierarchy?', 'Key', 'ConferenceID')
    .then(result => { 
      let newStandings = []
      result.map(team => 
      {
        newStandings.push({team_id: team.team_id, wins : team.Wins, losses: team.Losses, ties: 0})    
      })
      return newStandings
    })
}

async function getEplData()
{
  return db_helpers.getFantasyData(knex, 'EPL', 'https://api.fantasydata.net/v3/soccer/scores/json/Standings/144?', 'Name')
    .then(result => { 
      let newStandings = []
      result.filter(team => team.Scope === 'Total').map(team => 
      {
        newStandings.push({team_id: team.team_id, wins : team.Wins, losses: team.Losses, ties: team.Draws})    
      })
      return newStandings
    })
}


updateStandings()

  

  