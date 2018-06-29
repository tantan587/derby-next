const db_helpers = require('../helpers').data
const knex = require('../../server/db/connection')


const createAllStadiums = async () => {

  let MLB_stadiums = await getStadiumInfo(knex, 'MLB', 'MLBv3ScoresClient', 'getStadiumsPromise')
  let NBA_stadiums = await getStadiumInfo(knex, 'NBA', 'NBAv3ScoresClient', 'getStadiumsPromise')
  let NHL_stadiums = await getStadiumInfo(knex, 'NHL', 'NHLv3ScoresClient', 'getStadiumsPromise')
  let NFL_stadiums = await getStadiumInfo(knex, 'NFL', 'NFLv3ScoresClient', 'getStadiumsPromise')
  let CFB_stadiums = await getStadiumInfo(knex, 'CFB', 'CFBv3ScoresClient', 'getStadiumsPromise')
  let EPL_stadiums = await getStadiumInfo(knex, 'EPL', 'Soccerv3ScoresClient','getVenuesPromise')

  let data = MLB_stadiums.concat(NBA_stadiums).concat(NHL_stadiums).concat(NFL_stadiums).concat(CFB_stadiums).concat(EPL_stadiums)
  db_helpers.insertIntoTable(knex, 'sports', 'stadium', data)
    .then(()=>{
      console.log('done')
      process.exit()

    })
}

const getStadiumInfo = async (knex, sportName, api, promiseToGet) => {

  let UK = ['England', 'Wales', 'Scotland', 'Northern Ireland']
  let stadiumData = await db_helpers.getFdata (knex, sportName, api, promiseToGet)
  let sportid = await db_helpers.getSportId(knex,sportName)

  let cleanStadiums = JSON.parse(stadiumData)
  let stadiums = sportid[0].sport_id === '107' ? cleanStadiums.filter(stadium => UK.includes(stadium.Country)) : cleanStadiums

  let s = sportid[0].sport_id
  let stadiumInfo = []
  stadiumInfo = stadiums.map(stadium =>
  {
    let i = s === '107' ? stadium.VenueId : stadium.StadiumID
    let state = s === '107' ? stadium.Country : stadium.State
    const StadiumID = s * 1000 + i + 100
    return {stadium_id: StadiumID, name: stadium.Name, city: stadium.City, state: state}
  })

  return stadiumInfo
}

createAllStadiums()


