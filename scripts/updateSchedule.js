const db_helpers = require('./helpers').data
const fantasyHelpers = require('../server/routes/helpers/fantasyHelpers')
const knex = require('../server/db/connection')
const myNull = '---'
const json_functions = require('./scheduleJsons')



async function createSchedule()
{
  let cbbData = await getSchedInfo(knex, 'CBB', 'CBBv3ScoresClient', 'getSchedulesPromise','2018')
  let mlbData = await getSchedInfo(knex, 'MLB', 'MLBv3StatsClient', 'getSchedulesPromise', '2018')
  let nbaData = await getSchedInfo(knex, 'NBA', 'NBAv3ScoresClient', 'getSchedulesPromise','2018')
  let nhlData = await getSchedInfo(knex, 'NHL', 'NHLv3ScoresClient', 'getSchedulesPromise','2018')
  let nflData = await getSchedInfo(knex, 'NFL', 'NFLv3ScoresClient', 'getScoresBySeasonPromise','2017')
  let cfbData = await getSchedInfo(knex, 'CFB', 'CFBv3ScoresClient', 'getSchedulesPromise','2017')
  let eplData = await getSchedInfo(knex, 'EPL', 'Soccerv3ScoresClient', 'getSchedulePromise', '144')
  
  

  let data = (nbaData).concat(cbbData).concat(cfbData).concat(mlbData).concat(nflData).concat(eplData).concat(nhlData)
  db_helpers.updateSchedule(knex, data)
    .then(result => {
      console.log('Number of Schedules Updated: ' + result)
      process.exit()
    })
}

const getSchedInfo = async (knex, sportName, api, promiseToGet, year) => {
  let schedData = await db_helpers.getFdata (knex, sportName, api, promiseToGet, year)
  let sport_id = await db_helpers.getSportId(knex,sportName)
  let teamIdMap = await db_helpers.getTeamIdMap(knex, sport_id)
  let cleanSched = JSON.parse(schedData)
  const idSpelling = sportName === 'EPL' ? 'Id' : 'ID'
  let sport_json = json_functions[sport_id]
  let schedInfo = db_helpers.createScheduleForInsert(cleanSched, sport_id, idSpelling, teamIdMap, fantasyHelpers, myNull, sport_json)

  return schedInfo
}


createSchedule()

  

  