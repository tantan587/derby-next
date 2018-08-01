const db_helpers = require('../helpers').data

//currently setting conference if none to 999, so don't run conf tournament, etc. - i guess for now


const getSeasonData = async (knex, sport_id) => {
  let sport_seasons =
    await knex('sports.sport_season')
      .where('sport_id', sport_id)
  
  let playoff_sport_seasons = []
  let regular_sport_seasons = []
  let all_sport_seasons = []
  sport_seasons.forEach(season => {
    if(season.season_type === 1){
      regular_sport_seasons.push({sport_season_id: season.sport_season_id, year: season.year})
    }
    if(season.season_type === 3){
      playoff_sport_seasons.push({sport_season_id: season.sport_season_id, year: season.year})
    }
    all_sport_seasons.push(season.sport_season_id)
  })
  
  let sport_structure = 
  await knex('fantasy.sports_structure')
    .leftOuterJoin('fantasy.league_bundle', 'fantasy.sports_structure.league_bundle_id', 'fantasy.league_bundle.league_bundle_id')
    .select('*')

  let active_sport_structure = sport_structure.map(structure => {
    if(structure.current_sport_seasons.some(sport_season => {
      all_sport_seasons.includes(sport_season)
    })){
      return {sport_structure_id: structure.sport_structure_id, scoring_type_id: structure.scoring_type_id}
    }
  })

  return {regular: regular_sport_seasons, playoff: playoff_sport_seasons, structures: active_sport_structure}
}

const createCollegeSport = async (knex, sport_id, sportName, api, promiseToGet) => {
  let teamInfo = []
  let standings = []
  let playoff_standings = []
  let teamPoints = []
  let teams_and_info = await db_helpers.createSportData(knex, sport_id, sportName, api, promiseToGet)
  let teamIdMap = teams_and_info[1]
  let college_teams = teams_and_info[0]
  let confMap = teams_and_info[2]

  let season_data = await getSeasonData(knex, sport_id)

  college_teams.forEach(team=>{
    let team_id = teamIdMap[team.GlobalTeamID]
    let team_division = sport_id == 105 ? team.Conference : '---'
    let conf_id = confMap[team.ConferenceID] ? confMap[team.ConferenceID] : 999

    teamInfo.push({sport_id: sport_id, team_id: team_id, key: team.Key, city: team.School, 
      name: team.Name, conference_id: conf_id, 
      logo_url:team.TeamLogoUrl,
      global_team_id:team.GlobalTeamID, division: team_division})
    
    season_data.regular.forEach(season => {
      standings.push({team_id: team_id, wins : 0, losses: 0, ties: 0, year: season.year, sport_season_id: season.sport_season_id})
    })
    season_data.playoff.forEach(season => {
      playoff_standings.push({team_id: team_id, playoff_wins : 0, playoff_losses: 0, byes: 0, bowl_wins: 0, playoff_status: 1, year: season.year, sport_season_id: season.sport_season_id})
    })

    // season_data.structures.forEach(structure => {
    //   teamPoints.push({team_id: team_id, reg_points: 0, playoff_points: 0, bonus_points: 0, scoring_type_id: structure.scoring_type_id, sport_structure_id: structure.sport_structure_id})
    // })
})


  db_helpers.insertIntoTable(knex, 'sports', 'team_info', teamInfo)
    .then(() =>
    {
      db_helpers.insertIntoTable(knex, 'sports', 'standings', standings)
        .then(() =>
        {
          db_helpers.insertIntoTable(knex, 'sports', 'playoff_standings', playoff_standings)
            .then(()=> {
              console.log(`${sportName}: ${teamInfo.length} teams added`)
              process.exit()
            })
        })
    }) 
}

//this is for NBA, NHL, MLB, NFL
const createProfessionalSport = async (knex, sport_id, sportName, api, promiseToGet) => {
  let teamInfo = []
  let standings = []
  let playoff_standings = []
  let teamPoints = []
  let teams_and_info = await db_helpers.createSportData(knex, sport_id, sportName, api, promiseToGet)
  let teamIdMap = teams_and_info[1]
  let professional_teams = teams_and_info[0]
  let confMap = teams_and_info[2]

  let season_data = await getSeasonData(knex, sport_id)

  professional_teams.forEach(team => {
    let team_id = teamIdMap[team.GlobalTeamID]
    let team_division = team.Division
    let team_conference = sport_id === '103' ? confMap[team.League] : confMap[team.Conference]
        
    teamInfo.push({sport_id: sport_id, team_id: team_id, key: team.Key, city: team.City, 
      name: team.Name, conference_id: team_conference, 
      logo_url: team.WikipediaLogoUrl,
      global_team_id:team.GlobalTeamID, division: team_division})

    season_data.regular.forEach(season => {
      standings.push({team_id: team_id, wins : 0, losses: 0, ties: 0, year: season.year, sport_season_id: season.sport_season_id})
    })
    season_data.playoff.forEach(season => {
      playoff_standings.push({team_id: team_id, playoff_wins : 0, playoff_losses: 0, byes: 0, bowl_wins: 0, playoff_status: 1, year: season.year, sport_season_id: season.sport_season_id})
    })

    // season_data.structures.forEach(structure => {
    //   teamPoints.push({team_id: team_id, reg_points: 0, playoff_points: 0, bonus_points: 0, scoring_type_id: structure.scoring_type_id, sport_structure_id: structure.sport_structure_id})
    // })

  })



  db_helpers.insertIntoTable(knex, 'sports', 'team_info', teamInfo)
    .then(() =>
    {
      db_helpers.insertIntoTable(knex, 'sports', 'standings', standings)
        .then(() =>
        {
          db_helpers.insertIntoTable(knex, 'sports', 'playoff_standings', playoff_standings)
            .then(()=> {
              console.log(`${sportName}: ${teamInfo.length} teams added`)
              process.exit()
            })
        })
    }) 
}

//eventually, below needs to pull from each and every season. A change needed for 2019/20
const createSoccerLeague = async (knex, sport_id, sportName, api, promiseToGet, season_id_1, season_id_2) => {
  //need to pull in data from 2 seasons, since teams get promoted and relegated.
  //upcoming season is season 1 - currently, 2018/19
  //last season is season 2 - 2017/18
  let teamInfo = []
  let standings = []
  let playoff_standings = []
  let teamPoints = []
  let teams_and_info = await db_helpers.createSportData(knex, sport_id, sportName, api, promiseToGet, season_id_1)
  let teams_2 = await db_helpers.getFdata(knex, sportName, api, promiseToGet, season_id_2)
  let soccer_teams_2 = JSON.parse(teams_2)
  let teamIdMap = teams_and_info[1]
  let soccer_teams = teams_and_info[0]
  let confMap = teams_and_info[2]
  let season_1_team_ids = []
  let premier_table = []
  let team_conference = confMap[sportName]

  let season_data = await getSeasonData(knex, sport_id)
  //check out what the pull is, and see if it has the year. After, push each season into its corresponding standings
  
  soccer_teams.forEach(team => {
    let team_id = teamIdMap[team.Team.GlobalTeamId]
    console.log(team_id)
    season_1_team_ids.push(team_id)
        
    teamInfo.push({sport_id: sport_id, team_id: team_id, key: team.Team.Key, city: team.Team.City, 
      name: team.Team.Name, conference_id: team_conference, 
      logo_url: team.Team.WikipediaLogoUrl ? team.Team.WikipediaLogoUrl: '---',
      global_team_id: team.Team.GlobalTeamId})
    
    //this should be deprecated and based upon above, when can be done by seasons. Until then:
    standings.push({team_id: team_id, wins : 0, losses: 0, ties: 0, year: 2019, sport_season_id: 40})

    //standings.push({team_id: team_id, wins : 0, losses: 0, ties: 0})
        
    playoff_standings.push({team_id: team_id, playoff_wins : 0, playoff_losses: 0, byes: 0, bowl_wins: 0, playoff_status: 1, year: 2019, sport_season_id: 42})
    //playoff_standings.push({team_id: team_id, playoff_wins : 0, playoff_losses: 0, byes: 0, bowl_wins: 0, playoff_status: 1})

    premier_table.push({team_id: team_id, division_1: true})
    
    // season_data.structures.forEach(structure => {
    //   teamPoints.push({team_id: team_id, reg_points: 0, playoff_points: 0, bonus_points: 0, scoring_type_id: structure.scoring_type_id, sport_structure_id: structure.sport_structure_id})
    // })
  })

  soccer_teams_2.forEach(team=>{
    let team_id = teamIdMap[team.Team.GlobalTeamId]
    if(!(season_1_team_ids.includes(team_id))){
      teamInfo.push({sport_id: sport_id, team_id: team_id, key: team.Team.Key, city: team.Team.City, 
        name: team.Team.Name, conference_id: team_conference, 
        logo_url: team.Team.WikipediaLogoUrl ? team.Team.WikipediaLogoUrl: '---',
        global_team_id: team.Team.GlobalTeamId})
      
      premier_table.push({team_id: team_id, division_1: false})
      }

      standings.push({team_id: team_id, wins : 0, losses: 0, ties: 0, year: 2018, sport_season_id: 19})
            
      playoff_standings.push({team_id: team_id, playoff_wins : 0, playoff_losses: 0, byes: 0, bowl_wins: 0, playoff_status: 1, year: 2018, sport_season_id: 21})
    
  })





  db_helpers.insertIntoTable(knex, 'sports', 'team_info', teamInfo)
    .then(() => {
      db_helpers.insertIntoTable(knex, 'sports', 'standings', standings)
        .then(() => {
          db_helpers.insertIntoTable(knex, 'sports', 'playoff_standings', playoff_standings)
            .then(()=> {
              db_helpers.insertIntoTable(knex, 'sports', 'premier_status', premier_table)
                .then(()=>{
                  console.log(`${sportName}: ${teamInfo.length} teams added`)
                  process.exit()
                })

            })
        })
    }) 
}

module.exports = {createCollegeSport, createProfessionalSport, createSoccerLeague}