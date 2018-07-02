const db_helpers = require('../helpers').data
const knex = require('../../server/db/connection')


let teamInfo = []
let standings = []
let playoff_standings = []

const createCFB = async () => {
  let teams_and_info = await db_helpers.createSport(knex, 105, 'CFB', 'CFBv3ScoresClient', 'getConferenceHierarchyPromise')
  let teamIdMap = teams_and_info[1]
  let cfb_teams = teams_and_info[0]
  let confMap = teams_and_info[2]
  cfb_teams.forEach(conference => {
    let conf_id = confMap[conference.ConferenceID]
    conference.Teams.forEach(team=>{
      let team_id = teamIdMap[team.GlobalTeamID]

      teamInfo.push({sport_id: 105, team_id: team_id, key: team.Key, city: team.School, 
        name: team.Name, conference_id: conf_id, 
        logo_url:team.TeamLogoUrl,  global_team_id:team.GlobalTeamID, division: team.Conference})

      standings.push({team_id: team_id, wins : 0, losses: 0, ties: 0})
      
      playoff_standings.push({team_id: team_id, playoff_wins : 0, playoff_losses: 0, byes: 0, bowl_wins: 0, playoff_status: 'tbd'})
      
    })
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
}

createCFB()

/* db_helpers.getFantasyData(knex, 'CFB', 'https://api.fantasydata.net/v3/cfb/scores/JSON/LeagueHierarchy?', 'Key', 'ConferenceID')
  .then(result =>{ 
    result.map(team => 
    {
      teamInfo.push({sport_id: team.sport_id, team_id: team.team_id, key: team.Key, city: team.School, 
        name: team.Name, conference_id: team.conference_id, 
        logo_url:team.TeamLogoUrl, global_team_id:team.GlobalTeamID})

      standings.push({team_id: team.team_id, wins : 0, losses: 0, ties: 0})    

      playoff_standings.push({team_id: team.team_id, playoff_wins : 0, playoff_losses: 0, byes: 0, bowl_wins: 0, playoff_status: 'tbd'})
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
  }) */