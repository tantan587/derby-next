const db_helpers = require('../helpers').data
const knex = require('../../server/db/connection')


const stadiumInfo = []
let standings = []

console.log('run')
db_helpers.getStadiumdata (knex, 'MLB','MLBv3ScoresClient', 'getStadiumsPromise')
/*   .then((FantasyDataClient) => {
    FantasyDataClient.MLBv3ScoresClient.getStadiumsPromise() */
    .then((resp)=> {
      console.log(resp)
      process.exit()
    })
   // console.log('test', resp[0])
    // resp.forEach(stadium =>
    //     {
    //       standiumInfo.push({stadium_id: stadium.StadiumID, name: stadium.Name, city: stadium.City, state: stadium.State})
    //     }

    //   )
  
  .catch((err) => {console.log(err)})

  // db_helpers.insertIntoTable(knex, 'sports', 'stadium', stadiumInfo)
  //       .then(() =>
  //       {
  //         process.exit()
  //       })
  // .catch((err) => {
  //     // handle errors
  // });