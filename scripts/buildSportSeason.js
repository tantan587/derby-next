const knex = require('../server/db/connection')
const db_helpers = require('./helpers').data

const sport_ids = [101, 102, 103, 104, 105, 106, 107]
let season_id = 1
let year = 2018
let data = []
sport_ids.forEach(sport_id => {
    let new_year = sport_id === 102 || sport_id===105 ? year - 1: year
    let to_add = []
    for(let i=1; i<4; i++){
        let api_pull = sport_id===107 ? 144 : i === 1 ? new_year : i===2 ? String(new_year).concat('PRE') : String(new_year).concat('POST')
        data.push({
            sport_season_id: season_id, 
            sport_id: sport_id,
            year: new_year,
            season_type: i,
            start_pull_date: '2018-01-01',
            end_pull_date: '2018-10-01',
            api_pull_parameter: api_pull
        })
        season_id++
    }
    
})

db_helpers.insertIntoTable(knex, 'sports', 'sport_season',data)
.then(()=>{
    process.exit()
})

