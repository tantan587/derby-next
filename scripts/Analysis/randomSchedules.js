const knex = require('../../server/db/connection')



const getTeams = async(knex, sportId) => {
    return knex
        .withSchema('sports')
        .table('team_info')
        .where('sport_id', sportId)
}

const randomSchedule = async (knex) => {
    let teams = await getTeams(knex, '103')
    //schedule contains home team id, away team id, sport id, game id
    let team_list = teams.map(team => {
        return {team_id: team.team_id, conference_id: team.conference_id, division: team.division, games_scheduled: 0}
    })
    console.log(team_list)
    let schedule = []
    
}


randomSchedule(knex)

