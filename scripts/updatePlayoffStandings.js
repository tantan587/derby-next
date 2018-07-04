
const db_helpers = require('./helpers').data
const fantasyHelpers = require('../server/routes/helpers/fantasyHelpers')
const knex = require('../server/db/connection')

//this still needs to deal with college bball, football, and epl. Putting those on hold for now.

async function createStandingsPO () {
    
    let MLB_standPO = await getStandingsInfo(knex, 'MLB','MLBv3ScoresClient','getStandingsPromise', '2017POST')
    let NBA_standPO = await getStandingsInfo(knex, 'NBA','NBAv3ScoresClient','getStandingsPromise', '2018POST')
    let NHL_standPO = await getStandingsInfo(knex, 'NHL','NHLv3ScoresClient','getStandingsPromise', '2018POST')
    let NFL_standPO = await getStandingsInfo(knex, 'NFL','NFLv3StatsClient','getStandingsPromise', '2017POST')
    //let CFB_standPO = await getStandInfo(knex, 'CFB','CFBv3ScoresClient','getStandingsPromise', '2017POST')
    //let CBB_standPO = await getStandInfo(knex, 'CBB','CBBv3ScoresClient','getTournamentHierarchyPromise', '2018POST')
    //let EPL_standPO = await getStandInfo(knex, 'EPL','EPLv3ScoresClient','getStandingsPromise', '144')
    
    let data = MLB_standPO.concat(NBA_standPO).concat(NHL_standPO).concat(NFL_standPO)//.concat(CBB_standPO).concat(CFB_standPO)//.concat(EPL_standPO)
    db_helpers.updatePlayoffStandings(knex, data)
        .then(()=>{

          console.log('done')
          process.exit()
})}

const getStandingsInfo = async (knex, sportName, api, promiseToGet, year) => {
    let standings_info = await db_helpers.createStandingsData(knex, sportName, api, promiseToGet, year)
    let newStandings = standings_info.map(team=>{
      return {team_id: team.team_id, playoff_wins: team.Wins, playoff_losses: team.Losses, byes: 0, playoff_status: 'in_playoffs'}
    })
    return newStandings

  //   let standData = await db_helpers.getFdata (knex, sportName, api, promiseToGet, year)
  //   let sport_id = await db_helpers.getSportId(knex, sportName)
  //   let teamIds = await db_helpers.getTeamAndGlobalId(knex, sport_id)
  //   let cleanStand = JSON.parse(standData)
  //   let teamIdMap = {}
  //   const idSpelling = sportName === 'EPL' ? 'Id' : 'ID'
  //   teamIds.forEach(team => teamIdMap[team.global_team_id] = team.team_id)
  //   cleanStand.filter(team=> team.Wins<17)
  //   let standInfo = cleanStand.map(team =>
  //   {
  //     let f_team_id = sportName !== 'NFL' ? Number(team.TeamID)<10 ? "0"+String(team.TeamID) : team.TeamID : team.TeamID
  //     let global_team_id = fantasy_2_global[sport_id]+f_team_id
  //     return {team_id: teamIdMap[global_team_id], playoff_wins: team.Wins, 
  //       playoff_losses : team.Losses, byes: 0, playoff_status: 'in_playoffs' 
  //       }
  // }
  // )
  //this needs to log if teams have a bye:
  //there is a couple of ways to do this. Either it can check if a team "clinched"
  //it could also be done in the update Standings: will look for that there
  // let sport_ids_with_byes = ['102', '103', '106']
  // if(sport_ids_with_byes.includes(sport_id)){
  //   let y = 0
    
  // }
  //console.log('here')
  //console.log(stadiumInfo[0])
  //return standInfo
}

const fantasy_2_global = {
  'NBA': '200000',
  'NFL': '',
  'MLB': '100000',
  'NHL': '300000',
  'CBB': '500000',
  'CFB': '600000',
  'EPL': '900000'
}
createStandingsPO()