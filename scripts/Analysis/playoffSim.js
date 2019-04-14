//these functions are for when playoffs are in the middle. Shoudl consolidate with playoffFunctions
const buildCurrentPlayoffResults = (teams, pastSchedule, sport_id) => {
    let eliminated_teams = []
    teams.sort(function(a,b){ return b.wins - a.wins})
    pastSchedule.forEach(game => {
        if(game.home.current_round === 0){
            game.home.current_round = 1
            game.home.playoff_appearances = 1
        }
        if(game.away.current_round === 0){
            game.away.current_round = 1
            game.away.playoff_appearances = 1
        }
        if(game.away.current_round !== game.home.current_round){
            let bye_team = game.away.current_round > game.home.current_round ? 'home' : 'away'
            game[bye_team].current_round++
        }
        let current_round = game.home.current_round
        let results = game.home_result > game.away_result ? ['home', 'away'] : ['away', 'home']
        game.recordPlayoffOpponents(current_round)
        game[results[0]].playoff_wins[current_round-1]++ //current round -1 because that is in the index
        game[results[1]].playoff_losses[current_round-1]++
        game[results[0]].playoff_games_played[current_round-1]++
        game[results[1]].playoff_games_played[current_round-1]++

        if(game[results[0]].playoff_wins[current_round-1] === clinchWins[current_round-1]){
            eliminated_teams.push(game[results[1]])
            game[results[0]].current_round++
/*             if(game[results[0]].current_round === finalsRound){
                game[results[0]].finalist = 1
            }else if (game[results[0]].current_round > finalsRound){
                game[results[0]].champions = 1
            } */
        } 
    })
    return eliminated_teams
}



module.exports = {buildCurrentPlayoffResults}

function midRoundSim(conferenceTeamsRemaining, min_round, simulateHelpers) {
    let teamsPlayedThisRound = []
    let newTeamsLeft = []
    conferenceTeamsRemaining.forEach(team => {
        if (!(teamsPlayedThisRound.includes(team))) {
            if (team.current_round === min_round) {
                let games_played_already = team.playoff_wins[min_round - 1] + team.playoff_losses[min_round - 1];
                let winner = simulateHelpers.Series(team, team.playoff_opponent, 7, 101, min_round, false, games_played_already);
                newTeamsLeft.push(winner);
                teamsPlayedThisRound.push(team);
                teamsPlayedThisRound.push(team.playoff_opponent);
            }
            else {
                newTeamsLeft.push(team);
            }
        }
    })
    return newTeamsLeft
}

const clinchWins = {
    101: [7, 7, 7, 7],
    102: [1, 1, 1, 1, 1],
    103: [1, 5, 7, 7],
    104: [7, 7, 7, 7],
    105: [1, 1],
    106: [1, 1, 1, 1, 1, 1, 1, 1, 1]
}

const numberPlayoffTeamsBySport = {
    101: 16,
    102: 12,
    103: 10,
    104: 16,
    105: 4,
    106: 68
}
