require('dotenv').config()
var rp = require('request-promise')
var db_helpers = require('../server/db/helpers').data
const knex = require('../server/db/connection')

var options = {
  url: 'https://api.fantasydata.net/v3/nba/scores/JSON/Standings/2018?',
  headers: {
    'User-Agent': 'request',
    'Ocp-Apim-Subscription-Key':'76f8aeb6059440e99dd1ecfcc662ddde'
  },
  json: true
}

db_helpers.getTeamId(knex, 101)
  .then((result) =>
  {
    let fdataIdToTeamId = {}
    result.map(r => fdataIdToTeamId[r.fantasydata_id]= r.team_id)
    rp(options)
      .then(function (fdata) {
        var teamInfo = []
        var standings = []
        fdata.map(team => 
        {
          var teamId = fdataIdToTeamId[team.Key]
  
          teamInfo.push({team_id: teamId, key: team.Key, city: team.City, 
            name: team.Name, conference: team.Conference, division: team.Division})
  
          standings.push({team_id: teamId, wins : team.Wins, losses: team.Losses,
            conference_wins: team.ConferenceWins, conference_losses : team.ConferenceLosses})    
        })
        db_helpers.insertIntoTable(knex, 'sports', 'nba_info', teamInfo)
          .then(() =>
          {
            db_helpers.insertIntoTable(knex, 'sports', 'nba_standings', standings)
              .then(() =>
              {
                process.exit()
              })
          })
      })
  })

// rp(options)
//   .then(function (data) {
//     var teamInfo = []
//     var standings = []
//     const cb = sportId => {
//       data.map(team => 
//       {
//         var teamId = db_helpers.createTeamId(sportId, team.TeamID)

//         teamInfo.push({team_id: teamId, key: team.Key, city: team.City, 
//           name: team.Name, conference: team.Conference, division: team.Division})

//         standings.push({team_id: teamId, wins : team.Wins, losses: team.Losses,
//           conference_wins: team.ConferenceWins, conference_losses : team.ConferenceLosses})    
//       })

//       db_helpers.insertIntoTable(knex, 'nba_info', teamInfo, false);
//       db_helpers.insertIntoTable(knex, 'nba_standings', standings, true);

//     }

//     db_helpers.getSportId(knex,'NBA', cb)

//   })
//   .catch(function (err) {
//     console.error(err)
//   })
  
