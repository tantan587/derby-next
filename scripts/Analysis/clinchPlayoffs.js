//this was started in case we need it to automate when teams make playoffs, since fantasydata doesn't yet provide
//will have to work towards correcting this and finishing if necessary

const knex = require('../../server/db/connection')

const getStandings = async (knex, sport_id) => {
    return knex('sports.team_info')
        .where('sports.team_info.sport_id', sport_id)
        .innerJoin('sports.standings', 'sports.standings.team_id', 'sports.team_info.team_id')
        .select('sports.standings.*', 'sports.team_info.conference_id', 'sports.team_info.division')
}

getStandings(knex, '103')
    .then((standings)=>{
        standings.forEach(team=>{
            console.log(team.wins)
        })
        process.exit()
    })

const NFL_playoffs = async () =>{
    let team_ids_in_playoffs = []
    let team_ids_byes = []
    const standings = await getStandings(knex, '102')
    let nfc = standings.filter(team => team.conference_id = '10201')
    let afc = standings.filter(team => team.conference_id = '10202')
    nfc.sort(function(a,b){return b.wins-a.wins})
    let seventh_place_wins = nfc[6].wins
    let seventh_place_total = seventh_place_wins + nfc[6].ties + nfc[6].losses
    nfc.forEach(team => {
        let total_wins = team.wins + team.losses + team.ties

    })
    

}