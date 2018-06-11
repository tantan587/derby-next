
const db_helpers = require('../helpers').data
const knex = require('../../server/db/connection')

let teamInfo = []
let standings = []
db_helpers.getFantasyData(knex, 'NHL', 'https://api.fantasydata.net/v3/nhl/scores/JSON/teams?', 'Key', 'Conference')
  .then(result =>{ 
    result.map(team => 
    {
      teamInfo.push({sport_id: team.sport_id, team_id: team.team_id, key: team.Key, city: team.City, 
        name: team.Name, conference_id: team.conference_id, division:team.division,
        logo_url:team.WikipediaLogoUrl, global_team_id:team.GlobalTeamID})

      standings.push({team_id: team.team_id, wins : 0, losses: 0, ties: 0})    
    })
    teamInfo.forEach(team => {
      return knex
      .withSchema('sports')
      .table('team_info')
      .where('team_id', teamInfo.team_id)
      .update('division', teamInfo.division)
      .then(()=>{})
      })
        process.exit()
      })

    
      /* db_helpers.insertIntoTable(knex, 'sports', 'team_info', teamInfo)
      .then(() =>
      {
        db_helpers.insertIntoTable(knex, 'sports', 'standings', standings)
          .then(() =>
          {
            process.exit()
          })
      })
  }) */
