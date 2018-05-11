const eloHelpers = require('./elo_helpers.js')
 
class Team {
    constructor(name, league_id, elo, wins, losses, division, conference, sport_id){
        //preceding letter indicates use:
        //o means original, for resetting (also use default for that)
        //t means total, to keep track over time
        //a means average, for using to calculate average points and average values
        //p means playoffs, without p stands for regular season
        this.name = name
        this.league_id = league_id
        this.elo = Number(elo)
        this.defaultElo = Number(elo)
        this.division = division
        this.conference = conference
        this.wins = wins
        this.losses = losses
        this.sport_id = sport_id
        this.ties = 0
        this.oTies = 0
        this.tTies = 0
        this.oWins = wins
        this.oLosses = losses
        this.tWins = 0
        this.tLosses = 0
        this.tpWins = 0
        this.pWins = 0
        this.pLosses = 0
        this.pApp = 0
        this.finalist = 0
        this.champions = 0
        this.aWins = 0
        this.aPWins = 0
        this.aPApp = 0
        this.aFin = 0
        this.aCha = 0
        this.cTWins = 0
        this.aLosses = 0
        this.wOnePoints = 0 //Derby Points accrued in a single season
        this.totalPApp = 0
        this.totalChamp = 0
        this.totalFin = 0
    }
        
    get string (){
        return this.name}

    adjust_elo_and_wins(win_value, win_percentage, elo_adjust){
        this.elo += ((win_value-win_percentage)*elo_adjust)
        this.wins += win_value
        this.losses += Math.abs(1-win_value)
    }

/*     def adjRWins(this,winVal): #formula to adjust regular season wins by win Value: 1 is 1, 0 is loss
        lVal = abs(winVal - 1)
        this.wins += winVal
        this.losses += lVal
        
    def adjPWins(this,winVal): #formula to adjust regular season wins by win Value: 1 is 1, 0 is loss
        lVal = abs(winVal - 1)
        this.pWins += winVal
        this.pLosses += lVal
        #print(this.pWins) */
    
    reset () {
        //formula used to reset all values back to original, when resetting season
        this.tWins += this.wins
        this.tLosses += this.losses
        //this.cTWins *= (2/3)
        //this.pWins += this.cTWins
        //this.tpWins += this.pWins
        this.wins = this.oWins
        this.losses = this.oLosses
        this.elo = this.defaultElo
        /*this.pWins = 0
        this.pLosses = 0
        this.cTWins = 0
        this.wOnePoints = 0
        this.tTies += this.ties
        this.ties = this.oTies
        this.totalPApp = this.pApp
        this.totalChamp = this.champions
        this.totalFin = this.finalist*/
    }
    
    //Find Averages
    averages(sims){ //find the average of each important value, taking in the amount of sims
        this.aWins = (this.tWins / sims)
        //this.aPWins = (this.tpWins / sims)
        //this.aPApp = (this.pApp / sims)
        //this.aFin = (this.finalist / sims)
        //this.aCha = (this.champions / sims)
        //this.aTies = (this.tTies / sims)
        this.aLosses = (this.tLosses / sims)
    }
    /*
    #formula to find the amount of points, using the averages, for writing to csv    
    def points(this, regWinPoints, playoffWinPoints,  playoffAppPoints, finalPoints, champPoints): 
        this.wPoints = ((this.aPWins * playoffWinPoints) +
                (this.aPApp * playoffAppPoints) +
                (this.aFin*finalPoints) +
                (this.aCha*champPoints) +
                (this.aWins*regWinPoints))
    
    #formula for figuring out how many points were scored in a single season.
    def oneSPoints(this, regWinPoints, playoffWinPoints,  playoffAppPoints, finalPoints, champPoints):
        pApp1 = this.pApp - this.totalPApp #pApp, champ, and finalist are determined cumulatively, so this is to get the value of just what occured this season
        Ch1 = this.champions - this.totalChamp
        Fin1 = this.finalist - this.totalFin
        this.wOnePoints = ((this.pWins * playoffWinPoints) +
                (pApp1 * playoffAppPoints) +
                (Fin1*finalPoints) +
                (Ch1*champPoints) +
                (this.wins*regWinPoints))
    
    #the points for MLB, taking into account the different values for x games and the remaining games
    def MLBpoints(this, regWinPFirst, regWinPSecond, gamesFirst2Second, playoffWinPoints,  playoffAppPoints, finalPoints, champPoints):
        this.wPoints = ((this.aPWins * playoffWinPoints) +
                (this.aPApp * playoffAppPoints) +
                (this.aFin*finalPoints) +
                (this.aCha*champPoints) +
                (gamesFirst2Second*regWinPFirst) +
                ((this.aWins - gamesFirst2Second) * regWinPSecond)) */
}

class Game{
    constructor(global_game_id, home_id, away_id, sport_id){
        this.global_game_id = global_game_id
        this.home_id = home_id
        this.away_id = away_id
        this.home_result = 0
        this.away_result = 0
        this.sport_id = sport_id
        //this.day = day
        this.all_simulate_results = {home: {wins: 0, losses: 0, ties: 0},  away: {wins: 0, losses: 0, ties: 0}}
    }
    
    play_game(all_teams_list){
    //need to add adjustment in this function for playoffs, neutral games
    let results = game_simulate(this.home_id, this.away_id, this.sport_id, all_teams_list)
    if(results[0]===this.home_id){
        this.all_simulate_results.home.wins += 1
        this.all_simulate_results.away.losses += 1
    }else{
        this.all_simulate_results.home.losses += 1
        this.all_simulate_results.away.wins += 1
    }
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

const game_simulate = (home_id, away_id, sport_id, all_teams) => 
{   //need to add adjustment in this function for playoffs, neutral games
    let elo_difference = all_teams[home_id].elo - all_teams[away_id].elo + eloHelpers.leagues[sport_id].home_advantage
    let home_win_percentage = 1/(Math.pow(10,(-1*elo_difference/400))+1)
    let random_number = Math.random()
    let home_win_value = random_number < home_win_percentage ? 1:0
    /*if reg == True:
        home.adjRWins(homeWin)
        away.adjRWins(awayWin)
    else:
        home.adjPWins(homeWin)
        away.adjPWins(awayWin)*/
    all_teams[home_id].adjust_elo_and_wins(home_win_value, home_win_percentage, eloHelpers.leagues[sport_id].elo_adjust)
    all_teams[away_id].adjust_elo_and_wins(Math.abs(1-home_win_value), 1 - home_win_percentage, eloHelpers.leagues[sport_id].elo_adjust)
    let results = home_win_value === 1 ?[home_id, away_id]:[away_id,home_id]
    return results
    
    //return [home_win_value, Math.abs(1-home_win_value)]
}




module.exports = {Game, Team, game_simulate}

