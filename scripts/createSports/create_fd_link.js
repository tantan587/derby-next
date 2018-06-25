// const db_helpers = require('../helpers').data
// const knex = require('../../server/db/connection')

// let teamIdInfo = []  
// const fdClientModule = require('fantasydata-node-client');
// const keys = {
//     'MLBv3StatsClient':'1637630d4fc540c092e8e06c1a75426c',
//     'MLBv3ProjectionsClient':'3636239484c74d5d85f064852524b41f'
// };
// const FantasyDataClient = new fdClientModule(keys);
    
// FantasyDataClient.MLBv3StatsClient.getStandingsPromise('2018')
//     .then((resp) => {
//         resp.map(team =>
//           {
//             teamIdInfo.push({team_id: team.team_id, global_team_id:team.GlobalTeamID})
//           }

//         )
//     })
//     .catch((err) => {
//         console.log(err)
//     });

const knex = require('../../server/db/connection')

const test = () => {
    return knex
        .table('fdl')
        .select('*')
        .then((info)=>{
            let json_mapped = []
            json_mapped = info.map(i => i)
            return json_mapped
        })
}

test()
    .then(m=>{
        myJSON = JSON.stringify(m)
        console.log(myJSON)
        process.exit()
    })