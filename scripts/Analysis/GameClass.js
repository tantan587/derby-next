const simulateHelpers = require('./simulateHelpers.js')
const points = require('./points.js')

class Game{
    constructor(global_game_id, home, away, sport_id){
        this.global_game_id = global_game_id
        this.home = home
        this.away = away
        this.home_result = 0
        this.away_result = 0
        this.sport_id = sport_id
        //this.day = day
        this.all_simulate_results = {home: {wins: 0, losses: 0, ties: 0},  away: {wins: 0, losses: 0, ties: 0}}
        this.last_result = {home: {wins: 0, losses: 0, ties: 0},  away: {wins: 0, losses: 0, ties: 0}}
        this.EOS_results = {home: {win: {regular: {wins: 0, losses: 0, ties: 0}, 
                        playoffs: {wins: 0, losses: 0, 
                        playoff_appearance: 0, finalist: 0, champions: 0}},loss: {regular: {wins: 0, losses: 0, ties: 0}, 
                        playoffs: {wins: 0, losses: 0, 
                        playoff_appearance: 0, finalist: 0, champions: 0}}},
                        away: {win: {regular: {wins: 0, losses: 0, ties: 0}, 
                        playoffs: {wins: 0, losses: 0, 
                        playoff_appearance: 0, finalist: 0, champions: 0}},loss: {regular: {wins: 0, losses: 0, ties: 0}, 
                        playoffs: {wins: 0, losses: 0, 
                        playoff_appearance: 0, finalist: 0, champions: 0}}}} //this is not done - need to figure out impact in this
        this.raw_impact = {home: {}, away: {}}
        this.home_win_percentage = 0
        this.away_win_percentage = 0
        this.hard_impact = 0
        
    }
    
    play_game(){
    //need to add adjustment in this function for playoffs, neutral games
    //console.log("2:", simulateHelpers)
    let results = simulateHelpers.simulateGame(this.home, this.away, this.sport_id)
    if(results[0]===this.home){
        this.all_simulate_results.home.wins += 1
        this.all_simulate_results.away.losses += 1
        this.last_result.home.wins++
        this.last_result.away.losses++
    }else{
        this.all_simulate_results.home.losses += 1
        this.all_simulate_results.away.wins += 1
        this.last_result.away.wins++
        this.last_result.home.losses++
    }
    }

    play_CBB_game(){
        //need to add adjustment in this function for playoffs, neutral games
        let results = simulateHelpers.simulateGame(this.home, this.away, this.sport_id)
        if(results[0]===this.home){
            this.all_simulate_results.home.wins += 1
            this.all_simulate_results.away.losses += 1
            this.last_result.home.wins++
            this.last_result.away.losses++
            this.home.cbb_rpi_WL.wins += .6
            this.away.cbb_rpi_WL.losses += .6
            this.home.cbb_teams_played.home_wins.push(away)
            this.away.cbb_teams_played.away_losses.push(home)
        }else{
            this.all_simulate_results.home.losses += 1
            this.all_simulate_results.away.wins += 1
            this.last_result.away.wins++
            this.last_result.home.losses++
            this.home.cbb_rpi_WL.losses += 1.4
            this.away.cbb_rpi_WL.wins += 1.4
            this.home.cbb_teams_played.home_losses.push(away)
            this.away.cbb_teams_played.away_wins.push(home)
        }
        this.home.cbb_all_teams_played.push(away)
        this.away.cbb_all_teams_played.push(home)
        }

    play_NHL_game(){
        //need to add adjustment in this function for playoffs, neutral games
        let results = simulateHelpers.simulateNHLGame(this.home, this.away)
        if(results[0]===1){
            this.all_simulate_results.home.wins ++
            this.last_result.home.wins++
        }else if(results[0] === .5){
            this.all_simulate_results.home.ties ++
            this.last_result.home.ties++
        }else{
            this.all_simulate_results.losses++
            this.last_result.home.losses++
        }

        results[1] === 1 ? (
            this.all_simulate_results.away.wins++, this.last_result.away.wins++
        ) : results[1] === .5 ? (
            this.all_simulate_results.away.ties++, this.last_result.away.ties++
        ) : (
            this.all_simulate_results.away.losses++, this.last_result.away.losses++
        )
        }
        
    play_EPL_game(){
        let home_win_value = simulateHelpers.simulateEPLGame(this.home, this.away)
        home_win_value === 0 ? (
            this.all_simulate_results.away.wins++, this.last_result.away.wins++, 
            this.all_simulate_results.home.losses++, this.last_result.home.losses++
        ) : home_win_value === .5 ? (
            this.all_simulate_results.away.ties++, this.last_result.away.ties++,
            this.all_simulate_results.home.ties++, this.last_result.home.ties++
        ) : (
            this.all_simulate_results.away.losses++, this.last_result.away.losses++,
            this.all_simulate_results.home.wins++, this.last_result.home.wins++
        )
        }

    cbb_add_to_elo_array(){
        if(last_result.home.wins === 1){
            home.cbb_elo_wins.push(away.elo)
            away.cbb_elo_losses.push(home.elo)
        }else{
            home.cbb_elo_losses.push(away.elo)
            away.cbb_elo_wins.push(home.elo)
        }
    }
    
    adjustImpact(){
        if(this.last_result.home.wins === 1){
            this.adjustEndOfSeasonResults('home','win')
            this.adjustEndOfSeasonResults('away','loss')
        }else if(this.last_result.away.wins===1){
            this.adjustEndOfSeasonResults('home', 'loss')
            this.adjustEndOfSeasonResults('away','win')
        }
        this.last_result = {home: {wins: 0, losses: 0, ties: 0},  away: {wins: 0, losses: 0, ties: 0}}
    }

    adjustEndOfSeasonResults(team, result){
        let team_affected = team === 'home' ? this.home:this.away
        this.EOS_results[team][result].regular.wins += team_affected.wins
        this.EOS_results[team][result].regular.losses += team_affected.losses
        this.EOS_results[team][result].regular.ties += team_affected.ties
        this.EOS_results[team][result].playoffs.losses = team_affected.playoff_losses.reduce((a,b)=> a+b)
        this.EOS_results[team][result].playoffs.wins = team_affected.playoff_wins.reduce((a,b)=> a+b)
        this.EOS_results[team][result].playoffs.playoff_appearance += team_affected.playoff_appearances
        this.EOS_results[team][result].playoffs.finalist += team_affected.finalist
        this.EOS_results[team][result].playoffs.champions += team_affected.champions
    }

    adjustImpactWithAllSims(){
        let total_home_wins = this.all_simulate_results.home.wins
        //console.log(total_home_wins)
        let total_home_losses = this.all_simulate_results.home.losses
        //console.log(total_home_losses)
        let total_away_wins = this.all_simulate_results.away.wins
        let total_away_losses = this.all_simulate_results.away.losses
        this.adjustImpactPartial('home', 'win', total_home_wins)
        this.adjustImpactPartial('home', 'loss',total_home_losses)
        this.adjustImpactPartial('away', 'win', total_away_wins)
        this.adjustImpactPartial('away', 'loss', total_away_losses)
        this.home_win_percentage = Math.round(total_home_wins/(total_home_losses+total_home_wins)*100)/100
        this.away_win_percentage = Math.round(total_away_wins/(total_away_wins+total_away_losses)*100)/100
    }

    adjustImpactPartial(team, result, divisor) {
        this.EOS_results[team][result].regular.wins /= divisor
        this.EOS_results[team][result].regular.losses /= divisor
        this.EOS_results[team][result].regular.ties /= divisor
        this.EOS_results[team][result].playoffs.wins /= divisor
        this.EOS_results[team][result].playoffs.losses /= divisor
        this.EOS_results[team][result].playoffs.playoff_appearance /= divisor
        this.EOS_results[team][result].playoffs.finalist /= divisor
        this.EOS_results[team][result].playoffs.champions /= divisor
    }

    calculateRawImpact(){
        let camila = 0 
        this.adjustImpactWithAllSims()
        //console.log(this.EOS_results.home.win.regular)
        this.calculateRawImpactTeam('home')
        this.calculateRawImpactTeam('away')
        let points_home_win = this.calculateRawPointsImpactByTeam('home', 'win')
        let points_home_loss = this.calculateRawPointsImpactByTeam('home', 'loss')
        let points_away_win = this.calculateRawPointsImpactByTeam('away', 'win')
        let points_away_loss = this.calculateRawPointsImpactByTeam('away', 'loss')
        this.hard_impact = (points_home_win-points_home_loss)*(points_away_win-points_away_loss)
        this.hard_impact === NaN ? (
            console.log(points_home_win, points_away_win, points_home_loss, points_away_loss),
            process.exit()
        ):0
    }

    calculateRawImpactTeam(team){
        //these two below create two new arrays. One is an array of the difference between wins and losses for regular season: the other is the difference between wins and losses for postseason.
        let regular_impact = Object.keys(this.EOS_results[team]['win'].regular).map(result => 
            this.EOS_results[team]['win'].regular[result] - this.EOS_results[team]['loss'].regular[result]
        )
        let playoff_impact = Object.keys(this.EOS_results[team]['win'].playoffs).map(result => 
            this.EOS_results[team]['win'].playoffs[result] - this.EOS_results[team]['loss'].playoffs[result]
        )
        let raw_impact_array = [...regular_impact, ...playoff_impact]
        let impact_keys = ["win", "losses", "tie", "playoff_wins", "playoff_losses", "playoff_appearences", "finalists", "champions"]
        let index = 0
        let impact_for_JSON = {
            win: raw_impact_array[0],
            loss: raw_impact_array[1],
            tie: raw_impact_array[2],
            playoff_wins: raw_impact_array[3],
            playoff_losses: raw_impact_array[4],
            playoff_appearences: raw_impact_array[5],
            finalist: raw_impact_array[6],
            champions: raw_impact_array[7]
        } 
        this.raw_impact[team] = JSON.stringify(impact_for_JSON)
        //console.log(this.raw_impact[team])
        //JSON.stringify(this.raw_impact_array)
        //afterwards, above should be adjusted based upon point structure to get raw impact. For now, using a base calculation to approximate - may build in individual point values later, or just keep the two arrays, and have it adjusted when uploaded for each league
        //think it is better as concatenated arrays, and then to adjust for point values later
        //if Yoni thinks, will put it into an object from array
    }

    calculateRawPointsImpactByTeam(team, result){
        let regular_wins = this.EOS_results[team][result].regular.wins
        let bonus_win = regular_wins < points.baseball.bonus_1 ? 0 :
            regular_wins < points.baseball.bonus_2 ? 15 :
            regular_wins < points.baseball.bonus_3 ? 30 : 45
        let win_points = (
            this.EOS_results[team][result].regular.wins * points.baseball.win + 
            this.EOS_results[team][result].playoffs.playoff_appearance * points.bonus.playoff_appearance +
            this.EOS_results[team][result].playoffs.finalist * points.bonus.finalist +
            this.EOS_results[team][result].playoffs.champions * points.bonus.champions +
            this.EOS_results[team][result].playoffs.wins * points.baseball.playoff_win +
            bonus_win
        )
        return win_points
    }
}




module.exports = Game