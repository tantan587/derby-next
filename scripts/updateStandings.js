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


async function updateStandings()
{
  let nhlData = await getNhlData()
  let nbaData = await getNbaData()
  let cbbData = await getCbbData()
  let cfbData = await getCfbData()
  let mlbData = await getMlbData()
  let nflData = await getNflData()
  let eplData = await getEplData()
  let data = nhlData.concat(nbaData).concat(cbbData).concat(cfbData).concat(mlbData).concat(nflData).concat(eplData)

  db_helpers.updateStandings(knex, data)
    .then(result => {
      console.log('Number of Standings Updated: ' + result)
      fantasyHelpers.updatePoints()
        .then(() =>{process.exit()})
      
    })
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

  

  