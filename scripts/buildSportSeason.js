const knex = require('../server/db/connection')
const db_helpers = require('./helpers').data

//this function is used to build new sport seasons when they come up.
//should be used to build the sport seasons that we will be adding into the database
//season id, year, dates need to be updated

const sport_ids = [101, 102, 103, 104, 105, 106, 107]
let season_id = 43
let year = 2020
let data = []
sport_ids.forEach(sport_id => {
    let new_year = sport_id === 102 || sport_id===105 ? year - 1: year
    let to_add = []
    for(let i=1; i<4; i++){
        let api_pull = sport_id===107 ? 274 : i === 1 ? new_year : i===2 ? String(new_year).concat('PRE') : String(new_year).concat('POST')
        data.push({
            sport_season_id: season_id, 
            sport_id: sport_id,
            year: new_year,
            season_type: i,
            start_pull_date: '2019-01-01',
            end_pull_date: '2019-10-01',
            start_season_date: "2019-08-01",
            end_season_date: "2020-05-13",
            api_pull_parameter: api_pull
        })
        season_id++
    }
    
})
console.log(data)

// db_helpers.insertIntoTable(knex, 'sports', 'sport_season',data)
// .then(()=>{
//     process.exit()
// })

