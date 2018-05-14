const eloHelpers = require('./elo_helpers.js')
 
class Team {
    constructor(name, league_id, elo, wins, losses, division, conference, sport_id, team_id){
        //preceding letter indicates use:
        //o means original, for resetting (also use default for that)
        //t means total, to keep track over time
        //a means average, for using to calculate average points and average values
        //p means playoffs, without p stands for regular season
        this.team_id = team_id
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
        this.original_wins = wins
        this.original_losses = losses
        this.total_wins = 0
        this.total_losses = 0
        this.total_playoff_wins = [0, 0, 0, 0, 0]
        this.total_playoff_losses = [0, 0, 0, 0, 0]
        this.playoff_wins = [0, 0, 0, 0, 0] //this is wins in each round of playoffs
        this.playoff_losses = [0, 0, 0, 0, 0] //this is losses in each round of playoffs
        this.playoff_appearances = 0
        this.finalist = 0
        this.champions = 0
        this.average_wins = 0
        this.average_losses = 0
        //this.average_playoff_wins = []
        this.average_playoff_appearances = 0
        this.average_finalists = 0
        this.average_champions = 0
        this.cTWins = 0
        this.aLosses = 0
        this.wOnePoints = 0 //Derby Points accrued in a single season
        this.totalPApp = 0
        this.totalChamp = 0
        this.totalFin = 0
    }
        
    get string (){
        return this.name}

    adjustEloWins(win_value, win_percentage, elo_adjust){
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
        this.total_wins += this.wins
        this.total_losses += this.losses
        //this.cTWins *= (2/3)
        //this.pWins += this.cTWins
        for(var x=0; x<5; x++){
            this.total_playoff_wins[x] += this.playoff_wins[x]
            this.total_playoff_losses[x] += this.playoff_losses[x]
        }
        this.wins = this.original_wins
        this.losses = this.original_losses
        this.elo = this.defaultElo
        this.playoff_wins = [0, 0, 0, 0, 0]
        this.playoff_losses = [0, 0, 0, 0, 0]
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
        this.average_wins = (this.total_wins / sims)
        //this.aPWins = (this.tpWins / sims)
        this.average_playoff_wins = this.total_playoff_wins.map(wins => wins/sims)
        this.average_playoff_appearances = this.playoff_appearances / sims
        this.average_finalists = (this.finalist / sims)
        this.average_champions = (this.champions / sims)
        //this.aTies = (this.tTies / sims)
        this.average_losses = (this.total_losses / sims)
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

module.exports = Team