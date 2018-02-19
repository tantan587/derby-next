var methods = {}
const rp = require('request-promise')


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

methods.getTeamAndGlobalId =  function(knex, sportId)
{
  return knex
    .withSchema('sports')
    .table('team_info')
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

methods.getFantasyData = (knex, sportName, url, teamKeyField, confField, eplAreaIdInd = false) => 
{
  return knex
    .withSchema('sports')
    .table('leagues')
    .where('sport_name', sportName)
    .then((league)=> {
      const sportId = league[0].sport_id
      return methods.getTeamId(knex, sportId)
        .then(teamIds => {
          let teamIdMap = {}
          teamIds.map(r => teamIdMap[r.fantasydata_id]= r.team_id)
          const options = {
            url: url,
            headers: {
              'User-Agent': 'request',
              'Ocp-Apim-Subscription-Key':league[0].fantasy_data_key
            },
            json: true
          }
          return knex
            .withSchema('sports')
            .table('conferences')
            .leftOuterJoin('conferences_link', 'conferences.conference_id', 'conferences_link.conference_id')
            .where('sport_id',sportId)
            .select('conferences.conference_id', 'conferences.name', 'display_name', 'fantasy_data_key')
            .then((confs) => {
              const filterConferencesInd = (confs[0].fantasy_data_key !== null)
              let confMap = {}
              filterConferencesInd
                ? confs.map(conf => confMap[conf.fantasy_data_key] = conf.conference_id)
                : confs.map(conf => confMap[conf.name] = conf.conference_id)
              return rp(options)
                .then((fdata) => {
                  let teams = []
                  filterConferencesInd 
                    ?  fdata.filter(fd => fd.ConferenceID in confMap)
                      .map(conf => 
                        conf.Teams.map(team => 
                          teams.push({...team, 
                            sport_id:sportId,
                            conference_id:confMap[conf[confField]], 
                            team_id:teamIdMap[team[teamKeyField]]})))
                    : eplAreaIdInd 
                      ? fdata.filter(fd => fd.AreaId === 68 || fd.TeamId === 523)
                        .map(team =>
                        {
                          if(teamIdMap[team[teamKeyField]])
                          {
                            teams.push({...team, 
                              sport_id:sportId,
                              conference_id: confMap[sportName], 
                              team_id:teamIdMap[team[teamKeyField]]})
                          }
                        })
                      : fdata
                        .map(team =>
                          teams.push({...team, 
                            sport_id:sportId,
                            conference_id: sportName === 'EPL' ? confMap[sportName] : confMap[team[confField]], 
                            team_id:teamIdMap[team[teamKeyField]]}))

                  return teams
                })
            })
        }) 
    })
}

methods.updateStandings = (knex,newStandings) =>
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

methods.updateSchedule = (knex,newResults) =>
{
  return knex
    .withSchema('sports')
    .table('results')
    .then(results => {
      let oldResults = {}
      var updateList =[]
      results.map(result => oldResults[result.global_game_id] =result.updated_time)
      newResults.map(x =>
      {
        if(!(x.global_game_id in oldResults))
        {
          updateList.push(Promise.resolve(methods.insertOneResultRow(knex, x)))
        }
        else if(oldResults[x.global_game_id] !== x.updated_time)
        { 
          console.log(x.global_game_id) 
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

methods.updateOneStandingRow = (knex, team_id, column, value) =>
{
  return knex
    .withSchema('sports')
    .table('standings')
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
    .table('results')
    .insert(row)
}

methods.updateOneResultRow = (knex, global_game_id, row) =>
{

  return knex.transaction(function (t) {
    return knex.withSchema('sports').table('results')
      .transacting(t)
      .where('global_game_id',global_game_id)
      .del()
      .then(() =>
      {
        return knex
          .transacting(t)
          .withSchema('sports')
          .table('results')
          .insert(row)
      })
      .then(()=>{t.commit})
      .catch(t.rollback)
  })
}

  

exports.data = methods
