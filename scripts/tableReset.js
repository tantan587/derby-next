const knex = require('../server/db/connection')

//this is not working yet

const reset_tables = async () => {
    return Promise.all([
        knex('sports.standings').truncate(),
        knex('sports.schedule').truncate(),
        knex('sports.team_info').truncate(),
        knex('sports.playoff_standings').truncate()
        ])
        .then(()=>{
            const create_cbb = require('./createSports/create_cbb')
            const create_cfb = require('./createSports/create_cfb')
            const create_nfl = require('./createSports/create_nfl')
            const create_mlb = require('./createSports/create_mlb')
            const create_nba = require('./createSports/create_nba')
            const create_epl = require('./createSports/create_epl')
            const create_nhl = require('./createSports/create_nhl')
            console.log('sports_added')
            updateList = []
            const updateSchedule = require('./updateSchedule')
            console.log('reg_schedule_updated')
            const updateStandings = require('./updateStandings')
            const updatePlayoffSchedule = require('./createAndUpdateSchedulePlayoffs')
            const updatePlayoffStandings = require('./updatePlayoffStandings')
        })

}

reset_tables()