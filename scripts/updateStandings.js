const db_helpers = require('./helpers').data
const fantasyHelpers = require('../server/routes/helpers/fantasyHelpers')
const knex = require('../server/db/connection')
const sport_keys = require('./sportKeys')
const asyncForEach = require('./asyncForEach')
//const getDayCount = require('./Analysis/dayCount.js')

const filtered_fantasy_standings_data = async () => {
  let data = []
  let season_calls = await db_helpers.getSeasonCall(knex)
  let regular_season_calls = season_calls.filter(season => season.season_type === 1)
  await asyncForEach(regular_season_calls, async (season) => {
    let sport_id = season.sport_id
    let sport = sport_keys[sport_id]
    if(sport_id===105){
      data.push(...await getCFBstandings(knex, sport.sport_name, sport.api, sport.standingsPromiseToGet, season.api_pull_parameter, season.year, season.sport_season_id))
    }else if(sport_id===107){
      //do nothing
    }
    else{
      data.push(...await standingsBySport(knex, sport.sport_name, sport.api, sport.standingsPromiseToGet, season.api_pull_parameter, season.year, season.sport_season_id))
    }
  })

  return data
}
//note: college basketball has an extra, old functino below: waiting to be sure we don't need this again

//for CFB - this function also updates the post season standings.
async function updateStandings(exitProcess)
{
  let data = await filtered_fantasy_standings_data()


  let result =  await db_helpers.updateStandings(knex, data)
  console.log('Number of Standings Updated: ' + result)
  await fantasyHelpers.updateTeamPoints()
  await fantasyHelpers.updateLeaguePoints()
  console.log('im done')
  if(exitProcess)
    process.exit()

}



const standingsBySport = async (knex, sportName, api, promiseToGet, pull_parameter, year, sport_season_id) => {
  let standings_info = await db_helpers.createStandingsData(knex, sportName, api, promiseToGet, pull_parameter)
  let newStandings = standings_info.map(team=>{
    let ties = sportName === 'NHL' ? team.OvertimeLosses : 
      sportName === 'NFL' ? team.Ties : 
        sportName === 'EPL' ? team.Draws : 0

    return {team_id: team.team_id, wins: team.Wins, losses: team.Losses, ties: ties, year: year, sport_season_id: sport_season_id}
  })

  return newStandings
}

const getCFBstandings = async (knex, sportName, api, promiseToGet, pull_parameter, year, sport_season_id) =>{
  const standings = await standingsBySport(knex, sportName, api, promiseToGet, pull_parameter, year, sport_season_id)
  //check if current week is after the start of the post season, or is null. 
  //This could also be done with dates and season status table, as had been discussed
  //table hasn't yet been created

  //need to use this 
  let current_week = await db_helpers.getFdata(knex, sportName, api, 'getCurrentWeekPromise')
  if(current_week !== '' && current_week < 16){
    return standings
  }else{
    //pull, and then make readable, playoff games (including bowl games)
    let non_parse_games = await db_helpers.getFdata(knex, sportName, api, 'getGamesByWeekPromise', pull_parameter, 1)
    let playoff_games = JSON.parse(non_parse_games)
    let teamIdMap = await db_helpers.getTeamIdMap(knex, '105')

    let standings_by_team_id = {}
    standings.forEach(team => standings_by_team_id[team.team_id]={...team})
    //below are the stadiums where playoffs are played
    //in order: rose bowl, cotton bowl, sugar bowl, orange bowl, peach bowl, fiesta bowl
    //note these stadiums have multiple games played there, often, so will need to figure that out
    //3 year hosting cycle: rose/sugar, orange/cotton, fiesta/peach. 2017 was rose/sugar

    let playoff_stadium_ids =[114, 70, 148, 55, 163, 79]
    let finalist_stadium_ids_by_year = {
      2017: [114, 148],
      2018: [70, 55],
      2019: [163, 79]
    }
    let playoff_teams = []
    let bowl_wins = []
    let finalist_team_ids = []
    let new_playoff_teams = []
    playoff_games.forEach(game=>{
      if(game.Status[0] === 'F'){
        let results = game.HomeTeamScore > game.AwayTeamScore ? [teamIdMap[game.GlobalHomeTeamID], teamIdMap[game.GlobalAwayTeamID]] : [teamIdMap[game.GlobalAwayTeamID], teamIdMap[game.GlobalHomeTeamID]]
        if(results[0] != undefined && results[1] !== undefined){
          standings_by_team_id[results[0]].wins--
          standings_by_team_id[results[1]].losses--
          bowl_wins.push({team_id: results[0], bowl_wins: 1})
        }
      }
      //first - check to see if games was played in a playoff stadium
      if(playoff_stadium_ids.includes(game.StadiumID)){
        //next - check to see if the game was played before after dec. 29 or before jan.10 - to weed out non-playoff games
        let split = game.Day.split('T')[0].split('-')
        if(split[2] >29 || split[2]<10){
          //this checks if the stadium is in one of the two finalist stadiums - grabs two games
          if(finalist_stadium_ids_by_year[year].includes(game.StadiumID)){
            let playoff_result = [0, 0] //default results - game not played yet
            if(game.Status[0] === 'F'){ //check to see if game is over to log results
              playoff_result = game.HomeTeamScore > game.AwayTeamScore ? [1,0] : [0,1]
            }
            playoff_teams.push(
              {team_id: teamIdMap[game.GlobalHomeTeamID], playoff_wins: playoff_result[0], playoff_losses: playoff_result[1], playoff_status: 5, bowl_wins: 0},
              {team_id: teamIdMap[game.GlobalAwayTeamID], playoff_wins: playoff_result[1], playoff_losses: playoff_result[0], playoff_status: 5, bowl_wins: 0}
            )
            finalist_team_ids.push(teamIdMap[game.GlobalHomeTeamID], teamIdMap[game.GlobalAwayTeamID])
          }
          //this checks if the month is equal to january and the game is after the 3rd - to catch national championship
          else if(split[1]==1 && split[2]>3){
            if(game.Status[0] === 'F'){ //only relevant if games is over - otherwise, no need to log extra result that this game is occuring
              //since this is the last playoff game chronologicaly, can reshape playoff teams to new playoff teams
              let finalists = game.HomeTeamScore > game.AwayTeamScore ? [teamIdMap[game.GlobalHomeTeamID], teamIdMap[game.GlobalAwayTeamID]] : [teamIdMap[game.GlobalAwayTeamID], teamIdMap[game.GlobalHomeTeamID]]
              new_playoff_teams = playoff_teams.filter(team => finalists.includes(team.team_id) === false) //filters out finalists for new array to be added
              new_playoff_teams.push(
                {team_id: finalists[0], playoff_wins: 2, playoff_losses: 0, playoff_status: 6},
                {team_id: finalists[1], playoff_wins: 1, playoff_losses: 1, playoff_status: 5},)
            }
          }else //if the team made a new years 6 bowl, just add them to playoffs as normal
          {
            playoff_teams.push({team_id: teamIdMap[game.GlobalHomeTeamID], playoff_status: 4, playoff_wins: 0, playoff_losses: 0, year: year}, {team_id: teamIdMap[game.GlobalAwayTeamID], playoff_status: 4, playoff_wins: 0, playoff_losses: 0, year: year})
          }
        }
        //note: still need to figure out a way to differentiate between playoff wins and normal bowl wins. NY6 teams all get playoff appearance points
      }
    
    })
    let new_bowl_wins = bowl_wins.filter(team => finalist_team_ids.includes(team.team_id)===false)
    let new_standings = Object.keys(standings_by_team_id).map(key => standings_by_team_id[key])
    
    await db_helpers.updateBowlWins(knex, new_bowl_wins, new_playoff_teams)

    return new_standings
  }
}

// const getCBBstandings = async (knex, sportName, api, promiseToGet, year) =>{
//   const standings = await standingsBySport(knex, sportName, api, promiseToGet, year)
//   var today = new Date()
//   let today_day_count = getDayCount(today)
//   console.log(today_day_count)

//   //note: below is an approximation of date count of start of post season
//   //this should be pulled from table, with start dates
//   //we can create this table using get current season, which is a pull from fantasy data
//   //will want to create that
//   if(today_day_count<1667){
//     return standings
//   }else{
//     //pull ALL postseason games (includes NIT)
//     const post_year = year.concat('POST')
//     const unparsed_post_season_games = await db_helpers.getFdata(knex, sportName, api, 'getSchedulesPromise', post_year)
//     const post_season_games = JSON.parse(unparsed_post_season_games)
//     let teamIdMap = await db_helpers.getTeamIdMap(knex, '106')
//     //break standings up by teamID, into object
//     let standings_by_team_id = {}
//     standings.forEach(team => standings_by_team_id[team.team_id]={...team})
//     //for each postseason game: take results away from standings
//     post_season_games.forEach(game =>{

//       let results = game.HomeTeamScore > game.AwayTeamScore ? [teamIdMap[game.GlobalHomeTeamID],teamIdMap[game.GlobalAwayTeamID]] : [teamIdMap[game.GlobalAwayTeamID],teamIdMap[game.GlobalHomeTeamID]]
//       standings_by_team_id[results[0]].wins--
//       standings_by_team_id[results[1]].losses--
//     })
//     //put standings back together into object
//     let new_standings = Object.keys(standings_by_team_id).map(key => standings_by_team_id[key])
//     return new_standings
//   }
// }

//this I'm saving for later, to keep track of for EPL when we need it.
//this is the round for each year, when we end up only using the year that is needed.
// const round_year = {
//   2018: 144,
//   2019: 274
// }

module.exports = {updateStandings}