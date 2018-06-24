const rp = require('request-promise')
const fdClientModule = require('fantasydata-node-client')
const knex = require('../server/db/connection')

const work = async () =>
{
    //console.log('this')
    let league = await knex
    .withSchema('sports')
    .table('leagues')
    .where('sport_name', 'NHL')
  
    const keys = {}
    keys['NHLv3ScoresClient'] = league[0].fantasy_data_key
    const sport_id = league[0].sport_id
  
    const FantasyDataClient = new fdClientModule(keys);
    //const fandata = FantasyDataClient.func()
    //console.log('test')
    //console.log(FantasyDataClient[api][promiseToGet]())
    //return [FantasyDataClient[api][promiseToGet](), sport_id]

    FantasyDataClient.NHLv3ScoresClient.getStandingsPromise('2018')
    .then((m)=>{
        console.log(m)
        process.exit()
    })
}

work()