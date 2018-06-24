const db_helpers = require('./helpers').data
const fantasyHelpers = require('../server/routes/helpers/fantasyHelpers')
const knex = require('../server/db/connection')

async function createStandingsPO () {
    
    let MLB_standPO = await getStandInfo(knex, 'MLB','MLBv3ScoresClient','getStandingsPromise', '2017POST')
    let NBA_standPO = await getStandInfo(knex, 'MLB','NBAv3ScoresClient','getStandingsPromise', '2017POST')
    let NHL_standPO = await getStandInfo(knex, 'MLB','NHLv3ScoresClient','getStandingsPromise', '2017POST')
    let NFL_standPO = await getStandInfo(knex, 'MLB','NFLv3ScoresClient','getStandingsPromise', '2017POST')
    let CFB_standPO = await getStandInfo(knex, 'MLB','CFBv3ScoresClient','getStandingsPromise', '2017POST')
    let CBB_standPO = await getStandInfo(knex, 'MLB','CBBv3ScoresClient','getStandingsPromise', '2017POST')
    let EPL_standPO = await getStandInfo(knex, 'MLB','EPLv3ScoresClient','getStandingsPromise', '2017POST')

    process.exit()
    
    let data = MLB_standPO.concat(NBA_standPO).concat(NHL_standPO).concat(NFL_standPO).concat(CFB_standPO).concat(CBB_standPO).concat(EPL_standPO)
  db_helpers.insertIntoTable(knex, 'sports', 'standingsPO', data)
    .then(()=>{
      // sport id+ 100+ stadium id
  //   console.log('done! - Matt is the best')
  //   process.exit()
      console.log('done')
      process.exit()
})}

const getStandInfo = async (knex, sportName, api, promiseToGet, year) => {
  let standData = await db_helpers.getFdata (knex, sportName, api, promiseToGet, year)
  let sportid = await db_helpers.getSportId(knex,sportName)
  
  let cleanStand = JSON.parse(standData)

  standInfo = cleanStand.map(game =>
    {
      return {wins: game.Wins, 
        losses : game.Losses, 
        }
  }
  )
  //console.log('here')
  //console.log(stadiumInfo[0])
  return standInfo
}

createStandingsPO()