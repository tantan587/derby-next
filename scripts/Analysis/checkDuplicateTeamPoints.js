const knex = require('../../server/db/connection')
const helpers = require('../helpers.js').data


const m = async () => {
    let team_points = await knex('fantasy.team_points')
    let team_ids = []
    let team_data = []
    team_points.forEach(team => {
        if(team_ids.includes(team.team_id)===false){
            team_ids.push(team.team_id)
            team_data.push(team)
        }
    })
    console.log(team_data)
    let r = await knex('fantasy.team_points').truncate()
    helpers.insertIntoTable(knex, 'fantasy','team_points',team_data)
    .then(()=>{
        console.log('done')
        process.exit()
    })


}


m()