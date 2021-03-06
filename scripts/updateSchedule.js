const db_helpers = require('./helpers').data
const fantasyHelpers = require('../server/routes/helpers/fantasyHelpers')
const knex = require('../server/db/connection')
const myNull = '---'
const sport_keys = require('./sportKeys')
const asyncForEach = require('./asyncForEach')
const sport_JSON_functions = require('./scheduleJsons')


const create_data = async (all) => {
  let data = []
  let season_calls = await fantasyHelpers.activeSeasons(all)
  let regular_season_calls = season_calls.filter(season => season.season_type === 1)
  await asyncForEach(regular_season_calls, async (season) => {
    let sport_id = season.sport_id
    let sport = sport_keys[sport_id]
    data.push(...await getSchedInfo(knex, sport.sport_name, sport.api, sport.schedulePromiseToGet, season.api_pull_parameter, season.sport_season_id))
  })
  return data
}

async function createSchedule(exitProcess, reset='false')
{
  let data = await create_data(reset)

  db_helpers.updateSchedule(knex, data)
    .then(result => {
      console.log('Number of Schedules Updated: ' + result)
      if(exitProcess)
        process.exit()
    })
}

const getSchedInfo = async (knex, sportName, api, promiseToGet, year, sport_season_id) => {
  let schedData = await db_helpers.getFdata (knex, sportName, api, promiseToGet, year)
  let sport_id = await db_helpers.getSportId(knex,sportName)
  let teamIdMap = await db_helpers.getTeamIdMap(knex, sport_id)
  let cleanSched = JSON.parse(schedData)
  console.log(`Sport: ${sportName}, Year: ${year}`)
  const idSpelling = sportName === 'EPL' ? 'Id' : 'ID'
  let sport_json = sport_JSON_functions[sport_id].schedule
  let schedInfo = db_helpers.createScheduleForInsert(cleanSched, sport_id, idSpelling, teamIdMap, fantasyHelpers, myNull, sport_json, sport_season_id)

  return schedInfo
}

module.exports = {
  createSchedule
}

  

  