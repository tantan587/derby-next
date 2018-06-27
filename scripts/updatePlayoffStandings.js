const db_helpers = require('./helpers').data
const fantasyHelpers = require('../server/routes/helpers/fantasyHelpers')
const knex = require('../server/db/connection')

//

async function createStandingsPO () {
    
    let MLB_standPO = await getStandInfo(knex, 'MLB','MLBv3ScoresClient','getStandingsPromise', '2017POST')
    //let NBA_standPO = await getStandInfo(knex, 'NBA','NBAv3ScoresClient','getStandingsPromise', '2017POST')
    //let NHL_standPO = await getStandInfo(knex, 'NHL','NHLv3ScoresClient','getStandingsPromise', '2017POST')
    //let NFL_standPO = await getStandInfo(knex, 'NFL','NFLv3ScoresClient','getStandingsPromise', '2017POST')
    //let CFB_standPO = await getStandInfo(knex, 'CFB','CFBv3ScoresClient','getStandingsPromise', '2017POST')
    //let CBB_standPO = await getStandInfo(knex, 'CBB','CBBv3ScoresClient','getStandingsPromise', '2017POST')
    //let EPL_standPO = await getStandInfo(knex, 'EPL','EPLv3ScoresClient','getStandingsPromise', '144')
    
    let data = MLB_standPO//.concat(NBA_standPO).concat(NHL_standPO).concat(NFL_standPO).concat(CFB_standPO).concat(CBB_standPO)//.concat(EPL_standPO)
    db_helpers.insertIntoTable(knex, 'sports', 'playoff_standings', data)
        .then(()=>{
      // sport id+ 100+ stadium id
  //   console.log('done! - Matt is the best')
  //   process.exit()
        console.log('done')
        process.exit()
})}

const getStandInfo = async (knex, sportName, api, promiseToGet, year) => {
    let standData = await db_helpers.getFdata (knex, sportName, api, promiseToGet, year)
    let sport_id = await db_helpers.getSportId(knex,sportName)
    let teamIds = await db_helpers.getTeamAndGlobalId(knex, sport_id)
    let cleanStand = JSON.parse(standData)
    let teamIdMap = {}
    const idSpelling = sportName === 'EPL' ? 'Id' : 'ID'
    teamIds.forEach(team => teamIdMap[team.global_team_id] = team.team_id)
  standInfo = cleanStand.map(team =>
    {
      return {team_id: teamIdMap[team['GlobalGame' + idSpelling]], playoff_wins: team.Wins, 
        playoff_losses : team.Losses, byes: 0, playoff_status: 'in_playoffs' 
        }
  }
  )
  //this needs to log if teams have a bye:
  //there is a couple of ways to do this. Either it can check if a team "clinched"
  //it could also be done in the update Standings: will look for that there
  let sport_ids_with_byes = ['102', '103', '106']
  if(sport_ids_with_byes.includes(sport_id)){
    let y = 0
    
  }
  //console.log('here')
  //console.log(stadiumInfo[0])
  return standInfo
}

createStandingsPO()