const knex = require('../server/db/connection')

//this is not working yet

const reset_tables = async () => {
    return Promise.all([
        knex('sports.standings').truncate(),
        knex('sports.schedule').truncate(),
        knex('sports.team_info').truncate(),
        knex('sports.playoff_standings').truncate(),
        knex('sports.premier_status').truncate()
        ])
        .then(()=>{
            require('./createSports/createAllSports')
            require('./update')
            .then(()=>{
                process.exit()
            })
        })
}

reset_tables()