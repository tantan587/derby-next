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
    101: {sport_name: 'NBA', elo_adjust: 20, MOVmod: NBA_margin_mod, home_advantage: 100},
    102: {sport_name: 'NFL', elo_adjust: 20, MOVmod: NFL_margin_mod, home_advantage: 65},
    103: {sport_name: 'MLB', elo_adjust: 4, MOVmod: MLB_margin_mod, home_advantage: 24},
    104: {sport_name: 'NHL', elo_adjust: 8, MOVmod: NHL_margin_mod, home_advantage: 35},
    105: {sport_name: 'CFB', elo_adjust: 30, MOVmod: CFB_margin_mod, home_advantage: 85},
    106: {sport_name: 'CBB', elo_adjust: 35, MOVmod: CBB_margin_mod, home_advantage: 50},
    107: {sport_name: 'EPL', elo_adjust:'TBD', MOVmod: EPL_margin_mod, home_advantage: 'TBD'}
    }



const simulateGame = (home, away, sport_id) => 
{   //need to add adjustment in this function for playoffs, neutral games
    let elo_difference = home.elo - away.elo + leagues[sport_id].home_advantage
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

/* const updateProjections = (knex, teams) => {
    let rows = teams.map(team => {

        const playoff_wins = team.average_playoff_wins => team.average_playoff_wins.reduce((a,b) => a + b, 0)
        return {team_id: team.team_id, wins: team.average_wins,
             losses: team.average_losses, ties: 0, day_count: 1, 
             playoff: {wins: playoff_wins, }}



    })
    return knex
        .withSchema('analysis')
        .table('record_projections')

} */
module.exports = {leagues, simulateGame}