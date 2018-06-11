const knex = require('../../server/db/connection')
const db_helpers = require('../helpers.js').data

const createCbbRpis = (knex) => {
    let info = []
    return db_helpers.getTeamId(knex,'106')
    .then(result => {
        info = result.map(team => {
            return {team_id: team.team_id, rpi_wins: 0, rpi_losses: 0}
        })
    db_helpers.insertIntoTable(knex, 'analysis', 'cbb_rpi', info)
        .then(() => process.exit())
    })
}

createCbbRpis(knex)

const cbbRpiUpdateRows = (team_ids, value, result) => {
        let column = result === 'win' ? 'rpi_wins':'rpi_losses'
        return knex
            .withSchema('analysis')
            .table('cbb_rpi')
            .wherein('team_id',team_ids)
            .increment(column,value)
    }

//function to update all the Rpis at once, so that it looks clearner in the elo function when exported
const cbbUpdateAllRpi = (home_wins, away_wins, neutral_wins, home_losses, away_losses, neutral_losses) => {
    cbbRpiUpdateRows(home_wins, .6, 'win')
    cbbRpiUpdateRows(away_wins, 1.4, 'win')
    cbbRpiUpdateRows(neutral_wins, 1, 'win')
    cbbRpiUpdateRows(home_losses, 1.4, 'loss')
    cbbRpiUpdateRows(away_losses, .6, 'loss')
    cbbRpiUpdateRows(neutral_losses, 1, 'loss')
}

const addRpiToTeamClass = (knex, team_list) => {
    return knex
        .withSchema('analysis')
        .table('cbb_rpi')
        .select('*')
        .then(teams => {
            teams.forEach(team => {
                team_list['106'][team.team_id].addInitialRpiWL(team.rpi_wins, team.rpi_losses)
            })
        })
}
module.exports = {createCbbRpis, cbbRpiUpdateRows, cbbUpdateAllRpi, addRpiToTeamClass}