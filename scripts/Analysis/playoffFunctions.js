const simulateHelpers = require('./simulateHelpers.js')

//function simulates up until the world series, and returns the world series participant from either AL/NL
const simulateAndFindWSTeams = (conference_teams) => {
    let playoffs = []
    let one_seed = conference_teams.shift()
    let two_seed = conference_teams.find(team => {return team.division != one_seed.division})
    let three_seed = conference_teams.find(team => {return team.division != one_seed.division && team.division != two_seed.division})
    playoffs.push(one_seed, two_seed, three_seed)
    playoffs.forEach(team => {team.playoff_wins[0] += 1})
    let wildcard_eligible = conference_teams.filter(team => {return playoffs.includes(team) === false})
    playoffs.push(wildcard_eligible[0], wildcard_eligible[1])
    playoffs.forEach(team => {team.playoff_appearances++})
    //playoffs.forEach(team => {console.log(`${team.name}`)})
    let wildcard_winner = simulateHelpers.Series(playoffs[3], playoffs[4], 1, '103', 1)
    let conference_finalist_one = simulateHelpers.Series(playoffs[0],wildcard_winner, 5, '103', 2)
    let conference_finalist_two = simulateHelpers.Series(playoffs[1],playoffs[2], 5, '103', 2)
    //this below figures out who should have homefield advantage in conference finalists by checking if wildcard team won
    let conference_finalists = conference_finalist_one === wildcard_winner ? [conference_finalist_two, conference_finalist_one]:[conference_finalist_one, conference_finalist_two]
    return simulateHelpers.Series(conference_finalists[0], conference_finalists[1], 7, '103', 3)
}

//function simulates up until super bowl, and returns super bowl participant from either AFC
const simulateAndFindSBTeams = (conference_teams) => {
    let playoffs = []
    let one_seed = conference_teams.shift()
    let two_seed = conference_teams.find(team => {return team.division != one_seed.division})
    let three_seed = conference_teams.find(team => {return team.division != one_seed.division && team.division != two_seed.division})
    let four_seed = conference_teams.find(team => {return team.division != one_seed.division && team.division != two_seed.division && team.division != three_seed.division})
    playoffs.push(one_seed, two_seed, three_seed, four_seed)
    one_seed.playoff_wins[0]++
    two_seed.playoff_wins[0]++
    let wildcard_eligible = conference_teams.filter(team => {return playoffs.includes(team) === false})
    playoffs.push(wildcard_eligible[0], wildcard_eligible[1])
    playoffs.forEach(team => {team.playoff_appearances++})
    //playoffs.forEach(team => {console.log(`${team.name}`)})
    let wildcard_winner_1 = Series(playoffs[3], playoffs[4], 1, '102', 1)
    let wildcard_winner_2 = Series(playoffs[2], playoffs[5], 1, '102', 1)
    let wildcard_winners = moreWins(wildcard_winner_1, wildcard_winner_2)
    let conference_finalist_one = Series(playoffs[0],wildcard_winners[1], 1, '102', 2)
    let conference_finalist_two = Series(playoffs[1],wildcard_winners[0], 1, '102', 2)
    //this below figures out who should have homefield advantage in conference finalists by checking if wildcard team won
    let conference_finalists = moreWins(conference_finalist_one, conference_finalist_two)
    return Series(conference_finalists[0], conference_finalists[1], 1, '102', 3)
}

//formula for NBA - if there will be tweaks, will add later - NHL playoffs work differently, with division winners having more importance
const simulateNBAConferencePlayoffs = (conference) => {
    let playoffs = conference.slice(0,8)
    playoffs.forEach(team => {team.playoff_appearances++})
    let next_round = []
    let teams_remaining = playoffs.length
    console.log(playoffs)
    for(var round=1; round<4; round++){ //rounds
        for(y=0; y<(teams_remaining/2); y++){
            console.log(playoffs.length)
            let a = playoffs.shift()
            let b = playoffs.pop()
            let teams = moreWins(a,b)
            let winner = Series(teams[0], teams[1], 7, '101', round)
            next_round.push(winner)
        }
        playoffs.push(...next_round)
        next_round.length = 0
        teams_remaining = playoffs.length
        }
    playoffs[0].finalist++
    return playoffs[0]
    }

const simulateNHLconf =(conference) => {return 1}
const simulateEPLconf =(conference) => {return 1}
const simulateCFBconf =(conference) => {return 1}
const simulateCBBconf =(conference) => {return 1}

module.exports = {simulateNHLconf, simulateEPLconf, simulateCFBconf, simulateCBBconf, simulateAndFindSBTeams, simulateAndFindWSTeams, simulateNBAConferencePlayoffs}