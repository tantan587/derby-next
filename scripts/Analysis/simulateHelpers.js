const fantasyHelpers = require('../../server/routes/helpers/fantasyHelpers')

//Function to simulate an entire series - round is what round of the playoffs this is (1,2,3, etc.)
const Series = (home, away, games, sport_id, round, neutral=false) => {
    round--
    let clinch = Math.ceil(games/2)
    let homeGames = [0,1,4,6]
    let roadGames = [2,3,5]
    let x = 0
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

const moreWins = (team_a, team_b) => {
    let teams = team_a.wins > team_b.wins ? [team_a,team_b]:[team_b,team_a]
    return teams
}

const simulateGame = (home, away, sport_id, neutral = false) => 
{   //need to add adjustment in this function for playoffs, neutral games
    let home_advantage = neutral === false ? leagues[sport_id].home_advantage:0
    let elo_difference = home.elo - away.elo + home_advantage
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

const arraySum = arr => arr.reduce((a,b) => a+b,0)


const updateProjections = (knex, teams) => {
    let rows = teams.map(team => {
        playoff_wins = arraySum(team.average_playoff_wins)
        return {team_id: team.team_id, wins: team.average_wins,
             losses: team.average_losses, ties: 0, day_count: 1, 
             playoff: {wins: playoff_wins, playoffs: team.average_playoff_appearances, finalists: team.average_finalists, champions: team.average_champions}}
    })
    return knex
        .withSchema('analysis')
        .table('record_projections')
        .insert(rows)
}


const dayCount = (day) => {
    var dd = day.getDate();
    var mm = day.getMonth()+1; //January is 0!
    var yyyy = day.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    } 

    if(mm<10) {
        mm = '0'+mm
    } 
    return fantasyHelpers.getDayCount(yyyy, mm, dd)

}

module.exports = {Series, moreWins, simulateGame, updateProjections, dayCount}