const db_helpers = require('./helpers').data
//const fantasyHelpers = require('../server/routes/helpers/fantasyHelpers')
const knex = require('../server/db/connection')



async function createSchedule()
{

  let MLB_schedPO = await getSchedInfo(knex, 'MLB', 'MLBv3ScoresClient', 'getSchedulesPromise', '2017POST')
  //console.log(MLB_stadiums.length)
  // let NBA_schedPO = await getSchedInfo(knex, 'NBA', 'NBAv3ScoresClient', 'getSchedulesPromise','2017POST')
  // //console.log(NBA_stadiums)
  // let NHL_schedPO = await getSchedInfo(knex, 'NHL', 'NHLv3ScoresClient', 'getSchedulesPromise','2017POST')
  // let NFL_schedPO = await getSchedInfo(knex, 'NFL', 'NFLv3ScoresClient', 'getSchedulesPromise','2017POST')
  // let CFB_schedPO = await getSchedInfo(knex, 'CFB', 'CFBv3ScoresClient', 'getSchedulesPromise','2017POST')
  // let CBB_schedPO = await getSchedInfo(knex, 'CFB', 'CBBv3ScoresClient', 'getSchedulesPromise','2017POST')
  // let EPL_schedPO = await getSchedInfo(knex, 'EPL', 'Soccerv3ScoresClient','getSchedulesPromise','2017POST')
  // let data = MLB_schedPO.concat(NBA_schedPO).concat(NHL_schedPO).concat(NFL_schedPO).concat(CFB_schedPO).concat(EPL_schedPO).concat(CBB_schedPO)

  console.log(MLB_schedPO)
  /* db_helpers.insertIntoTable(knex, 'sports', 'schedule', data)
    .then(result => {
      console.log('Number of Schedules Updated: ' + result)
      process.exit()
    }) */
}



const getSchedInfo = async (knex, sportName, api, promiseToGet, year) => {
  let schedData = await db_helpers.getFdata (knex, sportName, api, promiseToGet, year)
  let sportid = '103' //await db_helpers.getSportId(knex,sportName)

/*   .then((FantasyDataClient) => {
    FantasyDataClient.MLBv3ScoresClient.getStadiumsPromise() */
  let cleanSched = JSON.parse(schedData)
  console.log(cleanSched[0])
  process.exit()

  schedInfo = schedData.map(game =>
    {
      return {global_game_id: game.global_game_id, 
        home_team_id : game.home_team_id, 
        away_team_id : game.away_team_id,
        date_time: game.date_time,
        //day_count: fantasyHelpers.getDayCountStr(game.date_time),
        sport_id:game.sport_id}
  }
  )
  //console.log('here')
  //console.log(stadiumInfo[0])
  return schedInfo
}


/* async function getData(league, url)
{
  return db_helpers.getScheduleData(knex, league, url)
    .then(result => { 
      let newSchedule = []
      result.map(game => 
      {
        newSchedule.push({global_game_id: game.global_game_id, 
          home_team_id : game.home_team_id, 
          away_team_id : game.away_team_id,
          date_time: game.date_time,
          day_count: fantasyHelpers.getDayCountStr(game.date_time),
          sport_id:game.sport_id})    
      })
      newSchedule = newSchedule.filter(x => x.away_team_id && x.home_team_id)
      console.log(newSchedule.length)
      return newSchedule
    })
} */


createSchedule()