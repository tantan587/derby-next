
const db_helpers = require('./helpers').data
//const fantasyHelpers = require('../server/routes/helpers/fantasyHelpers')
const knex = require('../server/db/connection')
const sport_keys = require('./sportKeys')
const asyncForEach = require('./asyncForEach')

const create_active_playoff_standings_data = async (all) => {
  let data = []
  let season_calls = await db_helpers.getSeasonCall(knex, all)
  let post_season_calls = season_calls.filter(season => [101, 102, 103, 104].includes(season.sport_id)&& season.season_type === 3)
  await asyncForEach(post_season_calls, async (season) => {
    let sport_id = season.sport_id
    let sport = sport_keys[sport_id]
    data.push(...await getStandingsInfo(knex, sport.sport_name, sport.api, sport.standingsPromiseToGet, season.api_pull_parameter, season.year, season.sport_season_id))
  })
  
  return data
}
async function createStandingsPO (exitProcess, all=false) {

  let data = await create_active_playoff_standings_data(all)
  // let MLB_standPO = await getStandingsInfo(knex, 'MLB','MLBv3ScoresClient','getStandingsPromise', '2017POST')
  // let NBA_standPO = await getStandingsInfo(knex, 'NBA','NBAv3ScoresClient','getStandingsPromise', '2018POST')
  // let NHL_standPO = await getStandingsInfo(knex, 'NHL','NHLv3ScoresClient','getStandingsPromise', '2018POST')
  // let NFL_standPO = await getStandingsInfo(knex, 'NFL','NFLv3StatsClient','getStandingsPromise', '2017POST')
    
    
  //let data = MLB_standPO.concat(NBA_standPO).concat(NHL_standPO).concat(NFL_standPO)//.concat(CBB_standPO).concat(CFB_standPO)//.concat(EPL_standPO)
  let result = await db_helpers.updatePlayoffStandings(knex, data)
  console.log('Number of Standings Updated: ' + result)
  if(exitProcess)
    process.exit()
}

const getStandingsInfo = async (knex, sportName, api, promiseToGet, pull_parameter, year, sport_season_id) => {
  let standings_info = await db_helpers.createStandingsData(knex, sportName, api, promiseToGet, pull_parameter)
  let newStandings = standings_info.map(team=>{
    let status = 3
    if(sportName==='NBA'||sportName==='NHL'){
      status = team.Wins===16 ? 6 : team.Wins>11 ? 5 : team.Losses%4 === 0 && team.Wins<team.Losses ? 4 : 3
    }

    return {team_id: team.team_id, playoff_wins: team.Wins, playoff_losses: team.Losses, byes: 0, playoff_status: status, year: year, sport_season_id: sport_season_id}
  })
  return newStandings
}



module.exports = {
  createStandingsPO
}