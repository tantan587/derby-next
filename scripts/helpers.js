var methods = {}
const rp = require('request-promise')
const fdClientModule = require('fantasydata-node-client');


methods.insertIntoTable = function(knex, schema, table, data) {
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


methods.getScheduleData = (knex, sportName, url) => 
{
  return knex
    .withSchema('sports')
    .table('leagues')
    .where('sport_name', sportName)
    .then((league)=> {
      const sportId = league[0].sport_id
      const idSpelling = sportName === 'EPL' ? 'Id' : 'ID'
      return methods.getTeamAndGlobalId(knex, sportId)
        .then(teamIds => {
          let teamIdMap = {}
          teamIds.map(r => teamIdMap[r.global_team_id]= r.team_id)

          const options = {
            url: url,
            headers: {
              'User-Agent': 'request',
              'Ocp-Apim-Subscription-Key':league[0].fantasy_data_key
            },
            json: true
          }
          return rp(options)
            .then((fdata) => {
              let games = []
              fdata.filter(game => game['GlobalGame' + idSpelling] ).map(game => games.push({...game, //&& !game.Canceled
                global_game_id:game['GlobalGame' + idSpelling], 
                home_team_id:teamIdMap[game['GlobalHomeTeam' + idSpelling]],
                away_team_id:teamIdMap[game['GlobalAwayTeam' + idSpelling]],
                date_time:game.DateTime ? game.DateTime : game.Day,
                sport_id:sportId
              })
              )
              return games
            })
        })
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
  const sport_id = league[0].sport_id
  const FantasyDataClient = new fdClientModule(keys);

  
  if(parameters===false){
    return FantasyDataClient[api][promiseToGet]()
  }else if(second_parameter===false){
    return FantasyDataClient[api][promiseToGet](parameters)
  }else{
    return FantasyDataClient[api][promiseToGet](parameters, second_parameter)
  }
  
}

methods.createStandingsData = async (knex, sportName, api, promiseToGet, year) =>{
  let standData = await methods.getFdata (knex, sportName, api, promiseToGet, year)
  let sport_id = await methods.getSportId(knex, sportName)
  let teamIds = await methods.getTeamAndGlobalId(knex, sport_id)
  let cleanStand = JSON.parse(standData)
  let teamIdMap = {}
  const idSpelling = sportName === 'EPL' ? 'Id' : 'ID'
  teamIds.forEach(team => teamIdMap[team.global_team_id] = team.team_id)
  let standInfo = []
  if(sportName !== ('CBB'||'CFB')){
    standInfo = cleanStand.map(team =>
    {
      let f_team_id = sportName !== 'NFL' ? Number(team['Team'+idSpelling])<10 ? "0"+String(team.TeamID) : team.TeamID : team.TeamID
      let global = fantasy_2_global[sportName]+f_team_id
      return {...team, team_id: teamIdMap[global]}
    })
  }else if(sportName === 'CBB'){
    cleanStand.forEach(league => {
      league.forEach(team =>{
        standInfo.push({...team, team_id: teamIdMap[team.GlobalTeamID]})
      })
    })
  }else{
    cleanStand.forEach(team => {
      standInfo.push({...team, team_id: teamIdMap[team.GlobalTeamID]})
  })
}

  return standInfo
}

const fantasy_2_global = {
  'NBA': '200000',
  'NFL': '',
  'MLB': '100000',
  'NHL': '300000',
  'CBB': '500000',
  'CFB': '600000',
  'EPL': '900000'
}

methods.createSportData = async (knex, sport_id, sportName, api, promiseToGet, detail = false) => {

  let teams = await methods.getFdata(knex, sportName, api, promiseToGet, detail)
  let teamIds = await methods.getTeamAndGlobalId(knex, sport_id) 
  let teamIdMap = {}
  teamIds.forEach(team=> teamIdMap[team.global_team_id] = team.team_id)
  
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

methods.getFantasyData = async (knex, sportName, url, teamKeyField, confField, eplAreaIdInd = false) => 
{
  console.log(sportName)
  let league = await knex
    .withSchema('sports')
    .table('leagues')
    .where('sport_name', sportName)
  const sportId = league[0].sport_id
  

  let teamIdMap = {}
  const teamIds = await methods.getTeamId(knex, sportId)
         
  teamIds.forEach(r => teamIdMap[r.global_team_id]= r.team_id)
  
  const keys = {
      api:league[0].fantasy_data_key
  };
  // const FantasyDataClient = new fdClientModule(keys);
  // const fandata = FantasyDataClient.func
  const options = {
    url: url,
    headers: {
      'User-Agent': 'request',
      'Ocp-Apim-Subscription-Key':league[0].fantasy_data_key
    },
    json: true
  }

  let confMap = {}
  const conferences = await knex
    .withSchema('sports')
    .table('conferences')
    .leftOuterJoin('conferences_link', 'conferences.conference_id', 'conferences_link.conference_id')
    .where('sport_id',sportId)
    .select('conferences.conference_id', 'conferences.name', 'display_name', 'fantasy_data_key')
  
  //checks to see if the conference has a fantasy data representation (used for college sports)
  let filterConferencesInd = conferences[0].fantasy_data_key !== null

  if(filterConferencesInd)
  {
    conferences.forEach(conf => confMap[conf.fantasy_data_key] = conf.conference_id)
  }
  else{
    conferences.forEach(conf => confMap[conf.name] = conf.conference_id)
  }

  let fdata = await rp(options)
  let teams = []

  //filter out only the conferences we are using
  //TODO: this needs to change as we need more info on all teams
  if (filterConferencesInd) {
    fdata.filter(fd => fd.ConferenceID in confMap)
      .map(conf => 
        conf.Teams.map(team => 
          teams.push({...team, 
            sport_id:sportId,
            conference_id:confMap[conf[confField]], 
            team_id:teamIdMap[team['GlobalTeamID']]})))
  }
  // used for creation of epl leagues
  else if(eplAreaIdInd){

    fdata.filter(fd => fd.AreaId === 68 || fd.TeamId === 523)
      .map(team =>
      {
        if(teamIdMap[team[teamKeyField]])
        {
          teams.push({...team, 
            sport_id:sportId,
            conference_id: confMap[sportName], 
            team_id:teamIdMap[team['GlobalTeamId']]})
        }
      })
  } 
  //used for everything else (nba, nhl, mlb, nfl and epl when not creating)   
  else{

    fdata
      .map(team =>
        teams.push({...team, 
          sport_id:sportId,
          conference_id: sportName === 'EPL' ? confMap[sportName] : confMap[team[confField]], 
          team_id:teamIdMap[team['GlobalTeamID']]}))
  }
  return teams

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
      newResults.map(x =>
      {
        if(!(x.global_game_id in oldResults))
        {
          updateList.push(Promise.resolve(methods.insertOneResultRow(knex, x)))
        }
        else if(oldResults[x.global_game_id] !== x.updated_time)
        { 
          updateList.push(Promise.resolve(methods.updateOneResultRow(knex, x.global_game_id, x)))
        }
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
    })
}

methods.updatePlayoffStandings = (knex,newStandings) =>
{
  return knex
    .withSchema('sports')
    .table('playoff_standings')
    .then(results => {
      let oldStandings = {}
      var updateList =[]
      results.map(result => oldStandings[result.team_id] =result)

      newStandings.map(teamRec =>
      {
        if(oldStandings[teamRec.team_id].playoff_wins !== teamRec.playoff_wins)  
          updateList.push(Promise.resolve(methods.updateOneStandingRow(knex, teamRec.team_id,'playoff_wins', teamRec.playoff_wins, true )))
        if(oldStandings[teamRec.team_id].playoff_losses !== teamRec.playoff_losses)  
          updateList.push(Promise.resolve(methods.updateOneStandingRow(knex, teamRec.team_id,'playoff_losses', teamRec.playoff_losses, true )))
        if(oldStandings[teamRec.team_id].playoff_status !== teamRec.playoff_status)  
          updateList.push(Promise.resolve(methods.updateOneStandingRow(knex, teamRec.team_id,'playoff_status', teamRec.playoff_status, true )))
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
    })
}

methods.updateStandings = (knex,newStandings, playoffs = false) =>
{
  return knex
    .withSchema('sports')
    .table('standings')
    .then(results => {
      let oldStandings = {}
      var updateList =[]
      results.map(result => oldStandings[result.team_id] =result)

      newStandings.map(teamRec =>
      {
        if(oldStandings[teamRec.team_id].wins !== teamRec.wins)  
          updateList.push(Promise.resolve(methods.updateOneStandingRow(knex, teamRec.team_id,'wins', teamRec.wins )))
        if(oldStandings[teamRec.team_id].losses !== teamRec.losses)  
          updateList.push(Promise.resolve(methods.updateOneStandingRow(knex, teamRec.team_id,'losses', teamRec.losses )))
        if(oldStandings[teamRec.team_id].ties !== teamRec.ties)  
          updateList.push(Promise.resolve(methods.updateOneStandingRow(knex, teamRec.team_id,'ties', teamRec.ties )))
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
    })
}

methods.updateOneStandingRow = (knex, team_id, column, value, playoffs=false) =>
{
  let table = playoffs ? 'playoff_standings' : 'standings'
  return knex
    .withSchema('sports')
    .table(table)
    .where('team_id',team_id)
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

  

exports.data = methods
