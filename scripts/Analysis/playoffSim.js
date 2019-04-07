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

const NHLPlayoffSim = (playoffTeams, playoffGamesScheduled, pastPlayoffGames, simulateHelpers, playoffFunctions) => {
    playoffTeams.sort((a,b)=> {return b.wins + b.ties - a.wins - a.ties})

    let nhlEastTeams = playoffTeams.filter(team => {return team.conference == 10401}) 
    let nhlWestTeams = playoffTeams.filter(team => {return team.conference == 10402})
    
    let eastBrackets = nhlConferenceBrackets(nhlEastTeams)
    let westBrackets = nhlConferenceBrackets(nhlWestTeams)

    let eliminated_teams = buildCurrentPlayoffResults(playoffTeams, pastPlayoffGames, 4, 4)

    let nhlWestChamp = playoffSimMidPlayoffs(nhlWestTeams, eliminated_teams, playoffGamesScheduled, simulateHelpers, playoffFunctions, 104)
    let nhlEastChamp = playoffSimMidPlayoffs(nhlEastTeams, eliminated_teams, playoffGamesScheduled, simulateHelpers, playoffFunctions, 104)
}

const NHLConfSim = (conferenceTeams, eliminated_teams, playoffGamesScheduled, simulateHelpers, playoffFunctions) => {
    bracket1 = conferenceTeams[0].filter(team => {
        return !(eliminated_teams.includes(team))
    })
    bracket2 = conferenceTeamsRemaining[1].filter(team => {
        return !(eliminated_teams.includes(team))
    })
    bracket1.sort((a, b) => { return a.current_round - b.current_round; });
    bracket2.sort((a, b) => { return a.current_round - b.current_round; });
    let minRound = bracket1[0].current_round > bracket2[0].current_round ? bracket1[0].current_round : bracket2[0].current_round
    if(minRound < 3){
        let bracket1Remaining = midRoundSim(bracket1, minRound, simulateHelpers)
        let bracket2Remaining = midRoundSim(bracket2, minRound, simulateHelpers)
        if(minRound == 1){
            let bracket1Champ = simulateHelpers.Series(bracket1Remaining[0], bracket1Remaining[1], 7, 104, 2, false, 0)
            let bracket2Champ = simulateHelpers.Series(bracket1Remaining[0], bracket1Remaining[1], 7, 104, 2, false, 0)
            playoffFunctions([bracket1Champ, bracket2Champ], simulateHelpers, true, 3)
        }else{
            playoffFunctions([bracket1Remaining[0], bracket2Remaining[0]], simulateHelpers, true, 3)
        }
            playoffFunctions[104]([bracket1[0]])
    }
}

const nhlConferenceBrackets = (conference) => {
    let division_1 = conference[0].division //this is one of the two divisions
    //create an array of all the teams in each division
    let list_division_1 = conference.filter(team => team.division === division_1)
    let list_division_2 = conference.filter(team => team.division != division_1)
    //create two bracket halves
    let bracket_1 = list_division_1.slice(0,3)
    let bracket_2 = list_division_2.slice(0,3)
    //find two wildcards
    let potential_wildcards = simulateHelpers.moreWins(list_division_1[3], list_division_2[3])
    let potential_second_wildcard = potential_wildcards[0]===list_division_1[3] ? simulateHelpers.moreWins(potential_wildcards[1],list_division_1[4]): simulateHelpers.moreWins(potential_wildcards[0], list_division_2[4])
    bracket_1.push(potential_second_wildcard[0])
    bracket_2.push(potential_wildcards[0])

    return [bracket_1, bracket_2]
}

//would this work if it were already the finals? I don't think so
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

    let eliminated_teams = buildCurrentPlayoffResults(playoffTeams, pastPlayoffGames, 4, 4)

    let nbaWestChamp = playoffSimMidPlayoffs(nbaWestTeams, eliminated_teams, playoffGamesScheduled, simulateHelpers, playoffFunctions, 101)

    let nbaEastChamp = playoffSimMidPlayoffs(nbaEastTeams, eliminated_teams, playoffGamesScheduled, simulateHelpers, playoffFunctions, 101)

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

function playoffSimMidPlayoffs(conferenceTeams, eliminated_teams, new_games_upcoming, simulateHelpers, playoffFunctions, sport_id) {
    let conferenceTeamsRemaining = conferenceTeams.filter(team => {
        return !(eliminated_teams.includes(team))
    })
    conferenceTeamsRemaining.sort((a, b) => { return a.current_round - b.current_round; });
    let min_round = conferenceTeamsRemaining[0].current_round;
    let max_round = min_round+1
    conferenceTeamsRemaining.sort((a, b) => { return a.playoff_seed - b.playoff_seed; });
    //look at games scheduled to figure out opponent. if no games scheduled, than it is waiting
    new_games_upcoming.forEach(game => {
        game.home.playoff_opponent = game.away;
        game.away.playoff_opponent = game.home;
    })
    let newTeamsLeft = midRoundSim(conferenceTeamsRemaining, min_round, simulateHelpers, newTeamsLeft);
    newTeamsLeft.forEach(team =>{
        team.printTeam()
    })


    newTeamsLeft.sort((a, b) => { return b.playoff_seed - a.playoff_seed; });
    let conferenceChamp = playoffFunctions[sport_id](newTeamsLeft, simulateHelpers, true, max_round);

    return conferenceChamp
}

const playoffSimFunctions = {
    101: NBAPlayoffSim,
    102: NHLPlayoffSim
}

module.exports = playoffSimFunctions
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

