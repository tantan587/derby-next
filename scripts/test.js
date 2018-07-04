const knex = require('../server/db/connection')
const fdClientModule = require('fantasydata-node-client');
const db_helpers = require('./helpers').data

const t = async() => {
let current_week = await db_helpers.getFdata(knex, 'CFB', 'CFBv3StatsClient', 'getCurrentWeekPromise')
if(current_week == ""){
    console.log('yes')
}else{
    console.log(current_week)
}

}

t()