//these functions are for when playoffs are in the middle. Shoudl consolidate with playoffFunctions
const buildCurrentPlayoffResults = (teams, pastSchedule, winsToClinchSeries, finalsRound) => {
    let eliminated_teams = []
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
            game[bye_team].playoff_wins[game[bye_team].current_round]++
            game[bye_team].current_round++
        }
        let current_round = game.home.current_round
        let results = game.home_result > game.away_result ? ['home', 'away'] : ['away', 'home']
        game[results[0]].playoff_wins[current_round-1]++
        game[results[1]].playoff_losses[current_round-1]++
        
        if(game[results[0]].playoff_wins[current_round-1] === winsToClinchSeries){
            eliminated_teams.push(game[results[1]])
            game[results[0]].current_round++
            if(game[results[0]].current_round === finalsRound){
                game[results[0]].finalist = 1
            }else if (game[results[0]].current_round > finalsRound){
                game[results[0]].champions = 1
            }
        } 
    })
    return eliminated_teams
}

const NBAPlayoffSim = (playoffTeams, playoffGamesScheduled, pastPlayoffGames, simulateHelpers, playoffFunctions) => {
    playoffTeams.sort((a,b) => {return b.wins - a.wins})
    // let new_games = pastPlayoffGames.slice(0, 25)
    // let new_games_upcoming = playoffGamesScheduled.slice(25, 35)
    let nbaEastTeams = playoffTeams.filter(team => {return team.conference == 10101}) 
    let nbaWestTeams = playoffTeams.filter(team => {return team.conference == 10102}) 
    let playoffsStarted = playoffTeams.every(team => {return team.playoff_wins === 0})
    // playoffGamesScheduled.forEach(game => {
    //     game.home.current_opponent = game.away
    //     game.away.current_opponent = game.home
    // })
    calculateSeeds(nbaEastTeams)
    calculateSeeds(nbaWestTeams)


    let eliminated_teams = buildCurrentPlayoffResults(playoffTeams, new_games, 4, 4)


    let nbaWestChamp = nbaPlayoffSimMidPlayoffs(nbaWestTeams, eliminated_teams, new_games_upcoming, simulateHelpers, playoffFunctions)


    let nbaEastChamp = nbaPlayoffSimMidPlayoffs(nbaEastTeams, eliminated_teams, new_games_upcoming, simulateHelpers, playoffFunctions)

    return [nbaWestChamp, nbaEastChamp]
    
    // newTeamsLeft.forEach(team => {
    //     team.printTeam()
    // })

    

    


}

const calculateSeeds = (teams) => {
    let seed = 1
    teams.forEach(team => {
        team.playoff_seed = seed
        seed++
    })
}

function nbaPlayoffSimMidPlayoffs(conferenceTeams, eliminated_teams, new_games_upcoming, simulateHelpers, playoffFunctions) {
    let conferenceTeamsRemaining = conferenceTeams.filter(team => {
        return !(eliminated_teams.includes(team));
    });
    conferenceTeamsRemaining.sort((a, b) => { return a.current_round - b.current_round; });
    let min_round = conferenceTeamsRemaining[0].current_round;
    let max_round = min_round+1
    conferenceTeamsRemaining.sort((a, b) => { return a.playoff_seed - b.playoff_seed; });
    //look at games scheduled to figure out opponent. if no games scheduled, than it is waiting
    new_games_upcoming.forEach(game => {
        game.home.playoff_opponent = game.away;
        game.away.playoff_opponent = game.home;
    });
    let newTeamsLeft = [];
    let teamsPlayedThisRound = [];
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
    });
    newTeamsLeft.forEach(team =>{
        team.printTeam()
    })
    newTeamsLeft.sort((a, b) => { return b.playoff_seed - a.playoff_seed; });
    let conferenceChamp = playoffFunctions[101](newTeamsLeft, simulateHelpers, true, max_round);

    return conferenceChamp
}

const playoffSimFunctions = {
    101: NBAPlayoffSim
}

module.exports = playoffSimFunctions
