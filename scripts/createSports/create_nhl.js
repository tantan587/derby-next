
const db_helpers = require('../helpers').data
const knex = require('../../server/db/connection')

let teamInfo = []
let standings = []
db_helpers.getFantasyData(knex, 'NHL', 'https://api.fantasydata.net/v3/nhl/scores/JSON/Standings/2018?', 'Key', 'Conference')
  .then(result =>{ 
    result.map(team => 
    {
      teamInfo.push({sport_id: team.sport_id, team_id: team.team_id, key: team.Key, city: team.City, 
        name: team.Name, conference_id: team.conference_id, division: team.Division})

      standings.push({team_id: team.team_id, wins : team.Wins, losses: team.Losses, ties: team.Ties})    
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
  
  
    
  
  
