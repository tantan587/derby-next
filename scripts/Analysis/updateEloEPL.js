const rp = require('request-promise')
const knex = require('../../server/db/connection')
const db_helpers = require('../helpers.js').data
const math = require('mathjs')

const team_ids_elo_names = {'Man City': 107111,
'Man United': 107112,
'Chelsea': 107105,
'Liverpool': 107110,
'Arsenal': 107102,
'Burnley': 107104,
'Tottenham': 107117,
'Leicester': 107109,
'Watford': 107118,
'Everton': 107107,
'Huddersfield': 107108,
'Brighton': 107103,
'Southampton': 107114,
'Crystal Palace': 107106,
'West Ham': 107120,
'Bournemouth': 107101,
'Stoke': 107115,
'Newcastle': 107113,
'West Brom': 107119,
'Swansea': 107116}


var options = {
    uri: 'http://api.clubelo.com/2018-06-23',
    headers: {
        'User-Agent': 'Request-Promise'
    },
    //json: true // Automatically parses the JSON string in the response
}

rp(options)
    .then(function (repos) {
        let data = repos.split(/,/)
        let first = []
        let second = []
        let third = []
        let fourth = []
        let fifth = []
        let x = 0
        let y = 0
        data.forEach(p => {
            let rem = x%6
            rem === 0 ? first.push(p) : rem === 1 ? second.push(p) : rem === 2 ? third.push(p) :
            rem === 3 ? fourth.push(p) : rem === 4 ? fifth.push(p) : 0
            x++
            if(y === 0 && x === 7){
                x=6
                y=1
            }
        })
        let premier = []
        //console.log(data)
        for(let a = 1; a<first.length; a++){
            if(second[a]==='ENG' && third[a]==1){
                premier.push({team: first[a+1], country: second[a], level: third[a], elo: fourth[a], team_id: team_ids_elo_names[first[a+1]]})
            }
        }
        let premier_one = premier.filter(team => team.level == 1)
        let premier_one_data = premier_one.map(team=>{
            let team_elo = math.round(team.elo, 2)
            return {team_id: team.team_id, elo: team_elo}})
        console.log(premier_one_data)
        //below is only active for first time. After that, will use update elo function below
        /* db_helpers.insertIntoTable(knex, 'analysis', 'current_elo', premier_one_data)
        .then(()=>{
            console.log('done')
            process.exit() */
        const updateList = []
        premier_one_data.forEach(team => {
            updateList.push(Promise.resolve(db_helpers.updateOneElo(knex, team.team_id, team.elo)))
        })
        return Promise.all(updateList).then(()=>{
            console.log('done!')
            process.exit()
        })
        //db_helpers.insertIntoTable(knex, 'analysis', 'current_elo')
        //console.log('User has %d repos', repos.length);
    })
    .catch(function (err) {
        console.log(err)// API call failed...
    })



/* 
// get walking directions from central park to the empire state building
var http = require("http");
    url = "http://api.clubelo.com/2018-06-23"
// get is a simple wrapper for request()
// which sets the http method to GET
var request = http.get(url, function (response) {
    // data is streamed in chunks from the server
    // so we have to handle the "data" event    
    var buffer = "", 
        data,
        route;

    response.on("data", function (chunk) {
        buffer += chunk;
    })



    response.on("end", function (err) {
        // finished transferring data
        // dump the raw data
        //console.log(buffer);
        //console.log("\n");
        data = JSON.parse(buffer);

        // extract the distance and time
        //console.log("Walking Distance: " + route.legs[0].distance.text);
        //console.log("Time: " + route.legs[0].duration.text);
    }); 
}); 

// let obj = {}
// obj['101'] = {}

// console.log(obj)

// obj['101']['a'] = 3

// console.log(obj) */