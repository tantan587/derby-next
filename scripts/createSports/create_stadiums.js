const db_helpers = require('../helpers').data
const knex = require('../../server/db/connection')


let stadiumInfo = []
let standings = []

console.log('run')

const createAllStadiums = async () => {

  let MLB_stadiums = await getStadiumInfo(knex, 'MLB', 'MLBv3ScoresClient', 'getStadiumsPromise')
  console.log(MLB_stadiums)
  let NBA_stadiums = await getStadiumInfo(knex, 'NBA', 'NBAv3ScoresClient', 'getStadiumsPromise')
  let NHL_stadiums = await getStadiumInfo(knex, 'NHL', 'NHLv3ScoresClient', 'getStadiumsPromise')
  let NFL_stadiums = await getStadiumInfo(knex, 'NFL', 'NFLv3ScoresClient', 'getStadiumsPromise')
  let CFB_stadiums = await getStadiumInfo(knex, 'CFB', 'CFBv3ScoresClient', 'getStadiumsPromise')

  // let data = MLB_stadiums.concat(NBA_stadiums).concat(NHL_stadiums).concat(NFL_stadiums).concat(CFB_stadiums)
  // db_helpers.insertIntoTable(knex, 'sports', 'stadiums', data)
  // .then(()=>{
  //   console.log('done! - Matt is the best')
  //   process.exit()
  process.exit()

}

const getStadiumInfo = async (knex, sportName, api, promiseToGet) => {
  db_helpers.getFdata (knex, sportName, api, promiseToGet)
/*   .then((FantasyDataClient) => {
    FantasyDataClient.MLBv3ScoresClient.getStadiumsPromise() */
    .then((resp)=> {
      let cleanStadiums = JSON.parse(resp)

      stadiumInfo = cleanStadiums.map(stadium =>
        {
          return {stadium_id: stadium.StadiumID, name: stadium.Name, city: stadium.City, state: stadium.State}
      }
      )
      console.log(stadiumInfo[0])
      return stadiumInfo[0]
    })
  .catch((err) => {console.log(err)})
}

createAllStadiums()
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
  
  
//   .catch((err) => {console.log(err)})

  // db_helpers.insertIntoTable(knex, 'sports', 'stadium', stadiumInfo)
  //       .then(() =>
  //       {
  //         process.exit()
  //       })
  // .catch((err) => {
  //     // handle errors
  // });

