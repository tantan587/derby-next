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
    let wildcard_winner_1 = simulateHelpers.Series(playoffs[3], playoffs[4], 1, '102', 1)
    let wildcard_winner_2 = simulateHelpers.Series(playoffs[2], playoffs[5], 1, '102', 1)
    let wildcard_winners = simulateHelpers.moreWins(wildcard_winner_1, wildcard_winner_2)
    let conference_finalist_one = simulateHelpers.Series(playoffs[0],wildcard_winners[1], 1, '102', 2)
    let conference_finalist_two = simulateHelpers.Series(playoffs[1],wildcard_winners[0], 1, '102', 2)
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

const simulateNHLconf = (conference) => {
    let division_1 = conference[0].division //this is one of the two divisions
    //create an array of all the teams in each division
    let list_division_1 = conference.filter(team=>team.division === division_1)
    let list_division_2 = conference.filter(team => team.division != division_1)
    //create two bracket halves
    let bracket_1 = list_division_1.slice(0,3)
    let bracket_2 = list_division_2.slice(0,3)
    //find two wildcards
    let potential_wildcards = moreWins(list_division_1[0], list_division_2[0])
    let potential_second_wildcard = potentialwildcards[0]===list_division_1[0] ? moreWins(potential_wildcards[1],list_division_1[1]):moreWins(potential_wildcards[0], list_division_2[1])
    bracket_1.push(potential_second_wildcard[0])
    bracket_2.push(potential_wildcards[0])
    bracket_1.forEach(team => {team.playoff_appearances++})
    bracket_2.forEach(team => {team.playoff_appearances++})
    let conference_finalist_one = simulate_NHL_bracket(bracket_1)
    let conference_finalist_two = simulate_NHL_bracket(bracket_2)
    let conference_finalists = simulateHelpers.moreWins(conference_finalist_one, conference_finalist_two)
    let conference_champ = simulateHelpers.Series(conference_finalists[0],conference_finalists[1],7,'104',3)
    conference_champ.finalist++
    return conference_champ
}
const simulateEPLconf =(conference) => {return 1}

const simulateCFBconf =(conference) => {
    if (conference[0].conference_id != '10502'){
        let division_1 = conference[0].division //this is one of the two divisions
    //create an array of all the teams in each division
        let list_division_1 = conference.filter(team => team.division === division_1)
        let list_division_2 = conference.filter(team => team.division != division_1)
        let conf_champ = simulateHelpers.simulateGame(list_division_1[0], list_division_2[0],'105',neutral=true)
    }else{
        let conf_champ = simulateHelpers.simulateGame(confernece[0], conference[1],'105',neutral=true)
    }
    return conf_champ}
    
const simulateCBBconf = (conference) => {
    let total_teams = conference.length
    let rounds = total_teams === 8 ? 3: total_teams < 12 ? 4:5
    let tournament_teams_left = conference
    let teams_left,non_byes = 0
    let this_round_teams, next_round_teams = []
    for(let x = 0; x<rounds; x++){
        teams_left = tournament_teams_left.length
        non_byes = teams_left > 12 ? (teams_left-12)*2: teams_left>8 ? (teams_left-8)*2:0
        this_round_teams = tournament_teams_left.slice(non_byes,teams_left)
        next_round_teams = non_byes === 0 ? []:tournament_teams_left.slice(0, non_byes)
        for(let y = 0; y<(non_byes/2); y++){
            let team_1 = this_round_teams.shift()
            let team_2 = this_round_teams.pop()
            let winner = simulateHelpers.simulateGame(team_1,team_2,'106',neutral=true)
            next_round_teams.push(winner[0])
        }
        tournament_teams_left.length = 0
        tournament_teams_left.push(...next_round_teams)
        next_round_teams.length = 0
        this_round_teams.length = 0
    }
    return tournament_teams_left[0]}

const simulate_NHL_bracket = (bracket) => {
    team_1 = simulateHelpers.Series(bracket[0], bracket[3], 7,'104',1)
    team_2 = simulateHelpers.Series(bracket[0], bracket[3], 7,'104',1)
    let teams = simulateHelpers.moreWins(team_1, team_2)
    return simulateHelpers.Series(teams[0],teams[1],7,'104',2)

}
module.exports = {simulateNHLconf, simulateEPLconf, simulateCFBconf, simulateCBBconf, simulateAndFindSBTeams, simulateAndFindWSTeams, simulateNBAConferencePlayoffs}