const db_helpers = require('../helpers').data

const createCollegeSport = async (knex, sport_id, sportName, api, promiseToGet) => {
    let teamInfo = []
    let standings = []
    let playoff_standings = []
    let teams_and_info = await db_helpers.createSportData(knex, sport_id, sportName, api, promiseToGet)
    let teamIdMap = teams_and_info[1]
    let college_teams = teams_and_info[0]
    let confMap = teams_and_info[2]
    college_teams.forEach(conference => {
        let conf_id = confMap[conference.ConferenceID]
        conference.Teams.forEach(team=>{
            let team_id = teamIdMap[team.GlobalTeamID]
            let team_division = sport_id == 105 ? team.Conference : "---"

            teamInfo.push({sport_id: sport_id, team_id: team_id, key: team.Key, city: team.School, 
                name: team.Name, conference_id: conf_id, 
                logo_url:team.TeamLogoUrl,
                global_team_id:team.GlobalTeamID, division: team_division})

            standings.push({team_id: team_id, wins : 0, losses: 0, ties: 0})
            
            playoff_standings.push({team_id: team_id, playoff_wins : 0, playoff_losses: 0, byes: 0, bowl_wins: 0, playoff_status: 'tbd'})
      
        })
    })


    db_helpers.insertIntoTable(knex, 'sports', 'team_info', teamInfo)
        .then(() =>
        {
        db_helpers.insertIntoTable(knex, 'sports', 'standings', standings)
            .then(() =>
            {
            db_helpers.insertIntoTable(knex, 'sports', 'playoff_standings', playoff_standings)
            .then(()=> {
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
    let teams_and_info = await db_helpers.createSportData(knex, sport_id, sportName, api, promiseToGet)
    let teamIdMap = teams_and_info[1]
    let professional_teams = teams_and_info[0]
    let confMap = teams_and_info[2]

    professional_teams.forEach(team => {
        let team_id = teamIdMap[team.GlobalTeamID]
        let team_division = team.Division
        let team_conference = sport_id === '103' ? confMap[team.League] : confMap[team.Conference]
        
        teamInfo.push({sport_id: sport_id, team_id: team_id, key: team.Key, city: team.City, 
            name: team.Name, conference_id: team_conference, 
            logo_url: team.WikipediaLogoUrl,
            global_team_id:team.GlobalTeamID, division: team_division})

        standings.push({team_id: team_id, wins : 0, losses: 0, ties: 0})
        
        playoff_standings.push({team_id: team_id, playoff_wins : 0, playoff_losses: 0, byes: 0, bowl_wins: 0, playoff_status: 'tbd'})
    
    })



    db_helpers.insertIntoTable(knex, 'sports', 'team_info', teamInfo)
        .then(() =>
        {
        db_helpers.insertIntoTable(knex, 'sports', 'standings', standings)
            .then(() =>
            {
            db_helpers.insertIntoTable(knex, 'sports', 'playoff_standings', playoff_standings)
            .then(()=> {
                process.exit()
            })
            })
        }) 
}

const createSoccerLeague = async (knex, sport_id, sportName, api, promiseToGet, season_id_1, season_id_2) => {
    //need to pull in data from 2 seasons, since teams get promoted and relegated.
    //upcoming season is season 1 - currently, 2018/19
    //last season is season 2 - 2017/18
    let teamInfo = []
    let standings = []
    let playoff_standings = []
    let teams_and_info = await db_helpers.createSportData(knex, sport_id, sportName, api, promiseToGet, season_id_1)
    let teams_2 = await db_helpers.getFdata(knex, sportName, api, promiseToGet, season_id_2)
    let soccer_teams_2 = JSON.parse(teams_2)
    let teamIdMap = teams_and_info[1]
    let soccer_teams = teams_and_info[0]
    let confMap = teams_and_info[2]
    let season_1_team_ids = []
    let premier_table = []
    let team_conference = confMap[sportName]

    soccer_teams.forEach(team => {
        let team_id = teamIdMap[team.Team.GlobalTeamId]
        console.log(team_id)
        season_1_team_ids.push(team_id)
        
        teamInfo.push({sport_id: sport_id, team_id: team_id, key: team.Team.Key, city: team.Team.City, 
            name: team.Team.Name, conference_id: team_conference, 
            logo_url: team.Team.WikipediaLogoUrl ? team.Team.WikipediaLogoUrl: "---",
            global_team_id: team.Team.GlobalTeamId})

        standings.push({team_id: team_id, wins : 0, losses: 0, ties: 0})
        
        playoff_standings.push({team_id: team_id, playoff_wins : 0, playoff_losses: 0, byes: 0, bowl_wins: 0, playoff_status: 'tbd'})

        premier_table.push({team_id: team_id, division_1: true})
    
    })

    soccer_teams_2.forEach(team=>{
        let team_id = teamIdMap[team.Team.GlobalTeamId]
        if(!season_1_team_ids.includes(team_id)){
            teamInfo.push({sport_id: sport_id, team_id: team_id, key: team.Team.Key, city: team.Team.City, 
                name: team.Team.Name, conference_id: team_conference, 
                logo_url: team.Team.WikipediaLogoUrl ? team.Team.WikipediaLogoUrl: "---",
                global_team_id: team.Team.GlobalTeamId})
    
            standings.push({team_id: team_id, wins : 0, losses: 0, ties: 0})
            
            playoff_standings.push({team_id: team_id, playoff_wins : 0, playoff_losses: 0, byes: 0, bowl_wins: 0, playoff_status: 'tbd'})

            premier_table.push({team_id: team_id, division_1: false})
        }
    })





    db_helpers.insertIntoTable(knex, 'sports', 'team_info', teamInfo)
        .then(() =>
        {
        db_helpers.insertIntoTable(knex, 'sports', 'standings', standings)
            .then(() =>
            {
            db_helpers.insertIntoTable(knex, 'sports', 'playoff_standings', playoff_standings)
            .then(()=> {
                db_helpers.insertIntoTable(knex, 'sports', 'premier_status', premier_table)
                .then(()=>{
                    process.exit()
                    })

                })
            })
        }) 
}

module.exports = {createCollegeSport, createProfessionalSport, createSoccerLeague}