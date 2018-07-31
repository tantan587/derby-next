const db_helpers = require('./helpers').data
const fantasyHelpers = require('../server/routes/helpers/fantasyHelpers')
const knex = require('../server/db/connection')
const myNull = '---'
const json_functions = require('./scheduleJsons')
const sport_keys = require('./sportKeys')
const asyncForEach = require('./asyncForEach')


const create_data = async () => {
  let data = []
  let season_calls = await db_helpers.getSeasonCall(knex)
  let post_season_calls = season_calls.filter(season => season.season_type === 3)
  await asyncForEach(post_season_calls, async (season) => {
    let sport_id = season.sport_id
    let sport = sport_keys[sport_id]
    let promiseToGet = sport_id===106 ? sport.playoffSchedulePromiseToGet : sport.schedulePromiseToGet
    data.push(...await getSchedInfo(knex, sport.sport_name, sport.api, promiseToGet, season.api_pull_parameter, season.sport_season_id))
  })

  return data
}
async function createSchedule()
{
  let data = await create_data()
  // let CBB_schedPO = await getSchedInfo(knex, 'CBB', 'CBBv3ScoresClient', 'getTournamentHierarchyPromise','2018POST')
  // let MLB_schedPO = await getSchedInfo(knex, 'MLB', 'MLBv3StatsClient', 'getSchedulesPromise', '2017POST')
  // let NBA_schedPO = await getSchedInfo(knex, 'NBA', 'NBAv3ScoresClient', 'getSchedulesPromise','2017POST')
  // let NHL_schedPO = await getSchedInfo(knex, 'NHL', 'NHLv3ScoresClient', 'getSchedulesPromise','2017POST')
  // let NFL_schedPO = await getSchedInfo(knex, 'NFL', 'NFLv3ScoresClient', 'getScoresBySeasonPromise','2017POST')
  // let CFB_schedPO = await getSchedInfo(knex, 'CFB', 'CFBv3ScoresClient', 'getSchedulesPromise','2017POST')
  // let data = MLB_schedPO.concat(NBA_schedPO).concat(NHL_schedPO).concat(NFL_schedPO)//.concat(CFB_schedPO).concat(CBB_schedPO)

  //still needs to be fixed for non null values
  db_helpers.updateSchedule(knex, data)
    .then(result => {
      console.log('Number of Schedules Updated: ' + result)
      process.exit()
    })
}



const getSchedInfo = async (knex, sportName, api, promiseToGet, year, sport_season_id) => {
  let schedData = await db_helpers.getFdata (knex, sportName, api, promiseToGet, year)
  let sport_id = await db_helpers.getSportId(knex,sportName)
  let teamIdMap = await db_helpers.getTeamIdMap(knex, sport_id)
  let cleanSched = JSON.parse(schedData)
  let sport_json = json_functions[sport_id]
  const idSpelling = sportName === 'EPL' ? 'Id' : 'ID'
  let schedInfo = []
  let new_clean_sched =[]
  if(cleanSched.length>0){
    if(sportName === 'CBB'){
      new_clean_sched = cleanSched['Games']
      schedInfo = db_helpers.createScheduleForInsert(new_clean_sched, sport_id, idSpelling, teamIdMap, fantasyHelpers, myNull, sport_json, sport_season_id)
    }else{
      schedInfo = db_helpers.createScheduleForInsert(cleanSched, sport_id, idSpelling, teamIdMap, fantasyHelpers, myNull, sport_json, sport_season_id)
    }
  }


  // let sport_teams = teamIds.map(team=> team.team_id)
  // let playoff_ids = []
  // sport_teams.forEach(team =>{
  //   let playoff = schedInfo.findIndex(game => team === (game.home_team_id || game.away_team_id))
  //   playoff>-1 ? playoff_ids.push(team) : 0
  // })
  if(sportName === 'CBB'){
    //this is used to get playoff standings for college basketball, for the tournament, and not to run the same pull twice
    let playoff_standings = {}
    new_clean_sched.forEach(game => 
    {
      let home_id = teamIdMap[game.GlobalHomeTeamID]
      let away_id = teamIdMap[game.GlobalAwayTeamID]
      if(!(home_id in playoff_standings)){
        playoff_standings[home_id] = {team_id: home_id, playoff_wins: 0, playoff_losses: 0, playoff_status: 3, byes: 1, sport_season_id: sport_season_id}
      }
      if(!(away_id in playoff_standings)){
        playoff_standings[away_id] = {team_id: away_id, playoff_wins: 0, playoff_losses: 0, playoff_status: 3, byes: 1, sport_season_id: sport_season_id}
      }
      if(game.Round == null){
        playoff_standings[home_id].byes--
        playoff_standings[away_id].byes--
      }
      if(game.Status[0] === 'F'){
        let results = game.winner === 'H' ? [home_id, away_id] : [away_id, home_id]
        playoff_standings[results[0]].playoff_wins++
        playoff_standings[results[1]].playoff_losses++
      }
    })
    let standings_for_insert = Object.keys(playoff_standings).map(key => playoff_standings[key])
    return db_helpers.updatePlayoffStandings(knex, standings_for_insert)
    .then(()=>{
      return schedInfo
    })
  }else if(sportName==='MLB' && schedInfo.length>0){
    //this isn't doing anything yet. Will eventually be used to find playoff byes for baseball
      let non_byes = [schedInfo[0].home_team_id, schedInfo[0].away_team_id, schedInfo[1].home_team_id, schedInfo[1].away_team_id]
      let playoff_teams = await knex('sports.playoff_standings').where('team_id',"<",103999).andWhere('team_id',">",103000).andWhere('playoff_status',">",2).select('team_id')
      let playoff_team_ids = playoff_teams.map(team => team.team_id)
      let byes = []
      playoff_team_ids.forEach(team =>{
        if(!(non_byes.includes(team))){
          byes.push(team)
        }
      })
    }
  //console.log('here')
  //console.log(stadiumInfo[0])
  return schedInfo
  }






createSchedule()

