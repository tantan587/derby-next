const db_helpers = require('../helpers').data
const knex = require('../../server/db/connection')


let teamInfo = []
let standings = []
db_helpers.getFantasyData(knex, 'EPL', 'https://api.fantasydata.net/v3/soccer/scores/json/Standings/144?', 'ShortName')
  .then(result =>{ 
    result.filter(team => team.Scope === 'Total').map(team => 
    {
      teamInfo.push({sport_id: team.sport_id, team_id: team.team_id, key: team.ShortName, city: '', 
        name: team.Name, conference_id: team.conference_id})

      standings.push({team_id: team.team_id, wins : team.Wins, losses: team.Losses, ties: team.Draws})    
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

  
