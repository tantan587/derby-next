const playoffFunctions = require('./playoffFunctions.js')

const MLB_margin_mod = (margin, elo_difference) =>
{
    var a = Math.pow(elo_difference,3)*(5.46554876)*Math.pow(10,-8)
    var b = Math.pow(elo_difference,2)*(8.96073139)*Math.pow(10,-6)
    var c = (elo_difference)*(2.44895265)*Math.pow(10,-3)
    var expMargin = a + b + c + 3.4
    var adjMargin = Math.pow((Math.abs(margin)+1),.7)*1.41
    return (adjMargin / expMargin)
} 

const NFL_margin_mod = (margin, elo_difference) =>
{
    return Math.log(Math.abs(margin)+1, Math.E) * 2.2/((elo_diffence)*.001 + 2.2)
}

const NBA_margin_mod = (margin, elo_difference) =>
{
    return (pow((margin+3),0.8))/(7.5+0.006*elo_difference)
}

const NHL_margin_mod = (margin, elo_difference) =>
{
    return Math.log(Math.abs(margin - (.85 * (elo_difference/100))) + Math.E - 1)
}

const CFB_margin_mod = (margin, elo_difference) => 
{
    return 1 //tbd - not done yet
}

const CBB_margin_mod = (margin, elo_difference) => 
{
    return 1 //tbd - not done yet
}

const EPL_margin_mod = (margin, elo_difference) => 
{
    return 1 //tbd - not done yet
}

var leagues = {
    101: {sport_name: 'NBA', elo_adjust: 20, MOVmod: NBA_margin_mod, home_advantage: 100, playoffFunction: playoffFunctions.simulateNBAConferencePlayoffs, conferences: ['10101', '10102']},
    102: {sport_name: 'NFL', elo_adjust: 20, MOVmod: NFL_margin_mod, home_advantage: 65, playoffFunction: playoffFunctions.simulateAndFindSBTeams, conferences: ['10201', '10202']},
    103: {sport_name: 'MLB', elo_adjust: 4, MOVmod: MLB_margin_mod, home_advantage: 24, playoffFunction: playoffFunctions.simulateAndFindWSTeams, conferences: ['10301', '10302']},
    104: {sport_name: 'NHL', elo_adjust: 8, MOVmod: NHL_margin_mod, home_advantage: 35, playoffFunction: playoffFunctions.simulateNHLconf},
    105: {sport_name: 'CFB', elo_adjust: 30, MOVmod: CFB_margin_mod, home_advantage: 85, playoffFunction: playoffFunctions.simulateCFBconf},
    106: {sport_name: 'CBB', elo_adjust: 35, MOVmod: CBB_margin_mod, home_advantage: 50, playoffFunction: playoffFunctions.simulateCBBconf},
    107: {sport_name: 'EPL', elo_adjust:'TBD', MOVmod: EPL_margin_mod, home_advantage: 'TBD', playoffFunction: playoffFunctions.simulateEPLconf}
    }


/* const simulateGame = (home, away, sport_id, neutral = false) => 
{   //need to add adjustment in this function for playoffs, neutral games
    let home_advantage = neutral === false ? leagues[sport_id].home_advantage:0
    let elo_difference = home.elo - away.elo + home_advantage
    let home_win_percentage = 1/(Math.pow(10,(-1*elo_difference/400))+1)
    let random_number = Math.random()
    let home_win_value = random_number < home_win_percentage ? 1:0
    home.adjustEloWins(home_win_value, home_win_percentage, leagues[sport_id].elo_adjust)
    away.adjustEloWins(Math.abs(1-home_win_value), 1 - home_win_percentage, leagues[sport_id].elo_adjust)
    let results = home_win_value === 1 ?[home, away]:[away,home]
    return results
    
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
*/
module.exports = leagues