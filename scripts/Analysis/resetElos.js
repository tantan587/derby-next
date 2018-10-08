const initial = require('../createSports/initialElos')
const knex = require('../../server/db/connection')
const adjustAfter = require('../Analysis/adjustElosAfterSeason')
const updatePastElos = require('../Analysis/updatePastElos')

const sport_current_year = {
    101: 2019, 
    102: 2018,
    103: 2019, 
    104: 2019,
    105: 2018,
    106: 2019,
    107: 2019
}

const resetAllElosToToday = async (exitProcess) => {
    await initial.create_initial_elos(knex, true)
    console.log('elos created')
    await adjustAfter.adjustElosAfterSeason(false, 'allP')
    console.log('updated for current season')
    await updatePastElos(knex, sport_current_year, false)
    console.log('updated to today')
    if(exitProcess)
        process.exit()
}

module.exports = {resetAllElosToToday}