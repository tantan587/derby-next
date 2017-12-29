

const db_helpers = require('../helpers').data
const knex = require('../../server/db/connection')

let teamInfo = []
let standings = []
db_helpers.getFantasyData(knex, 'NFL', 'https://api.fantasydata.net/v3/nfl/scores/JSON/Standings/2017?', 'Team', 'Conference')
  .then(result =>{ 
    result.map(team => 
    {
      
      const res = team.Name.split(' ')
      const city = res.length === 3 ? res[0] + ' ' + res[1] : res[0]
      const name = res.length === 3 ? res[2] : res[1]
      
      teamInfo.push({sport_id: team.sport_id, team_id: team.team_id, key: team.Team, city: city, 
        name: name, conference_id: team.conference_id, division: team.Division})

      standings.push({team_id: team.team_id, wins : team.Wins, losses: team.Losses, ties: team.Ties})    
    })
        db_helpers.insertIntoTable(knex, 'sports', 'standings', standings)
          .then(() =>
          {
            process.exit()
          })
      })


  
