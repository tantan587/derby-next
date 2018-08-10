const Team = require('./TeamClass.js')
const math = require('mathjs')

//note: currently, home and away games are not perfect, and are thrown off by a little
//range for amount of home games is between 79-83
//leaving it for now: don't want to work on finding error
//second note: this is currently only set up for baseball.

/* const getTeams = async(knex, sportId) => {
    return knex
        .withSchema('sports')
        .table('team_info')
        .where('sport_id', sportId)
} */

const randomNBASchedule =  (teams) => {
    //let teams = await getTeams(knex, '101')
    //schedule contains home team id, away team id, sport id, game id
    // let team_list = teams.map(team => {
    //     return new Team(team.name, team.sport_id, 0, 0, 0, 0, team.division, team.conference_id, team.team_id)
    // })

    //console.log(team_list)
    let team_list = Object.keys(teams).map(key => teams[key])
    let schedule = []
    let x = 0
    let divisions = [['Atlantic', '10101'], ['Central', '10101'], ['Southeast', '10101'],['Northwest','10102'],['Pacific','10102'],['Southwest','10102']]
    let teams_in_divisions = []
    //divide teams into an array by div/conference
    divisions.forEach(division =>{
        let div = team_list.filter(team => (team.conference===division[1] && team.division === division[0]))
            teams_in_divisions.push(div)
        })
    
    let western_conference = team_list.filter(team => team.conference === '10102')
    let eastern_conference = team_list.filter(team => team.conference === '10101')
    //schedule intradivision games
    scheduleIntradivision(teams_in_divisions, schedule, '101', 4)
    
    //schedule intraleague games
    scheduleIntraLeague(teams_in_divisions, schedule, '101', [4,3])

    //schedule interleague games
    eastern_conference.forEach(team => {
        western_conference.forEach(opponent =>{
            addToSchedule(schedule, '101', 2, team, opponent)
        })
    })
    
    randomizeSchedule(schedule)

    return schedule
    }

const randomMLBSchedule =  (teams) => {
    // let teams = await getTeams(knex, '103')
    //schedule contains home team id, away team id, sport id, game id
    // let team_list = teams.map(team => {
    //     return new Team(team.name, team.sport_id, 0, 0, 0, 0, team.division, team.conference_id, team.team_id)
    // })
    //console.log(team_list)
    let team_list = Object.keys(teams).map(key => teams[key])
    let schedule = []
    let teams_for_sched = []
    let x = 0
    let divisions = ['East', 'Central', 'West']
    let conferences = ['10301', '10302']
    let teams_in_divisions = []
    //divide teams into an array by div/conference
    conferences.forEach(conference =>{
        divisions.forEach(division =>{
            div = team_list.filter(team => (team.conference===conference && team.division === division))
            teams_in_divisions.push(div)
        })
    })
    //schedule intradivision games
    scheduleIntradivision(teams_in_divisions, schedule, '103', 19)
    
    //schedule intraleague games
    scheduleIntraLeague(teams_in_divisions, schedule, '103', [7,6])

    //schedule interleague games - for 2019, ALEast vs. NLWest, ALWest vs. NLCentral, ALCentral vs. NLEast
    interLeagueSchedule(teams_in_divisions[0], teams_in_divisions[5], schedule)
    interLeagueSchedule(teams_in_divisions[2], teams_in_divisions[4], schedule)
    interLeagueSchedule(teams_in_divisions[1], teams_in_divisions[3], schedule)
    //schedule rivalry games
    baseball_rivalries.forEach(team_set =>{
        let team_1 = team_list.find(team => team.team_id===team_set[0])
        //console.log(team_1)
        let team_2 = team_list.find(team => team.team_id===team_set[1])
        //console.log(team_2)
        addToSchedule(schedule, '103', 4, team_1, team_2)
    })

    //this checks that they each play correct amount of games
    team_list.forEach(team => {
        //console.log(team.name,team.home_games_scheduled)
    })
    
    randomizeSchedule(schedule)

    return schedule
}

const addToSchedule = (schedule_array, sport_id, amount_of_games, team_1, team_2) =>{
    for(let a = 0; a<amount_of_games; a++){
        let teams = a%2 === 0 ? [team_1, team_2]:[team_2, team_1]
        schedule_array.push({home_team_id: teams[0].team_id, away_team_id: teams[1].team_id, sport_id: sport_id})
    }
    team_1.games_scheduled += amount_of_games
    team_2.games_scheduled += amount_of_games
    let home_games = 0
    let away_games = 0
    amount_of_games%2 === 0 ? (
        home_games = amount_of_games/2,
        away_games = amount_of_games/2
    ) : (
        home_games = Math.ceil(amount_of_games/2),
        away_games = Math.floor(amount_of_games/2)
    )
    team_1.home_games_scheduled += home_games
    team_2.away_games_scheduled += home_games
    team_1.away_games_scheduled += away_games
    team_2.home_games_scheduled += away_games 
}

const createArrayOfGameAmountOptions = (team_index) => {
    let second = team_index > 2 ? team_index - 3 : team_index + 2;
    let third = team_index === 0 ? 4 : team_index - 1;
    let seven = [team_index, second, third];
    return seven;
}

const interLeagueSchedule = (division_1, division_2, schedule, x=0) => {
    division_1.forEach(team => {
        division_2.forEach(opponent => {
            let same_index = division_2.indexOf(opponent) === division_1.indexOf(team) ? true : false;
            let games = same_index ? 4 : 3
            let teams = x % 2 === 0 ? [team, opponent] : [opponent, team]
            addToSchedule(schedule, '103', games, teams[0], teams[1])
            same_index ? 0 : x++
        })
        x++
    })
}

const scheduleIntradivision = (teams_in_divisions, schedule, sport_id, games) => {
    let x = 0
    let teams_for_sched = []
    teams_in_divisions.forEach(div => {
        teams_for_sched = div.slice(0)
        x = 0
        div.forEach(team => {
            teams_for_sched.shift()
            if (teams_for_sched.length !== 0) {
                teams_for_sched.forEach(opponent => {
                    let teams = x % 2 === 0 ? [team, opponent] : [opponent, team]
                    addToSchedule(schedule, sport_id, games, teams[0], teams[1])
                    x++
                })
            }
        })
    })
}

const intraleagueGames = (division_1, division_2, opponent, team, x, schedule, games_array, sport_id) => {
    let opp_index = division_2.indexOf(opponent)
    let team_index = division_1.indexOf(team)
    let game_amount_options = createArrayOfGameAmountOptions(team_index)
    let teams = x % 2 === 0 ? [team, opponent] : [opponent, team]
    let games = game_amount_options.includes(opp_index) ? games_array[0] : games_array[1]
    addToSchedule(schedule, sport_id, games, teams[0], teams[1])
}

const baseball_rivalries = [['103103', '103130'],
['103104', '103102'],
['103119', '103118'],
['103115', '103127'],
['103129', '103121'],
['103105', '103106'],
['103107', '103108'],
['103110', '103122'],
['103112', '103126'],
['103116', '103117'],
['103111', '103101'],
['103114', '103113'],
['103124', '103120'],
['103123', '103125'],
['103109', '103128']
]

const scheduleIntraLeague = (teams_in_divisions, schedule, sport_id, games_array) => {
    let x = 0
    teams_in_divisions[0].forEach(team => {
        x = 0
        teams_in_divisions[1].forEach(opponent => {
            intraleagueGames(teams_in_divisions[0], teams_in_divisions[1], opponent, team, x, schedule, games_array, sport_id)
            x++
        })
        x = 1
        teams_in_divisions[2].forEach(opponent => {
            intraleagueGames(teams_in_divisions[0], teams_in_divisions[2], opponent, team, x, schedule, games_array, sport_id)
            x++
        })
    })
    teams_in_divisions[1].forEach(team => {
        x = 0
        teams_in_divisions[2].forEach(opponent => {
            intraleagueGames(teams_in_divisions[1], teams_in_divisions[2], opponent, team, x, schedule, games_array, sport_id)
            x++
        })
    });
    teams_in_divisions[3].forEach(team => {
        x = 0
        teams_in_divisions[4].forEach(opponent => {
            intraleagueGames(teams_in_divisions[3], teams_in_divisions[4], opponent, team, x, schedule, games_array, sport_id)
            x++
        })
        x = 1
        teams_in_divisions[5].forEach(opponent => {
            intraleagueGames(teams_in_divisions[3], teams_in_divisions[5], opponent, team, x, schedule, games_array, sport_id)
            x++
        })
    })
    teams_in_divisions[4].forEach(team => {
        x = 0
        teams_in_divisions[5].forEach(opponent => {
            intraleagueGames(teams_in_divisions[4], teams_in_divisions[5], opponent, team, x, schedule, games_array, sport_id)
            x++
        })
    })
}



const randomizeSchedule = (schedule) => {
    schedule.sort(function (a, b) { return 0.5 - Math.random()})
}


//randomMLBSchedule(knex)

const randomScheduleBySportID = {
    101: {random: randomNBASchedule},
    103: {random: randomMLBSchedule}
}

module.exports = {randomMLBSchedule, randomNBASchedule, randomScheduleBySportID}