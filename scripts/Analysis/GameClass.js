const simulateHelpers = require('./simulateHelpers.js')


class Game{
    constructor(global_game_id, home, away, sport_id, sport_season_id, year, home_result=0, away_result=0){
        this.global_game_id = global_game_id
        this.home = home
        this.away = away
        this.home_result = home_result
        this.away_result = away_result
        this.sport_id = sport_id
        this.sport_season_id = sport_season_id
        this.year = year
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
        this.adjusted_impact = 0
        
    }

    print_game(){
        console.log(`${this.home.name} ${this.home_result}, ${this.away.name} ${this.away_result}`)
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
            this.home.cbb_teams_played.home_wins.push(this.away)
            this.away.cbb_teams_played.away_losses.push(this.home)
        }else{
            this.all_simulate_results.home.losses += 1
            this.all_simulate_results.away.wins += 1
            this.last_result.away.wins++
            this.last_result.home.losses++
            this.home.cbb_rpi_WL.losses += 1.4
            this.away.cbb_rpi_WL.wins += 1.4
            this.home.cbb_teams_played.home_losses.push(this.away)
            this.away.cbb_teams_played.away_wins.push(this.home)
        }
        this.home.cbb_all_teams_played.push(this.away)
        this.away.cbb_all_teams_played.push(this.home)
        }

    play_NHL_game(){
        //the difference is this has ties. Instead of returning home/away, this returns home value and away value for standings
        let results = simulateHelpers.simulateNHLGame(this.home, this.away)
        if(results[0]===1){
            this.all_simulate_results.home.wins ++
            this.last_result.home.wins++
            this.home.wins++
        }else if(results[0] === .5){
            this.all_simulate_results.home.ties ++
            this.last_result.home.ties++
            this.home.ties++
        }else{
            this.all_simulate_results.home.losses++
            this.last_result.home.losses++
            this.home.losses++
        }

        results[1] === 1 ? (
            this.all_simulate_results.away.wins++, this.last_result.away.wins++, this.away.wins++
        ) : results[1] === .5 ? (
            this.all_simulate_results.away.ties++, this.last_result.away.ties++, this.away.ties++
        ) : (
            this.all_simulate_results.away.losses++, this.last_result.away.losses++, this.away.losses++
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
        let total_home_wins = this.all_simulate_results.home.wins === 0 ? 1 : this.all_simulate_results.home.wins
        //console.log(total_home_wins)
        let total_home_losses = this.all_simulate_results.home.losses === 0 ? 1 : this.all_simulate_results.home.losses
        //console.log(total_home_losses)
        let total_away_wins = this.all_simulate_results.away.wins === 0 ? 1 : this.all_simulate_results.away.wins
        let total_away_losses = this.all_simulate_results.away.losses=== 0 ? 1 : this.all_simulate_results.away.losses
        this.adjustImpactPartial('home', 'win', total_home_wins)
        this.adjustImpactPartial('home', 'loss',total_home_losses)
        this.adjustImpactPartial('away', 'win', total_away_wins)
        this.adjustImpactPartial('away', 'loss', total_away_losses)
        this.home_win_percentage = Math.round(total_home_wins/(total_home_losses+total_home_wins + this.all_simulate_results.home.ties)*100)/100
        this.away_win_percentage = Math.round(total_away_wins/(total_away_wins+total_away_losses + this.all_simulate_results.away.ties)*100)/100
        if(this.away_win_percentage == 1){
            console.log(this)
            process.exit()
        }
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

    calculateRawImpact(pointsObject){
        this.adjustImpactWithAllSims()
        //console.log(this.EOS_results.home.win.regular)
        //below is the old way, which would create an impact json to put in to the db. 
        //Now we are using a number instead, which is the calculate raw points
        // this.calculateRawImpactTeam('home')
        // this.calculateRawImpactTeam('away')
        let points_home_win = this.calculateRawPointsImpactByTeam('home', 'win', pointsObject)
        let points_home_loss = this.calculateRawPointsImpactByTeam('home', 'loss', pointsObject)
        let points_away_win = this.calculateRawPointsImpactByTeam('away', 'win', pointsObject)
        let points_away_loss = this.calculateRawPointsImpactByTeam('away', 'loss', pointsObject)
        let unround_impact = (points_home_win-points_home_loss)*(points_away_win-points_away_loss)
        this.hard_impact === NaN ? (
            console.log(points_home_win, points_away_win, points_home_loss, points_away_loss),
            process.exit()
        ):0
        this.hard_impact = Math.round(unround_impact*100)/100
    }

    calculateRawPointsImpactByTeam(team, result, pointsObject){
        let sport_id = this.sport_id
        //setting point structure for impact to be 1, default
        //since we now have so much sport structure info, this can be used in the 
        let points = pointsObject[1]
        let regular_wins = this.EOS_results[team][result].regular.wins
        let milestone_wins = sport_id === '104' ? regular_wins + (this.EOS_results[team][result].regular.ties/2) : regular_wins
        let milestone_points = points[sport_id].regular_season.milestone_points
        let bonus_win = sport_id === ('103'||'104') ? milestone_wins < points[sport_id].regular_season.milestones[0] ? 0 :
            milestone_wins < points[sport_id].regular_season.milestones[1] ? milestone_points :
            milestone_wins < points[sport_id].regular_season.milestones[2] ? milestone_points*2 : milestone_points*3 : 0
        let win_points = (
            this.EOS_results[team][result].regular.wins * points[sport_id].regular_season.win + 
            this.EOS_results[team][result].playoffs.playoff_appearance * points[sport_id].bonus.appearance +
            this.EOS_results[team][result].playoffs.finalist * points[sport_id].bonus.finalist +
            this.EOS_results[team][result].playoffs.champions * points[sport_id].bonus.championship +
            this.EOS_results[team][result].playoffs.wins * points[sport_id].playoffs.win +
            this.EOS_results[team][result].regular.ties * points[sport_id].regular_season.tie +
            bonus_win
        )
        
        return win_points
    }
}




module.exports = Game