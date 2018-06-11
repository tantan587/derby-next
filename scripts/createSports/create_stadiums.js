const db_helpers = require('../helpers').data
const knex = require('../../server/db/connection')

let sportName = 'MLB'
const stadiumInfo = []
let standings = []
// const league = () => {
//   return knex
//     .withSchema('sports')
//     .table('leagues')
//     .where('sport_name', sportName)
//     .select('fantasy_data_key')
//     .then((t)=> {
//       return t.fantasy_data_key
//     })
// }

// f_key = league()
// console.log(f_key)


const fdClientModule = require('fantasydata-node-client');
const keys = {
    'MLBv3ScoresClient': '-'
};
const FantasyDataClient = new fdClientModule(keys);
console.log('run')
FantasyDataClient.MLBv3ScoresClient.getStadiumsPromise()
  .then((resp) => {
    console.log(typeof resp)
    let arr = Object.keys(resp)
    
    console.log(arr)
   // console.log('test', resp[0])
    resp.forEach(stadium =>
        {
          standiumInfo.push({stadium_id: stadium.StadiumID, name: stadium.Name, city: stadium.City, state: stadium.State})
        }

      )
  })
  db_helpers.insertIntoTable(knex, 'sports', 'stadium', stadiumInfo)
        .then(() =>
        {
          process.exit()
        })
  .catch((err) => {
      // handle errors
  });