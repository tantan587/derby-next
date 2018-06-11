const fantasyHelpers = require('../../server/routes/helpers/fantasyHelpers')
const leagues = require('./leagues.js')
//const league = require('./leagues.js')

//Function to simulate an entire series - round is what round of the playoffs this is (1,2,3, etc.)
const Series = (home, away, games, sport_id, round, neutral=false) => {
    round--
    let clinch = Math.ceil(games/2)
    let homeGames = [0,1,4,6]
    let roadGames = [2,3,5]
    let x = 0
    //console.log(round)
    while(home.playoff_wins[round] < clinch && away.playoff_wins[round] < clinch){
        let results = homeGames.includes(x) ? simulateGame(home, away, sport_id, neutral):simulateGame(away, home, sport_id, neutral)
        results[0].playoff_wins[round]++
        x++
    }
    if(home.playoff_wins[round] === clinch){
        return home
    } else{
        return away
    }
}

//tells you which team has more Wins between two, returns them as array
const moreWins = (team_a, team_b) => {
    let teams = team_a.wins > team_b.wins ? [team_a,team_b]:[team_b,team_a]
    return teams
}

//nhl tie percentage is .23
const simulateGame = (home, away, sport_id, neutral = false) => 
{   //need to add adjustment in this function for playoffs, NHL
    let home_adv = neutral === false ? leagues[sport_id].home_advantage:0
    let elo_difference = home.elo - away.elo + home_adv
    let home_win_percentage = 1/(Math.pow(10,(-1*elo_difference/400))+1)
    let random_number = Math.random()
    let home_win_value = random_number < home_win_percentage ? 1:0
    /*if reg == True:
        home.adjRWins(homeWin)
        away.adjRWins(awayWin)
    else:
        home.adjPWins(homeWin)
        away.adjPWins(awayWin)*/
    home.adjustEloWins(home_win_value, home_win_percentage, leagues[sport_id].elo_adjust)
    away.adjustEloWins(Math.abs(1-home_win_value), 1 - home_win_percentage, leagues[sport_id].elo_adjust)
    let results = home_win_value === 1 ?[home, away]:[away,home]
    return results
    
    //return [home_win_value, Math.abs(1-home_win_value)]
}

const simulateNHLGame = (home, away, neutral = false) => 
{   //need to add adjustment in this function for playoffs
    let home_adv = neutral === false ? leagues['104'].home_advantage:0
    let elo_difference = home.elo - away.elo + home_adv
    let home_win_percentage = 1/(Math.pow(10,(-1*elo_difference/400))+1)
    let random_number = Math.random()
    //in NHL, teams can tie.
    let tie_percentage = .23
    let home_win_no_OT = home_win_percentage - tie_percentage/2
    let away_win_in_OT = home_win_percentage + tie_percentage/2
    //ELO assumes an overtime loss and overtime win is the same as a tie. 
    let home_win_value_ELO = random_number < home_win_no_OT ? 1 : random_number < away_win_in_OT ? .5 : 0
    //this calculates the values for standings, giving .5 for OT loss
    let home_win_value_standings = home_win_value_ELO != .5 ? home_win_value_ELO : random_number < home_win_percentage ? 1:.5
    home.adjustEloWins(home_win_value_ELO, home_win_percentage, leagues['107'].elo_adjust)
    away.adjustEloWins(Math.abs(1-home_win_value_ELO), 1 - home_win_percentage, leagues['107'].elo_adjust)
    return home_win_value_ELO
    
    //return [home_win_value, Math.abs(1-home_win_value)]
}

const simulateEPLGame = (home, away) => 
{   //need to add adjustment in this function for playoffs
    let home_adv = leagues['107'].home_advantage
    let elo_difference = home.elo - away.elo + home_adv
    let home_win_percentage_raw = 1/(Math.pow(10,(-1*elo_difference/400))+1)
    let random_number = Math.random()
    //EPL: teams just straight up tie.
    let tie_percent = .23  //how often teams in the EPL tie
    let home_win_percentage = home_win_percentage_raw - tie_percent/2
    let tie_percentage = home_win_percentage_raw + tie_percent/2
    //ELO assumes an overtime loss and overtime win is the same as a tie. 
    let home_win_value = random_number < home_win_percentage ? 1 : random_number < tie_percentage ? .5 : 0
    home.adjustEloWins(home_win_value, home_win_percentage_raw, leagues['107'].elo_adjust)
    away.adjustEloWins(Math.abs(1-home_win_value), 1 - home_win_percentage_raw, leagues['107'].elo_adjust)
    let away_win_value_standings = home_win_value != 1 ? 1: home_win_value_ELO === .5 ? .5:0
    let results = [home_win_value, away_win_value_standings]
    return results
    
    //return [home_win_value, Math.abs(1-home_win_value)]
}

const updateProjections = (teams) => {
    let rows = teams.map(team => {
        //let playoff_json = JSON.stringify({wins: team.average_playoff_wins, playoffs: team.average_playoff_appearances, finalists: team.average_finalists, champions: team.average_champions})
        //console.log(playoff_json)
        return {team_id: team.team_id, wins: team.average_wins,
             losses: team.average_losses, ties: 0, day_count: 1, 
             playoff: {wins: team.average_playoff_wins, playoffs: team.average_playoff_appearances, finalists: team.average_finalists, champions: team.average_champions}}
    })
    console.log(rows.length)
    return rows
   /*  return knex
        .withSchema('analysis')
        .table('record_projections')
        .insert(rows) */
    }

const insertProjections = (knex, rows) => {
    return knex
    .withSchema('analysis')
    .table('record_projections')
    .insert(rows)
}


module.exports = {Series, moreWins, simulateGame, updateProjections, simulateNHLGame}