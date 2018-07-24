
const db_helpers = require('./helpers').data
const fantasyHelpers = require('../server/routes/helpers/fantasyHelpers')
const knex = require('../server/db/connection')
const sport_keys = require('./sportKeys')

//this still needs to deal with college bball, football, and epl. Putting those on hold for now.

async function createStandingsPO () {
    let data = []
    let season_calls = db_helpers.getSeasonCall(knex)
    let post_season_calls = season_calls.filter(season => [101, 102, 103, 104].includes(season.sport_id))
    new_season_calls.forEach(season => {
      let sport_id = season.sport_id
      let sport = sport_keys[sport_id]
      data.push(await getSchedInfo(knex, sport.sport_name, sport.api, sport.schedulePromiseToGet, season.api_pull_parameter.concat('POST')))
    })

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
    let year_for_insert = year.split('POST')
    let newStandings = standings_info.map(team=>{
        let status = 3
        if(sportName==='NBA'||sportName==='NHL'){
            status = team.Wins===16 ? 6 : team.Wins>11 ? 5 : team.Losses%4 === 0 && team.Wins<team.Losses ? 4 : 3
        }

        return {team_id: team.team_id, playoff_wins: team.Wins, playoff_losses: team.Losses, byes: 0, playoff_status: status, year: year_for_insert}
    })
    return newStandings
}



createStandingsPO()