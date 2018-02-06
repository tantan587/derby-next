const db_helpers = require('./helpers').data
const fantasyHelpers = require('../server/routes/helpers/fantasyHelpers')
const knex = require('../server/db/connection')



async function createSchedule()
{
  //let nhlData = await getNhlData()
  let data = await getData()
  console.log(data[0])
  // let cbbData = await getCbbData()
  // let cfbData = await getCfbData()
  // let mlbData = await getMlbData()
  // let nflData = await getNflData()
  // let eplData = await getEplData()
  // let data = nhlData.concat(nbaData).concat(cbbData).concat(cfbData).concat(mlbData).concat(nflData).concat(eplData)

  // db_helpers.updateSchedule(knex, data)
  //   .then(result => {
  //     console.log('Number of Schedules Updated: ' + result)
  //     fantasyHelpers.updatePoints()
  //       .then(() =>{process.exit()})
      
  //   })
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

async function getData()
{
  return db_helpers.getScheduleData(knex, 'NBA', 'https://api.fantasydata.net/v3/nba/scores/JSON/Games/2018')
    .then(result => { 
      let newSchedule = []
      result.map(game => 
      {
        newSchedule.push({global_game_id: game.GlobalGameID, 
          home_team_id : game.home_team_id, 
          away_team_id : game.away_team_id,
          date_time: game.DateTime,
          day_count: fantasyHelpers.getDayCount(new Date(game.DateTime))})    
      })
      console.log(newSchedule.length)
      return newSchedule
    })
}

async function getMlbData()
{
  return db_helpers.getFantasyData(knex, 'MLB', 'https://api.fantasydata.net/v3/mlb/scores/JSON/Standings/2017?', 'Key', 'League')
    .then(result => { 
      let newStandings = []
      result.map(team => 
      {
        newStandings.push({team_id: team.team_id, wins : 0, losses: 0, ties: 0})    
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


createSchedule()

  

  