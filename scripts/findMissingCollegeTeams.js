let math = require('mathjs')
const knex = require('../server/db/connection')
const db_helpers = require('./helpers').data

const m = async () =>{
    let cbb_teamIDMap = await db_helpers.getTeamIdMap(knex,'106')
    let cfb_teamIDMap = await db_helpers.getTeamIdMap(knex, '105')

    let cbb_highest = math.max(Object.keys(cbb_teamIDMap).map(key => cbb_teamIDMap[key]))
    let cfb_highest = math.max(Object.keys(cfb_teamIDMap).map(key => cfb_teamIDMap[key]))

    let data_1 = await db_helpers.getFdata(knex, 'CBB', 'CBBv3StatsClient', 'getTeamsPromise')
    let data_2 = await db_helpers.getFdata(knex, 'CFB', 'CFBv3StatsClient', 'getTeamsPromise')
    let cbb_teams = JSON.parse(data_1)
    let cfb_teams = JSON.parse(data_2)

    let new_team_ids = []
    cbb_teams.forEach(team =>{
        if(!(team.GlobalTeamID in cbb_teamIDMap)){
            cbb_highest++
            new_team_ids.push({ "team_id":  cbb_highest, "global_team_id": team.GlobalTeamID, "sport_id": 106 })
        }
    })
    cfb_teams.forEach(team =>{
        if(!(team.GlobalTeamID in cfb_teamIDMap)){
            cfb_highest++
            new_team_ids.push({ "team_id":  cfb_highest, "global_team_id": team.GlobalTeamID, "sport_id": 105 })
        }
    })

    console.log(new_team_ids)

    process.exit

}

m()
.then(()=>{
    process.exit()
})

