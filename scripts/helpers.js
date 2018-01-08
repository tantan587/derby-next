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

methods.getFantasyData = (knex, sportName, url, teamKeyField, confField) => 
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
  

exports.data = methods
