const db_helpers = require('./helpers').data
const fantasyHelpers = require('../server/routes/helpers/fantasyHelpers')
const knex = require('../server/db/connection')
const myNull = '---'



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
  let sport_json = sport_JSON_functions[sport_id]
  let schedInfo = db_helpers.createScheduleForInsert(cleanSched, sport_id, idSpelling, teamIdMap, fantasyHelpers, myNull, sport_json)

  return schedInfo
}


const NBA_json = (game) => {
  return {
    //quarter data in stats/box scores
    last_play: game.LastPlay
    //below needs to be added back when they update
    // home_quarter_1: game.HomeScoreQuarter1,
    // home_quarter_2: game.HomeScoreQuarter2,
    // home_quarter_3: game.HomeScoreQuarter3,
    // home_quarter_4: game.HomeScoreQuarter4,
    // home_overtime: game.HomeScoreOvertime,
    // away_quarter_1: game.AwayScoreQuarter1,
    // away_quarter_2: game.AwayScoreQuarter2,
    // away_quarter_3: game.AwayScoreQuarter3,
    // away_quarter_4: game.AwayScoreQuarter4,
    // away_overtime: game.AwayScoreOvertime,
  }
}

const NFL_json = (game) => {
  return {
    home_quarter_1: game.HomeScoreQuarter1,
    home_quarter_2: game.HomeScoreQuarter2,
    home_quarter_3: game.HomeScoreQuarter3,
    home_quarter_4: game.HomeScoreQuarter4,
    home_overtime: game.HomeScoreOvertime,
    away_quarter_1: game.AwayScoreQuarter1,
    away_quarter_2: game.AwayScoreQuarter2,
    away_quarter_3: game.AwayScoreQuarter3,
    away_quarter_4: game.AwayScoreQuarter4,
    away_overtime: game.AwayScoreOvertime,
    down: game.Down,
    distance: game.Distance,
    possession: game.Possession, 
    yard_line: game.YardLine,
    yard_line_territory: game.YardLineTerritory,
    down_and_distance: game.DownAndDistance,
    red_zone: game.RedZone,
    last_play: game.LastPlay
  }
}

const MLB_json = (game) => {
  return {
    outs: game.Outs,
    balls: game.Balls,
    strikes: game.Strikes,
    away_starter: game.AwayTeamStartingPitcher,
    home_starter: game.HomeTeamStartingPitcher,
    current_pitcher: game.CurrentPitcher,
    current_hitter: game.CurrentHitter,
    winning_pitcher: game.WinningPitcher,
    losing_pitcher: game.LosingPitcher,
    away_errors: game.AwayTeamErrors,
    away_hits: game.AwayTeamHits,
    home_hits: game.HomeTeamHits,
    home_errors: game.HomeTeamErrors,
    half_inning: game.InningHalf,
    last_play: game.LastPlay
  }
}

const NHL_json = (game) => {
  return {
    last_play: game.LastPlay
  }
}

const CBB_json = (game) => {
  return {
    last_play: game.LastPlay
  }
}

const CFB_json = (game) => {
  return {
    //there is no last play: last_play: game.LastPlay
  }
}

const EPL_json = (game) => {
  return {
    last_play: game.LastPlay
  }
}

const sport_JSON_functions = {
  101: NBA_json,
  102: NFL_json,
  103: MLB_json,
  104: NHL_json,
  105: CFB_json,
  106: CBB_json,
  107: CBB_json
}
createSchedule()

  

  