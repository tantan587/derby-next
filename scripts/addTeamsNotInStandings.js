let math = require('mathjs')
const knex = require('../server/db/connection')
const db_helpers = require('./helpers').data
const createSport = require('./createSports/create_sport_helpers')


const addMissingTeams = async (knex, sport_id, sportName, api, promiseToGet) => {


    let teamInfo = await knex
        .withSchema('sports')
        .table('team_info')
        .where('sport_id', sport_id)
    

    let teamIDRange = [Number(sport_id)*1000, (Number(sport_id)+1)*1000 - 1]
    let dataLink = await knex
        .withSchema('sports')
        .table('data_link')
        .where('team_id', '>', teamIDRange[0])
        .andWhere('team_id', '<', teamIDRange[1])
    
    teamsFromTeamInfo = []
    teamInfo.forEach(team => {
        teamsFromTeamInfo.push(team.team_id)
    })

    let missingTeams = []
    dataLink.forEach(team =>{
        if(!(teamsFromTeamInfo.includes(team.team_id))){
            missingTeams.push(team.team_id)
        }
    })

    await createSport.createCollegeSport(knex, sport_id, sportName, api, promiseToGet, missingTeams)
}

addMissingTeams(knex, '105', 'CFB', 'CFBv3ScoresClient', 'getTeamsPromise')
addMissingTeams(knex, '106', 'CBB', 'CBBv3StatsClient', 'getTeamsPromise')

