const db_helpers = require('../helpers').data
const knex = require('../../server/db/connection')


let teamInfo = []
let standings = []
let playoff_standings = []

const getSport = async () => {
  let teams = await db_helpers.getFdata(knex, 'CBB', 'CBBv3StatsClient','getLeagueHierarchyPromise')
  let teamIds = await db_helpers.getTeamAndGlobalId(knex, '106') 
  let teamIdMap = {}
  teamIds.forEach(team=> teamIdMap[team.global_team_id] = team.team_id)
  const conferences = await knex
    .withSchema('sports')
    .table('conferences')
    .leftOuterJoin('conferences_link', 'conferences.conference_id', 'conferences_link.conference_id')
    .where('sport_id',106)
    .select('conferences.conference_id', 'conferences.name', 'display_name', 'fantasy_data_key')
  
  let confMap = {}
  conferences.forEach(conf => {

      confMap[conf.fantasy_data_key] = conf.conference_id
    })


  let cleanTeams = JSON.parse(teams)

  cleanTeams.forEach(conference => {
    let conf_id = confMap[conference.ConferenceID]
    conference.Teams.forEach(team => {
      let team_id = teamIdMap[team.GlobalTeamID]

      teamInfo.push({sport_id: 106, team_id: team_id, key: team.Key, city: team.School, 
        name: team.Name, conference_id: conf_id, 
        logo_url:team.TeamLogoUrl,  global_team_id:team.GlobalTeamID})

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
          .then(()=> 
            process.exit()
        )
      })
    })
}

getSport()

  
/* 
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
  }) */


  
