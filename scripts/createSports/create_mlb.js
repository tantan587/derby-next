

const db_helpers = require('../helpers').data
const knex = require('../../server/db/connection')

let teamInfo = []
let standings = []
db_helpers.getFantasyData(knex, 'MLB', 'https://api.fantasydata.net/v3/mlb/scores/JSON/Standings/2017?', 'Key', 'League')
  .then(result =>{ 
    result.map(team => 
    {
      teamInfo.push({sport_id: team.sport_id, team_id: team.team_id, key: team.Key, city: team.City, 
        name: team.Name, conference_id: team.conference_id, division: team.Division})

      standings.push({team_id: team.team_id, wins : 0, losses: 0, ties: 0})    
    })
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