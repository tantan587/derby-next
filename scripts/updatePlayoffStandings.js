
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
    //this is only until they fix it so that the NBA data is correct
    standings_info.filter(team => team.Wins <17)
    let newStandings = standings_info.map(team=>{
      return {team_id: team.team_id, playoff_wins: team.Wins, playoff_losses: team.Losses, byes: 0, playoff_status: 'in_playoffs'}
    })
    return newStandings
}

createStandingsPO()