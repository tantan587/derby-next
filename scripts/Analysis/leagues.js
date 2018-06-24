
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
    return Math.log(Math.abs(margin)+1, Math.E) * 2.2/((elo_difference)*.001 + 2.2)
}

const NBA_margin_mod = (margin, elo_difference) =>
{
    return (Math.pow((Math.abs(margin)+3),0.8))/(7.5+0.006*elo_difference)
}

const NHL_margin_mod = (margin, elo_difference) =>
{
    return Math.log(Math.abs(margin - (.85 * (elo_difference/100))) + Math.E - 1)
}

const CFB_margin_mod = (margin, elo_difference) => 
{
    //same as NFL currently - maybe should eventually be changed
    return Math.log(Math.abs(margin)+1, Math.E) * 2.2/((elo_difference)*.001 + 2.2) //tbd - not done yet
}

const CBB_margin_mod = (margin, elo_difference) => 
{
    //using the same as NBA for now - may change later
    return (Math.pow((Math.abs(margin)+3),0.8))/(7.5+0.006*elo_difference)
}

const EPL_margin_mod = (margin, elo_difference) => 
{
    
    //ΔElo_margin = ΔElo_1goal * sqrt(margin), where
    //ΔElo_1goal = ΔElo_1X2 / sum(sqrt(margin)*p_margin/p_1X2)
    return 1 //tbd - not done yet
}

//object with base information for each league
const leagues = {
    101: {sport_name: 'NBA', elo_adjust: 20, MOVmod: NBA_margin_mod, home_advantage: 100, conferences: ['10101', '10102']},
    102: {sport_name: 'NFL', elo_adjust: 20, MOVmod: NFL_margin_mod, home_advantage: 65, conferences: ['10201', '10202']},
    103: {sport_name: 'MLB', elo_adjust: 4, MOVmod: MLB_margin_mod, home_advantage: 24, conferences: ['10301', '10302']},
    104: {sport_name: 'NHL', elo_adjust: 8, MOVmod: NHL_margin_mod, home_advantage: 35, conference: ['10401', '10402']},
    105: {sport_name: 'CFB', elo_adjust: 30, MOVmod: CFB_margin_mod, home_advantage: 85},
    106: {sport_name: 'CBB', elo_adjust: 35, MOVmod: CBB_margin_mod, home_advantage: 50},
    107: {sport_name: 'EPL', elo_adjust: 20, MOVmod: EPL_margin_mod, home_advantage: 'TBD'}
    }

module.exports = leagues