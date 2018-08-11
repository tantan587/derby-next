var methods = {}
//const rp = require('request-promise')
const fdClientModule = require('fantasydata-node-client')



methods.insertIntoTable = async function(knex, schema, table, data) {
  return knex
    .withSchema(schema)
    .table(table)
    .insert(data)
}

methods.getTeamId =  function(knex, sportId)
{
  return knex
    .withSchema('sports')
    .table('data_link')
    .where('sport_id', sportId)
}

methods.getTeamIdMap = async function(knex, sport_id) {
  let teamIds = await methods.getTeamAndGlobalId(knex, sport_id)
  let teamIdMap = {}
  teamIds.forEach(team => teamIdMap[team.global_team_id] = team.team_id)
  return teamIdMap
}

methods.getSportId = async function(knex, sportName)
{
  return knex
    .withSchema('sports')
    .table('leagues')
    .where('sport_name', sportName) 
    .select('sport_id')
    .then((x)=>{
      return x[0].sport_id
    })
}

methods.getTeamAndGlobalId =  async function(knex, sportId)
{
  return knex
    .withSchema('sports')
    .table('data_link')
    .where('sport_id', sportId)
    .select('team_id', 'global_team_id')
}

methods.createScheduleForInsert = function(cleanSched, sport_id, idSpelling, teamIdMap, fantasyHelpers, myNull, json_function, sport_season_id) {

  return cleanSched.map(game => {
  //below is commented out, and kept, becasue it was there to catch teams that didn't go through, and didn't have IDs
    /*     if(sport_id==106 || sport_id==105){
      if(!(game.GlobalHomeTeamID in teamIdMap)){
        console.log(game.HomeTeam)
      }
      if(!(game.GlobalAwayTeamID in teamIdMap)){
        console.log(game.AwayTeam)
      }
    } */
    let date_time = game.DateTime ? game.DateTime : game.Day
    let status = sport_id !== '102' ? game.Status :
      game.IsOver ? game.IsOvertime ? 'F/OT' : 'Final' : game.IsInProgress ? 'InProgress' : game.Canceled ? 'Canceled' : 'Scheduled'
    let home_score = sport_id === '103' ? game.HomeTeamRuns : sport_id === '102' ? game.HomeScore : game.HomeTeamScore
    let away_score = sport_id === '103' ? game.AwayTeamRuns : sport_id === '102' ? game.AwayScore : game.AwayTeamScore
    return {
      global_game_id: game['GlobalGame' + idSpelling],
      home_team_id: teamIdMap[game['GlobalHomeTeam' + idSpelling]],
      away_team_id: teamIdMap[game['GlobalAwayTeam' + idSpelling]],
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
      updated_time: sport_id === '103' ? game.Status === 'InProcess' ? game.InningHalf + game.Inning + '-' + game.Outs + ':' + game.Balls + ':' + game.Strikes : game.Status :
        sport_id === '102' ? game.LastUpdated ? game.LastUpdated : myNull :
          game.Updated ? game.Updated : myNull,
      season_type: game.SeasonType, year: game.Season, 
      game_extra: JSON.stringify(json_function(game)), 
      sport_season_id: sport_season_id
    }
  })

}


methods.getFdata = async (knex, sportName,api, promiseToGet, parameters=false, second_parameter=false) =>
{

  let league = await knex
    .withSchema('sports')
    .table('leagues')
    .where('sport_name', sportName)

  const keys = {}
  keys[api] = league[0].fantasy_data_key
  //const sport_id = league[0].sport_id
  const FantasyDataClient = new fdClientModule(keys)

  
  if(parameters===false){
    return FantasyDataClient[api][promiseToGet]()
  }else if(second_parameter===false){
    return FantasyDataClient[api][promiseToGet](parameters)
  }else{
    return FantasyDataClient[api][promiseToGet](parameters, second_parameter)
  }
  
}

methods.getSeasonCall = async (knex) => {
  let today = new Date()

  let seasons = 
    await knex
      .withSchema('sports')
      .table('sport_season')
      .where('start_pull_date', '<', today)
      .andWhere('end_pull_date', '>', today)
      .select('*')
  
  return seasons
}

methods.createStandingsData = async (knex, sportName, api, promiseToGet, year) =>{
  let standData = await methods.getFdata (knex, sportName, api, promiseToGet, year)
  let sport_id = await methods.getSportId(knex, sportName)
  let cleanStand = JSON.parse(standData)
  let teamIdMap = await methods.getTeamIdMap(knex, sport_id)
  
  let standInfo = []
  if(sportName === 'CFB'||sportName ==='CBB'){
    cleanStand.forEach(team => {
      if(teamIdMap[team.GlobalTeamID]!== undefined){
        standInfo.push({...team, team_id: teamIdMap[team.GlobalTeamID]})
      }
    })
  }else if(sportName==='EPL'){
    let newStand = cleanStand.filter(standings => standings.Scope === 'Total')
    standInfo = newStand.map(team=>
    {
      let global = fantasy_2_global[sportName] + Number(team.TeamId)
      return {...team, team_id: teamIdMap[global]}
    })
  }else{
    standInfo = cleanStand.map(team =>
    {
      //let f_team_id = sportName !== 'NFL' ? Number(team['Team'+idSpelling])<10 ? "0"+String(team.TeamID) : team.TeamID : team.TeamID
      //let global = fantasy_2_global[sportName]+f_team_id
      let global = fantasy_2_global[sportName] + Number(team.TeamID)
      return {...team, team_id: teamIdMap[global]}
    })
  }

  return standInfo
}

const fantasy_2_global = {
  'NBA': 20000000,
  'NFL': 0,
  'MLB': 10000000,
  'NHL': 30000000,
  'CBB': 50000000,
  'CFB': 60000000,
  'EPL': 90000000
}

methods.createSportData = async (knex, sport_id, sportName, api, promiseToGet, detail = false) => {

  let teams = await methods.getFdata(knex, sportName, api, promiseToGet, detail)
  let teamIdMap = await methods.getTeamIdMap(knex, sport_id)
    
  const conferences = await knex
    .withSchema('sports')
    .table('conferences')
    .leftOuterJoin('conferences_link', 'conferences.conference_id', 'conferences_link.conference_id')
    .where('sport_id',sport_id)
    .select('conferences.conference_id', 'conferences.name', 'display_name', 'fantasy_data_key')
  
  let confMap = {}
  conferences.forEach(conf => {
    if(conf.fantasy_data_key !== null){
      confMap[conf.fantasy_data_key] = conf.conference_id
    }else{
      confMap[conf.name] = conf.conference_id
    }
  })


  let cleanTeams = JSON.parse(teams)

  return [cleanTeams, teamIdMap, confMap]

}

methods.updateSchedule = (knex, newResults) =>
{
  return knex
    .withSchema('sports')
    .table('schedule')
    .then(results => {
      let oldResults = {}
      var updateList =[]
      results.forEach(result => oldResults[result.global_game_id] =result.updated_time)
      let gameErrors = []
      newResults.forEach(x =>
      {

        if(x.away_team_id==null || x.home_team_id ==null){
          gameErrors.push([x.global_game_id, x.date_time])
        }else{
          if(!(x.global_game_id in oldResults))
          {
            updateList.push(Promise.resolve(methods.insertOneResultRow(knex, x)))
          }
          else if(oldResults[x.global_game_id] !== x.updated_time)
          { 
            updateList.push(Promise.resolve(methods.newUpdateOneResultRow(knex, x.global_game_id, x)))
          }
          //this is only needed to add in years the first time
        /*           else if(oldResults[x.global_game_id].year !== x.year){
            updateList.push(Promise.resolve(methods.updateOneResultRow(knex, x.global_game_id, x)))
}
 */

        }
      })
      gameErrors.forEach(game => console.log(game))
      console.log('Game Errors: ',gameErrors.length)
      if (updateList.length > 0)
      {
        return Promise.all(updateList)
          .then(() => { 
            //console.log("im done updating!")
            return updateList.length
          })
      }
      else
        return 0
    })
}

methods.updateScheduleFromBoxScore = (knex, data) => {
  let updateList = []
  data.forEach(x => {
    console.log(x)
    updateList.push(Promise.resolve(methods.newUpdateOneResultRow(knex, x.global_game_id, x, false)))
  })
  if(updateList.length>0)
  {
    return Promise.all(updateList)
      .then(()=>{
        return updateList.length
      })
  }else
    return 0
}

methods.updateBowlWins = async (knex, bowl_wins, playoff_wins, sport_season_id) => {
  let results = 
    await knex
      .withSchema('sports')
      .table('playoff_standings')
      .where('team_id', '>', 105000)
      .andWhere('team_id','<', 105999)
  
  let oldStandings = {}
  var updateList = []
  results.forEach(result => oldStandings[result.team_id] = result)

  bowl_wins.forEach(teamRec => {
    if(oldStandings[teamRec.team_id].bowl_wins !== teamRec.bowl_wins)  
      updateList.push(Promise.resolve(methods.updateOneStandingRow(knex, teamRec.team_id, teamRec.sport_season_id, 'bowl_wins', teamRec.bowl_wins, true )))
  })

  playoff_wins.forEach(teamRec => {
    if(oldStandings[teamRec.team_id].playoff_status !== teamRec.playoff_status)  
      updateList.push(Promise.resolve(methods.updateOneStandingRow(knex, teamRec.team_id, teamRec.sport_season_id, 'playoff_status', teamRec.playoff_status, true )))
    if(oldStandings[teamRec.team_id].playoff_wins !== teamRec.playoff_wins)  
      updateList.push(Promise.resolve(methods.updateOneStandingRow(knex, teamRec.team_id,teamRec.sport_season_id, 'playoff_wins', teamRec.playoff_wins, true )))
    if(oldStandings[teamRec.team_id].playoff_losses !== teamRec.playoff_losses)  
      updateList.push(Promise.resolve(methods.updateOneStandingRow(knex, teamRec.team_id,teamRec.sport_season_id,'playoff_losses', teamRec.playoff_losses, true )))
  })

  if (updateList.length > 0)
  {
    return Promise.all(updateList)
      .then(() => { 
        //console.log("im done updating!")
        return updateList.length
      })
  }
  else
    return 0
}

//this should use sport_season_id
methods.updatePlayoffStandings = async (knex, newStandings) =>
{
  let results = await knex
    .withSchema('sports')
    .table('playoff_standings')
  
  let oldStandings = {}
  var updateList =[]
  results.forEach(result => {
    if(!(result.sport_season_id in oldStandings)){
      oldStandings[result.sport_season_id] = {}
    }
    oldStandings[result.sport_season_id][result.team_id] = result
  })
  newStandings.map(teamRec =>
  {
    if(oldStandings[teamRec.sport_season_id][teamRec.team_id].playoff_wins !== teamRec.playoff_wins)  
      updateList.push(Promise.resolve(methods.updateOneStandingRow(knex, teamRec.team_id, teamRec.sport_season_id,'playoff_wins', teamRec.playoff_wins, true )))
    if(oldStandings[teamRec.sport_season_id][teamRec.team_id].playoff_losses !== teamRec.playoff_losses)  
      updateList.push(Promise.resolve(methods.updateOneStandingRow(knex, teamRec.team_id, teamRec.sport_season_id,'playoff_losses', teamRec.playoff_losses, true )))
    if(oldStandings[teamRec.sport_season_id][teamRec.team_id].playoff_status !== teamRec.playoff_status)  
      updateList.push(Promise.resolve(methods.updateOneStandingRow(knex, teamRec.team_id, teamRec.sport_season_id,'playoff_status', teamRec.playoff_status, true )))
    if(oldStandings[teamRec.sport_season_id][teamRec.team_id].year !== teamRec.year)
      updateList.push(Promise.resolve(methods.updateOneStandingRow(knex, teamRec.team_id, teamRec.sport_season_id,'year', teamRec.year, true )))
  })
  if (updateList.length > 0)
  {
    return Promise.all(updateList)
      .then(() => { 
        //console.log("im done updating!")
        return updateList.length
      })
  }
  else
    return 0
}

//this should use sport_season_id
methods.updateStandings = async (knex,newStandings) =>
{
  let results = await knex
    .withSchema('sports')
    .table('standings')
  
  let playoff_results = await knex('sports.playoff_standings')
  let oldPlayoffStandings = {}
  playoff_results.forEach(result => {
    if(!(result.sport_season_id in oldPlayoffStandings)){
      oldPlayoffStandings[result.sport_season_id] = {}
    }
    oldPlayoffStandings[result.sport_season_id][result.team_id] = result
  })
  

  let oldStandings = {}
  var updateList =[]
  results.map(result => {
    if(!(result.sport_season_id in oldStandings)){
      oldStandings[result.sport_season_id] = {}
    }
    oldStandings[result.sport_season_id][result.team_id] =result
  })

  newStandings.map(teamRec =>
  {
    if(oldStandings[teamRec.sport_season_id][teamRec.team_id].wins !== teamRec.wins)  
      updateList.push(Promise.resolve(methods.updateOneStandingRow(knex, teamRec.team_id, teamRec.sport_season_id, 'wins', teamRec.wins )))
    if(oldStandings[teamRec.sport_season_id][teamRec.team_id].losses !== teamRec.losses)  
      updateList.push(Promise.resolve(methods.updateOneStandingRow(knex, teamRec.team_id,  teamRec.sport_season_id, 'losses', teamRec.losses )))
    if(oldStandings[teamRec.sport_season_id][teamRec.team_id].ties !== teamRec.ties)  
      updateList.push(Promise.resolve(methods.updateOneStandingRow(knex, teamRec.team_id, teamRec.sport_season_id, 'ties', teamRec.ties )))
    if(oldStandings[teamRec.sport_season_id][teamRec.team_id].year !== teamRec.year)  
      updateList.push(Promise.resolve(methods.updateOneStandingRow(knex, teamRec.team_id, teamRec.sport_season_id, 'year', teamRec.year )))
    //year doesnt need to be on here, necessarily - its to create it initially
    //adds to sport season id bc base sport seasonid is 2 away
    if(oldPlayoffStandings[Number(teamRec.sport_season_id)+2][teamRec.team_id].year !== teamRec.year)
      updateList.push(Promise.resolve(methods.updateOneStandingRow(knex, teamRec.team_id, teamRec.sport_season_id, 'year', teamRec.year, true)))
  })

  if (updateList.length > 0)
  {
    return Promise.all(updateList)
      .then(() => { 
        //console.log("im done updating!")
        return updateList.length
      })
  }
  else
    return 0
}

methods.updateOneStandingRow = (knex, team_id, sport_season_id, column, value, playoffs=false) =>
{
  let table = playoffs ? 'playoff_standings' : 'standings'
  return knex
    .withSchema('sports')
    .table(table)
    .where('team_id',team_id)
    .andWhere('sport_season_id', sport_season_id)
    .update(column, value)
    .then(() =>
    {
      //console.log(team_id + " updated!")
    })
}

methods.insertOneResultRow = (knex, row) =>
{
  return knex
    .withSchema('sports')
    .table('schedule')
    .insert(row)
}

methods.updateOneResultRow = (knex, global_game_id, row) =>
{

  return knex.transaction(function (t) {
    return knex.withSchema('sports').table('schedule')
      .transacting(t)
      .where('global_game_id',global_game_id)
      .del()
      .then(() =>
      {
        return knex
          .transacting(t)
          .withSchema('sports')
          .table('schedule')
          .insert(row)
      })
      .then(()=>{t.commit})
      .catch(t.rollback)
  })
}

methods.newUpdateOneResultRow = (knex, global_game_id, row, from_schedule_pull = true) =>
{
  if(from_schedule_pull){
    let box_score_sports = [101, 103, 104, 105, 106]
    if(box_score_sports.includes(row.sport_id)){
      delete row[game_extra]
    } 
  }
  return knex.transaction(function (t) {
    return knex.withSchema('sports').table('schedule')
      .transacting(t)
      .where('global_game_id',global_game_id)
      .update(row)
      .then(()=>{t.commit})
      .catch(t.rollback)
  })
}

  

exports.data = methods
