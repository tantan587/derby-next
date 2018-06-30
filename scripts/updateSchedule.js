const db_helpers = require('./helpers').data
const fantasyHelpers = require('../server/routes/helpers/fantasyHelpers')
const knex = require('../server/db/connection')
const myNull = '---'



async function createSchedule()
{
  let nhlData = await getNhlData()
  let nbaData = await getNbaData()
  let nflData = await getNflData()
  let mlbData = await getMlbData()
  let cfbData = await getCfbData()
  let cbbData = await getCbbData()
  let eplData = await getEplData()

  let data = nhlData.concat(nbaData).concat(cbbData).concat(cfbData).concat(mlbData).concat(nflData).concat(eplData)
  console.log(data)
  db_helpers.updateSchedule(knex, data)
    .then(result => {
      console.log('Number of Schedules Updated: ' + result)
      process.exit()
    })
}

async function getNflData()
{
  return db_helpers.getScheduleData(knex, 'NFL', 'https://api.fantasydata.net/v3/nfl/scores/JSON/Scores/2017')
    .then(result => { 
      let newSchedule = []
      console.log(result)
      result.map(game => 
      {
        
        if(game.away_team_id && game.home_team_id)
        {
          let status = game.IsOver ? game.IsOvertime ? 'F/OT' : 'Final' : game.IsInProgress ? 'InProgress' : game.Canceled ? 'Canceled' : 'Scheduled'
          newSchedule.push({global_game_id: game.global_game_id, 
            home_team_score : game.HomeScore !== null ? game.HomeScore : -1, 
            away_team_score : game.AwayScore !== null ? game.AwayScore : -1,
            status: status,
            winner: status[0] === 'F' ? game.HomeTeam > game.AwayTeam ? 'H' :'A' : myNull,
            time: game.TimeRemaining === null ? myNull : game.TimeRemaining,
            period: game.Quarter === null || game.Quarter[0] === 'F' ? myNull : game.Querter,
            updated_time:game.LastUpdated ? game.LastUpdated: myNull,
            home_team_id : game.home_team_id, 
            away_team_id : game.away_team_id,
            date_time: game.date_time,
            day_count: fantasyHelpers.getDayCountStr(game.date_time),
            sport_id: game.sport_id, season_type: game.SeasonType
          }) 
        }
      })
      console.log(newSchedule.length)
      return newSchedule
    })
}

async function getMlbData()
{
  return db_helpers.getScheduleData(knex, 'MLB', 'https://api.fantasydata.net/v3/mlb/scores/JSON/Games/2018')
    .then(result => { 
      let newSchedule = []
      result.map(game => 
      {
        
        if(game.away_team_id && game.home_team_id)
        {
          newSchedule.push({global_game_id: game.global_game_id, 
            home_team_score : game.HomeTeamRuns !== null ? game.HomeTeamRuns : -1, 
            away_team_score : game.AwayTeamRuns !== null ? game.AwayTeamRuns : -1,
            status: game.Status,
            winner: game.Status[0] === 'F' ? game.HomeTeamRuns > game.AwayTeamRuns ? 'H' :'A' : myNull,
            time: game.Outs === null ? myNull : game.Outs,
            period: game.Inning === null ? myNull : game.InningHalf + game.Inning,
            updated_time:game.Status === 'InProcess' ? game.InningHalf + game.Inning+'-'+ game.Outs+':'+game.Balls+':'+game.Strikes : game.Status,
            home_team_id : game.home_team_id, 
            away_team_id : game.away_team_id,
            date_time: game.date_time,
            day_count: fantasyHelpers.getDayCountStr(game.date_time),
            sport_id: game.sport_id, season_type: game.SeasonType}) 
        }
      })
      console.log(newSchedule.length)
      return newSchedule
    })
}

async function getNbaData()
{
  return db_helpers.getScheduleData(knex, 'NBA', 'https://api.fantasydata.net/v3/nba/scores/JSON/Games/2018')
    .then(result => { 
      let newSchedule = []
      result.map(game => 
      {
        
        if(game.away_team_id && game.home_team_id)
        {
          newSchedule.push({global_game_id: game.global_game_id, 
            home_team_score : game.HomeTeamScore !== null ? game.HomeTeamScore : -1, 
            away_team_score : game.AwayTeamScore !== null ? game.AwayTeamScore : -1,
            status: game.Status,
            winner: game.Status[0] === 'F' ? game.HomeTeamScore > game.AwayTeamScore ? 'H' :'A' : myNull,
            time: game.TimeRemainingMinutes === null 
              ? myNull 
              : (game.TimeRemainingMinutes < 10 ? '0' + game.TimeRemainingMinutes : game.TimeRemainingMinutes)
              + ':' + 
              (game.TimeRemainingSeconds < 10 ? '0' + game.TimeRemainingSeconds : game.TimeRemainingSeconds),
            period: game.Quarter === null ? myNull : game.Quarter,
            updated_time:game.Updated ? game.Updated: myNull,
            home_team_id : game.home_team_id, 
            away_team_id : game.away_team_id,
            date_time: game.date_time,
            day_count: fantasyHelpers.getDayCountStr(game.date_time),
            sport_id: game.sport_id, season_type: game.SeasonType}) 
        }
      })
      console.log(newSchedule.length)
      return newSchedule
    })
}

async function getNhlData()
{
  return db_helpers.getScheduleData(knex, 'NHL', 'https://api.fantasydata.net/v3/nhl/scores/JSON/Games/2018')
    .then(result => { 
      let newSchedule = []
      result.map(game => 
      {
        
        if(game.away_team_id && game.home_team_id)
        {
          newSchedule.push({global_game_id: game.global_game_id, 
            home_team_score : game.HomeTeamScore !== null ? game.HomeTeamScore : -1, 
            away_team_score : game.AwayTeamScore !== null ? game.AwayTeamScore : -1,
            status: game.Status,
            winner: game.Status[0] === 'F' ? game.HomeTeamScore > game.AwayTeamScore ? 'H' :'A' : myNull,
            time: game.TimeRemainingMinutes === null 
              ? myNull 
              : (game.TimeRemainingMinutes < 10 ? '0' + game.TimeRemainingMinutes : game.TimeRemainingMinutes)
              + ':' + 
              (game.TimeRemainingSeconds < 10 ? '0' + game.TimeRemainingSeconds : game.TimeRemainingSeconds),
            period: game.Period === null ? myNull : game.Period,
            updated_time:game.Updated ? game.Updated: myNull,
            home_team_id : game.home_team_id, 
            away_team_id : game.away_team_id,
            date_time: game.date_time,
            day_count: fantasyHelpers.getDayCountStr(game.date_time),
            sport_id: game.sport_id, season_type: game.SeasonType}) 
        }
      })
      console.log(newSchedule.length)
      return newSchedule
    })
}

async function getCbbData()
{
  return db_helpers.getScheduleData(knex, 'CBB', 'https://api.fantasydata.net/v3/cbb/scores/JSON/Games/2018')
    .then(result => { 
      let newSchedule = []
      result.map(game => 
      {
        if(game.away_team_id && game.home_team_id)
        {
          newSchedule.push({global_game_id: game.global_game_id, 
            home_team_score : game.HomeTeamScore !== null ? game.HomeTeamScore : -1, 
            away_team_score : game.AwayTeamScore !== null ? game.AwayTeamScore : -1,
            status: game.Status,
            winner: game.Status[0] === 'F' ? game.HomeTeamScore > game.AwayTeamScore ? 'H' :'A' : myNull,
            time: game.TimeRemainingMinutes === null 
              ? myNull 
              : (game.TimeRemainingMinutes < 10 ? '0' + game.TimeRemainingMinutes : game.TimeRemainingMinutes)
              + ':' + 
              (game.TimeRemainingSeconds < 10 ? '0' + game.TimeRemainingSeconds : game.TimeRemainingSeconds),
            period: game.TimeRemainingMinutes !== null ? game.Period : myNull,
            updated_time:game.Updated ? game.Updated: myNull, home_team_id : game.home_team_id, 
            away_team_id : game.away_team_id,
            date_time: game.date_time,
            day_count: fantasyHelpers.getDayCountStr(game.date_time),
            sport_id: game.sport_id, season_type: game.SeasonType}) 
        }
      })
      console.log(newSchedule.length)
      return newSchedule
    })
}

async function getCfbData()
{
  return db_helpers.getScheduleData(knex, 'CFB', 'https://api.fantasydata.net/v3/cfb/scores/JSON/Games/2017')
    .then(result => { 
      let newSchedule = []
      result.map(game => 
      {
        if(game.away_team_id && game.home_team_id)
        {
          newSchedule.push({global_game_id: game.global_game_id, 
            home_team_score : game.HomeTeamScore !== null ? game.HomeTeamScore : -1, 
            away_team_score : game.AwayTeamScore !== null ? game.AwayTeamScore : -1,
            status: game.Status,
            winner: game.Status[0] === 'F' ? game.HomeTeamScore > game.AwayTeamScore ? 'H' :'A' : myNull,
            time: game.TimeRemainingMinutes === null 
              ? myNull 
              : (game.TimeRemainingMinutes < 10 ? '0' + game.TimeRemainingMinutes : game.TimeRemainingMinutes)
              + ':' + 
              (game.TimeRemainingSeconds < 10 ? '0' + game.TimeRemainingSeconds : game.TimeRemainingSeconds),
            period: game.TimeRemainingMinutes !== null ? game.Period : myNull,
            updated_time:game.Updated ? game.Updated: myNull,
            home_team_id : game.home_team_id, 
            away_team_id : game.away_team_id,
            date_time: game.date_time,
            day_count: fantasyHelpers.getDayCountStr(game.date_time),
            sport_id: game.sport_id, season_type: game.SeasonType}) 
        }
      })
      console.log(newSchedule.length)
      return newSchedule
    })
}

async function getEplData()
{
  return db_helpers.getScheduleData(knex, 'EPL', 'https://api.fantasydata.net/v3/soccer/scores/json/Schedule/144')
    .then(result => { 
      let newSchedule = []
      let display = true
      result.map(game => 
      {
        if(game.away_team_id && game.home_team_id)
        {
          const entry = {global_game_id: game.global_game_id, 
            home_team_score : game.HomeTeamScore !== null ? game.HomeTeamScore : -1, 
            away_team_score : game.AwayTeamScore !== null ? game.AwayTeamScore : -1,
            status: game.Status,
            winner: game.Status[0] === 'F' ? game.HomeTeamScore > game.AwayTeamScore ? 'H' : game.HomeTeamScore < game.AwayTeamScore ? 'A' : 'T' : myNull,
            time: game.Clock === null ? myNull : game.Clock,
            period: game.Clock === null ? myNull : game.Clock < 45 ? 1 : 2,
            updated_time:game.Updated ? game.Updated: myNull,
            home_team_id : game.home_team_id, 
            away_team_id : game.away_team_id,
            date_time: game.date_time,
            day_count: fantasyHelpers.getDayCountStr(game.date_time),
            sport_id: game.sport_id, season_type: game.SeasonType}
          
          if (display && entry.home_team_score === -1 && entry.status === 'Final')
          {
            console.log(game, entry)
            display = false
          }
          newSchedule.push(entry) 
        }
      })
      console.log(newSchedule.length)
      return newSchedule
    })
}


createSchedule()

  

  