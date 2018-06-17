const db_helpers = require('../helpers').data
const knex = require('../../server/db/connection')


let stadiumInfo = []
let standings = []

//console.log('run')

const createAllStadiums = async () => {

  let MLB_stadiums = await getStadiumInfo(knex, 'MLB', 'MLBv3ScoresClient', 'getStadiumsPromise')
  //console.log(MLB_stadiums.length)
  let NBA_stadiums = await getStadiumInfo(knex, 'NBA', 'NBAv3ScoresClient', 'getStadiumsPromise')
  //console.log(NBA_stadiums)
  let NHL_stadiums = await getStadiumInfo(knex, 'NHL', 'NHLv3ScoresClient', 'getStadiumsPromise')
  let NFL_stadiums = await getStadiumInfo(knex, 'NFL', 'NFLv3ScoresClient', 'getStadiumsPromise')
  let CFB_stadiums = await getStadiumInfo(knex, 'CFB', 'CFBv3ScoresClient', 'getStadiumsPromise')

  let data = MLB_stadiums.concat(NBA_stadiums).concat(NHL_stadiums).concat(NFL_stadiums).concat(CFB_stadiums)
  db_helpers.insertIntoTable(knex, 'sports', 'stadium', data)
    .then(()=>{
      // sport id+ 100+ stadium id
  //   console.log('done! - Matt is the best')
  //   process.exit()
      //console.log('done')
      process.exit()

})
}

const getStadiumInfo = async (knex, sportName, api, promiseToGet) => {
  // let resp = await db_helpers.getFdata (knex, sportName, api, promiseToGet)
  // let stadiumData = resp[0]
  // console.log(stadiumData)
  // let sport_id = resp[1]
  // console.log(sport_id)
  let stadiumData = await db_helpers.getFdata (knex, sportName, api, promiseToGet)
  let sportid = await db_helpers.getSportId(knex,sportName)
/*   .then((FantasyDataClient) => {
    FantasyDataClient.MLBv3ScoresClient.getStadiumsPromise() */
  let cleanStadiums = JSON.parse(stadiumData)

  stadiumInfo = cleanStadiums.map(stadium =>
    {

      let s = sportid[0].sport_id
      let i = stadium.StadiumID
      const StadiumID = s * 1000 + i + 100
      return {stadium_id: StadiumID, name: stadium.Name, city: stadium.City, state: stadium.State}
  }
  )
  //console.log('here')
  //console.log(stadiumInfo[0])
  return stadiumInfo
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

