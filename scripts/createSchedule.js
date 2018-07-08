const db_helpers = require('./helpers').data
const fantasyHelpers = require('../server/routes/helpers/fantasyHelpers')
const knex = require('../server/db/connection')
const myNull = '---'



async function createSchedule()
{
  //let nhlData = await getNhlData()
  let nbaData = await getData('NBA', 'https://api.fantasydata.net/v3/nba/scores/JSON/Games/2018')
  let nhlData = await getData('NHL', 'https://api.fantasydata.net/v3/nhl/scores/JSON/Games/2018')
  let nflData = await getData('NFL', 'https://api.fantasydata.net/v3/nfl/scores/JSON/Schedules/2017')
  let mlbData = await getData('MLB', 'https://api.fantasydata.net/v3/mlb/scores/JSON/Games/2018')
  let cfbData = await getData('CFB', 'https://api.fantasydata.net/v3/cfb/scores/JSON/Games/2017')
  let cbbData = await getData('CBB', 'https://api.fantasydata.net/v3/cbb/scores/JSON/Games/2018')
  let eplData = await getData('EPL', 'https://api.fantasydata.net/v3/soccer/scores/json/Schedule/144')
  // let nflData = await getNflData()
  // let eplData = await getEplData()
  let data = nhlData.concat(nbaData).concat(cbbData).concat(cfbData).concat(mlbData).concat(nflData).concat(eplData)
 
  console.log(data.length)
  // await db_helpers.insertIntoTable(knex, 'sports', 'schedule', data.slice(0,5000))
  // await db_helpers.insertIntoTable(knex, 'sports', 'schedule', data.slice(5000,10000))
  // await db_helpers.insertIntoTable(knex, 'sports', 'schedule', data.slice(10000))
  process.exit()
}

async function getData(league, url)
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
          sport_id:game.sport_id,
          home_team_score: -1, 
          away_team_score: -1,
          status: "Scheduled", period: myNull, updated_time: myNull,
          time: myNull, winner: myNull,
          season_type: game.SeasonType,
          stadium_id: game.stadium_id
        })    
      })
      newSchedule = newSchedule.filter(x => x.away_team_id && x.home_team_id)
      console.log(newSchedule.length)
      return newSchedule
    })
}


createSchedule()

  

  