const db_helpers = require('../helpers').data
const knex = require('../../server/db/connection')

// db_helpers.getFdata (knex, 'MLB','MLBv3ScoresClient', 'getStadiumsPromise')
// /*   .then((FantasyDataClient) => {
//     FantasyDataClient.MLBv3ScoresClient.getStadiumsPromise() */
//     .then((resp)=> {
//       let cleanStadiums = JSON.parse(resp)
//       console.log(cleanStadiums[48])
//       console.log(cleanStadiums[47])

//       stadiumInfo = cleanStadiums.map(stadium =>
//         {
//           return {stadium_id: stadium.StadiumID, name: stadium.Name, city: stadium.City, state: stadium.State}
//       }
//       )
//       db_helpers.insertIntoTable(knex, 'sports', 'stadium', stadiumInfo)
//       .then(()=>{
//         process.exit()
//       })
//     })

const t = {
    tim: 7,
    jon: 2
}

if(!('kim' in t)){
    console.log('yes!')
}else{
    console.log('no')
}

