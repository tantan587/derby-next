const simulateHelpers = require('./simulateHelpers.js')

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
                        playoffs: {wins: [0, 0, 0, 0, 0, 0, 0], losses: [0, 0, 0, 0, 0, 0, 0], 
                        playoff_appearence: 0, finalist: 0, champions: 0}},loss: {regular: {wins: 0, losses: 0, ties: 0}, 
                        playoffs: {wins: [0, 0, 0, 0, 0, 0, 0], losses: [0, 0, 0, 0, 0, 0, 0], 
                        playoff_appearence: 0, finalist: 0, champions: 0}}},
                        away: {win: {regular: {wins: 0, losses: 0, ties: 0}, 
                        playoffs: {wins: [0, 0, 0, 0, 0, 0, 0], losses: [0, 0, 0, 0, 0, 0, 0], 
                        playoff_appearence: 0, finalist: 0, champions: 0}},loss: {regular: {wins: 0, losses: 0, ties: 0}, 
                        playoffs: {wins: [0, 0, 0, 0, 0, 0, 0], losses: [0, 0, 0, 0, 0, 0, 0], 
                        playoff_appearence: 0, finalist: 0, champions: 0}}}} //this is not done - need to figure out impact in this
        
    }
    
    play_game(){
    //need to add adjustment in this function for playoffs, neutral games
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
            let results = simulateHelpers.simulateNHLGame(this.home, this.away, this.sport_id)
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
        let x = 0
        this.EOS_results[team][result].playoffs.wins.forEach(number => {
            number += team_affected.playoff_wins[x]
            x++
        })
        x=0
        this.EOS_results[team][result].playoffs.losses.forEach(number => {
            number += team_affected.playoff_wins[x]
            x++
        })
        this.EOS_results[team][result].playoffs.playoff_appearence += team_affected.wins
        this.EOS_results[team][result].playoffs.finalist += team_affected.finalist
        this.EOS_results[team][result].playoffs.champions += team_affected.champions



    }

    /*this.homeWinPoints = []
        this.awayWinPoints = []
        this.homeLossPoints = []
        this.awayLossPoints = []
        this.homeTiePoints = []
        this.awayTiePoints = []}*//*
    
    def pointsFromResult(this, homePoints, awayPoints):
        if this.homeR == 1:
            this.homeWinPoints.append(homePoints)
        elif this.homeR == .5:
            this.homeTiePoints.append(homePoints)
        else:
            this.homeLossPoints.append(homePoints)
        if this.awayR == 1:
            this.awayWinPoints.append(awayPoints)
        elif this.awayR == .5:
            this.awayTiePoints.append(awayPoints)
        else:
            this.awayLossPoints.append(awayPoints)

    
    def reset(this):
        this.allHomeR.append(this.homeR)
        this.allAwayR.append(this.awayR)
        this.homeR = 0
        this.awayR = 0
    
    def pointsImpact(this):
        if len(this.homeWinPoints)>0:
            this.avHWinP = sum(this.homeWinPoints)/len(this.homeWinPoints)
        else:
            this.avHWinP = 0
        if len(this.homeLossPoints)>0:
            this.avHLossP = sum(this.homeLossPoints)/len(this.homeLossPoints)
        else:
            this.avHLossP = 0
        if len(this.awayWinPoints)>0:
            this.avAWinP = sum(this.awayWinPoints)/len(this.awayWinPoints)
        else:
            this.avAWinP = 0
        if len(this.awayLossPoints)>0:
            this.avALossP = sum(this.awayLossPoints)/len(this.awayLossPoints)
        else:
            this.avALossP = 0
        if len(this.homeWinPoints)==0 or len(this.homeLossPoints)==0:
            this.homeDiff = 0
        else:
            this.homeDiff = this.avHWinP - this.avHLossP
        if len(this.awayWinPoints)==0 or len(this.awayLossPoints)==0:
            this.awayDiff = 0
        else:
            this.awayDiff = this.avAWinP - this.avALossP
        if len(this.awayTiePoints)>0 and len(this.homeTiePoints)>0:
            this.avHTieP = sum(this.homeTiePoints)/len(this.homeTiePoints)
            this.avATieP = sum(this.awayTiePoints)/ len(this.awayTiePoints)
            avHwl = (this.avHWinP + this.avHLossP)/2
            avAwl = (this.avAWinP + this.avALossP)/2
            HomeTiesMinusAv = this.avHTieP - avHwl
            AwayTiesMinusAv = this.avATieP - avAwl
            this.homeDiff += HomeTiesMinusAv/2
            this.awayDiff += AwayTiesMinusAv/2
        this.impact = this.homeDiff * this.awayDiff
        this.avHomeR = sum(this.allHomeR)/len(this.allHomeR)
        this.avAwayR = sum(this.allAwayR)/len(this.allAwayR)
        
    def play(this, adjE, homeAdvantage, dic):
        results = gameReturn(this.home, this.away, adjE, homeAdvantage, dic)
        this.homeR = results[0]
        this.awayR = results[1]
    
    def playNHL(this, adjE, homeAdvantage, dic, tiePerc):
        results = NHLRegGame(this.home, this.away, adjE, homeAdvantage, dic, tiePerc)
        this.homeR = results[0]
        this.awayR = results[1]
    */}


module.exports = Game