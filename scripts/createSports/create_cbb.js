const db_helpers = require('../helpers').data
const knex = require('../../server/db/connection')


let teamInfo = []
let standings = []
let playoff_standings = []
db_helpers.getFantasyData(knex, 'CBB', 'https://api.fantasydata.net/v3/cbb/scores/JSON/LeagueHierarchy?', 'Key', 'ConferenceID')
  .then(result =>{ 
    result.forEach(team => 
    {
      teamInfo.push({sport_id: team.sport_id, team_id: team.team_id, key: team.Key, city: team.School, 
        name: team.Name, conference_id: team.conference_id, 
        logo_url:team.TeamLogoUrl,  global_team_id:team.GlobalTeamID})

      standings.push({team_id: team.team_id, wins : 0, losses: 0, ties: 0})
      
      playoff_standings.push({team_id: team.team_id, wins : 0, losses: 0, byes: 0, bowl_wins: 0, playoff_status: 'tbd'})
    })
    db_helpers.insertIntoTable(knex, 'sports', 'team_info', teamInfo)
      .then(() =>
      {
        db_helpers.insertIntoTable(knex, 'sports', 'standings', standings)
          .then(() =>
          {
            db_helpers.insertIntoTable(knex, 'sports', 'playoff_standings', playoff_standings)
            .then(()=> 
              process.exit()
          )
          })
      })
  })


  
