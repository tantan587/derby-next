const db_helpers = require('../helpers').data
const knex = require('../../server/db/connection')

const conferences_already =['10601','10602','10603','10604','10605','10606','10607']
let teamInfo = []
let standings = []
let nothing = []
db_helpers.getFantasyData(knex, 'CBB', 'https://api.fantasydata.net/v3/cbb/scores/JSON/LeagueHierarchy?', 'Key', 'ConferenceID')
  .then(result =>{ 
    result.forEach(team => 
    { console.log(team.conference_id)
      conferences_already.includes(team.conference_id) ? nothing.push(team.team_id) : (
      console.log('test'),
      teamInfo.push({sport_id: team.sport_id, team_id: team.team_id, key: team.Key, city: team.School, 
        name: team.Name, conference_id: team.conference_id, 
        logo_url:team.TeamLogoUrl,  global_team_id:team.GlobalTeamID}),

      standings.push({team_id: team.team_id, wins : 0, losses: 0, ties: 0})   
    ) 
    })
    console.log(nothing.length)
    console.log(teamInfo)
    db_helpers.insertIntoTable(knex, 'sports', 'team_info', teamInfo)
      .then(() =>
      {
        db_helpers.insertIntoTable(knex, 'sports', 'standings', standings)
          .then(() =>
          {
            process.exit()
          })
      })
  })


  
