const db_helpers = require('./helpers').data
const fantasyHelpers = require('../server/routes/helpers/fantasyHelpers')
const knex = require('../server/db/connection')
const myNull = '---'

//need to change cbb to tournament hiearchy

async function createSchedule()
{
  let CBB_schedPO = await getSchedInfo(knex, 'CBB', 'CBBv3ScoresClient', 'getSchedulesPromise','2017POST')
  let MLB_schedPO = await getSchedInfo(knex, 'MLB', 'MLBv3StatsClient', 'getSchedulesPromise', '2017POST')
  let NBA_schedPO = await getSchedInfo(knex, 'NBA', 'NBAv3ScoresClient', 'getSchedulesPromise','2017POST')
  // //console.log(NBA_stadiums)
  let NHL_schedPO = await getSchedInfo(knex, 'NHL', 'NHLv3ScoresClient', 'getSchedulesPromise','2017POST')
  let NFL_schedPO = await getSchedInfo(knex, 'NFL', 'NFLv3ScoresClient', 'getScoresBySeasonPromise','2017POST')
  let CFB_schedPO = await getSchedInfo(knex, 'CFB', 'CFBv3ScoresClient', 'getSchedulesPromise','2017POST')
  //let CBB_schedPO = await getSchedInfo(knex, 'CFB', 'CBBv3ScoresClient', 'getSchedulesPromise','2017POST')
  let data = MLB_schedPO.concat(NBA_schedPO).concat(NHL_schedPO).concat(NFL_schedPO)//.concat(CFB_schedPO).concat(CBB_schedPO)

  //still needs to be fixed for non null values
  db_helpers.updateSchedule(knex, data)
    .then(result => {
      console.log('Number of Schedules Updated: ' + result)
      process.exit()
    })
}



const getSchedInfo = async (knex, sportName, api, promiseToGet, year) => {
  let schedData = await db_helpers.getFdata (knex, sportName, api, promiseToGet, year)
  console.log()
  let sport_id = await db_helpers.getSportId(knex,sportName)
  let teamIdMap = await db_helpers.getTeamIdMap(knex, sport_id)
 /*   .then((FantasyDataClient) => {
    FantasyDataClient.MLBv3ScoresClient.getStadiumsPromise() */
  let cleanSched = JSON.parse(schedData)
  if(sportName === 'CBB'){
    let second_sched = cleanSched.Games
    cleanSched = second_sched
  }
  //let schedInfo = sportSchedFunctions[sport_id](cleanSched, teamIdMap)
  let schedInfo = cleanSched.map(game =>
    {
      let date_time = game.DateTime ? game.DateTime : game.Day
      let status = sport_id !== '102' ? game.Status :
        game.IsOver ? game.IsOvertime ? 'F/OT' : 'Final' : game.IsInProgress ? 'InProgress' : game.Canceled ? 'Canceled' : 'Scheduled'
      let home_score = sport_id === '103' ? game.HomeTeamRuns : sport_id === '102'? game.HomeScore : game.HomeTeamScore 
      let away_score = sport_id === '103' ? game.AwayTeamRuns : sport_id === '102'? game.AwayScore : game.AwayTeamScore
      return {global_game_id: game['GlobalGameID'], 
        home_team_id : teamIdMap[game['GlobalHomeTeamID']], 
        away_team_id : teamIdMap[game['GlobalAwayTeamID']],
        date_time: date_time,
        day_count: fantasyHelpers.getDayCountStr(date_time),
        status: status,
        sport_id: sport_id, 
        home_team_score: home_score !== null ? home_score : -1,
        away_team_score: away_score !== null ? away_score : -1,
        winner: status[0] === 'F' ? home_score > away_score ? 'H' : away_score < home_score ? 'A' : 'T' : myNull,
        time: sport_id === '103' ? game.Outs === null ? myNull : game.Outs :
          sport_id === '107' ? game.Clock === null ? myNull : game.Clock :
          sport_id === '102' ? game.TimeRemaining === null ? myNull : game.TimeRemaining :
          game.TimeRemainingMinutes === null 
              ? myNull 
              : (game.TimeRemainingMinutes < 10 ? '0' + game.TimeRemainingMinutes : game.TimeRemainingMinutes)
              + ':' + (game.TimeRemainingSeconds < 10 ? '0' + game.TimeRemainingSeconds : game.TimeRemainingSeconds),
        period: sport_id === '103' ? game.Inning === null ? myNull : game.InningHalf + game.Inning :
                sport_id === '104' ? game.Period === null ? myNull : game.Period :
                sport_id === ('105' || '106') ? game.TimeRemainingMinutes !== null ? game.Period : myNull :
                sport_id === '107' ? game.Clock === null ? myNull : game.Clock < 45 ? 1 : 2 :
                game.Quarter === null || status[0] === 'F' ? myNull : game.Quarter,
        updated_time: sport_id === '103' ? game.Status === 'InProcess' ? game.InningHalf + game.Inning+'-'+ game.Outs+':'+game.Balls+':'+game.Strikes : game.Status :
                      sport_id === '102' ? game.LastUpdated ? game.LastUpdated: myNull :
                      game.Updated ? game.Updated: myNull,
        season_type: game.SeasonType
    } 
   })

  let sport_teams = teamIds.map(team=> team.team_id)
  let playoff_ids = []
  sport_teams.forEach(team =>{
    let playoff = schedInfo.findIndex(game => team === (game.home_team_id || game.away_team_id))
    playoff>-1 ? playoff_ids.push(team) : 0
  })
  if(sportName === 'CBB'){
    let completed_tournament_games = schedInfo.filter(game => game.status[0]==='F')
    if(completed_tournament_games.length !== 0){
      let playoff_standings = {}
      completed_tournament_games.forEach(game =>{
        if(!(game.home_team_id in playoff_standings)){
          playoff_standings[game.home_team_id] = {team_id: game.home_team_id, playoff_wins: 0, playoff_losses: 0, playoff_status: 'in_playoffs'}
        }
        if(!(game.away_team_id in playoff_standings)){
          playoff_standings[game.away_team_id] = {team_id: game.away_team_id, playoff_wins: 0, playoff_losses: 0, playoff_status: 'in_playoffs'}
        }
        let results = game.winner === 'H' ? [game.home_team_id, game.away_team_id] : [game.away_team_id, game.home_team_id]
        playoff_standings[results[0]].playoff_wins++
        playoff_standings[results[1]].playoff_losses++
      })
    }
  }
  //console.log('here')
  //console.log(stadiumInfo[0])
  return schedInfo
}





createSchedule()
