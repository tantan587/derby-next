//const db_helpers = require('../helpers').data
const knex = require('../../server/db/connection')
const createSport = require('./create_sport_helpers')

createSport.createProfessionalSport(knex, '101', 'NBA', 'NBAv3StatsClient', 'getTeamsActivePromise')

//old way below
/* 
let teamInfo = []
let standings = []
db_helpers.getFantasyData(knex, 'NBA', 'https://api.fantasydata.net/v3/nba/scores/JSON/teams', 'Key', 'Conference')
  .then(result =>{ 
    result.map(team => 
    {
      teamInfo.push({sport_id: team.sport_id, team_id: team.team_id, key: team.Key, city: team.City, 
        name: team.Name, conference_id: team.conference_id, division: team.Division, 
        logo_url:team.WikipediaLogoUrl, global_team_id:team.GlobalTeamID})

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
            .then(()=> {
            process.exit()
            })
          })
      })
  })
  
  
    
  
  
 */

  
