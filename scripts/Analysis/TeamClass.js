//const leagues = require('./leagues.js')
const Points = require('./getPointsStructure.js')
 
class Team {
    constructor(name, sport_id, elo, wins, losses, ties, division, conference, team_id, sport_season_id, year, playoff_wins, playoff_losses, playoff_status){
        this.team_id = team_id
        this.name = name
        //this.league_id = league_id
        this.elo = Number(elo)
        this.defaultElo = Number(elo)
        this.division = division
        this.conference = conference
        this.wins = wins
        this.losses = losses
        this.sport_id = sport_id
        this.sport_season_id = sport_season_id
        this.year = year
        this.ties = ties
        this.original_ties = ties
        this.total_ties = 0
        this.original_wins = wins
        this.original_losses = losses
        this.total_wins = 0
        this.total_losses = 0
        this.total_playoff_wins = playoff_wins
        this.total_playoff_losses = playoff_losses
        this.total_bowl_wins = 0
        this.playoff_wins = [0, 0, 0, 0, 0, 0, 0] //this is wins in each round of playoffs
        this.playoff_losses = [0, 0, 0, 0, 0, 0, 0] //this is losses in each round of playoffs
        this.playoff_appearances = 0
        this.finalist = 0
        this.champions = 0
        this.bowl_wins = 0
        this.average_wins = 0
        this.average_losses = 0
        this.average_ties=0
        this.average_playoff_wins = 0
        this.average_playoff_appearances = 0
        this.average_finalists = 0
        this.average_champions = 0
        this.average_bowl_wins = 0
        this.cTWins = 0
        //this.wOnePoints = 0 //Derby Points accrued in a single season
        this.total_playoff_appearances = 0
        this.total_champions = 0
        this.total_finalists = 0
        this.cfb_value = 0
        this.cbb_value = 0
        this.cbb_elo_wins = []
        this.cbb_elo_losses = []
        this.cbb_rpi_WL = {win: 0, loss: 0}
        this.cbb_rpi_WP = 0 //this is winning percentage for RPI calculation
        this.cbb_opponent_rpi_WP = 0 //this is the opponents in percentage
        this.cbb_rpi_value = 0
        this.cbb_rpi_rank = 0
        this.cbb_all_teams_played = []
        this.cbb_teams_played = {home_wins: [], away_wins: [], home_losses: [], away_losses: [], neutral_wins: [], neutral_losses: []}
        //below for random schedule generator
        this.games_scheduled = 0
        this.home_games_scheduled = 0
        this.away_games_scheduled = 0
        //below is for figuring out projections and rankings -
        //each index of an array is equal to the fantasy scoring type -1
        this.fantasy_points_projected = {}
        this.points_above_last_drafted = {}
        this.points_above_average = {}
        this.stdev_points_above_last_drafted = {}
        this.stdev_points_above_average = {}
        this.rank_above_last = {}
        this.rank_above_average = {}
        this.stdev_rank_above_last = {}
        this.stdev_rank_above_average = {}
        this.overall_ranking = {}
        this.playoff_status = playoff_status
        this.playoff_seed = 0
        this.playoff_seed_options = []
        this.playoff_opponents = {} //playoff opponents by round
        this.current_round = 0
        this.playoff_games_played = [0, 0, 0, 0, 0, 0, 0] //this is games played in each round of playoffs
        this.wins_for_playoff_sorting = 0
    }

    printTeam(){
        let result_for_print = ''
        if(this.champions === 1){
            result_for_print = 'won championship'
        }else if(this.finalist === 1){
            result_for_print = 'made finals'
        }else if(this.playoff_appearances > 0){
            result_for_print = 'made playoffs'
        }else{
            result_for_print = 'missed playoffs'
        }
        console.log(`${this.name} ${result_for_print}`)
        let round = 1
        this.playoff_wins.forEach(win_total => {
            if(win_total > 0){
                console.log(`Won ${win_total} games in round ${round}`)
                round ++
            }
        })
    }
    
    addInitialRpiWL(wins,losses){
        this.cbb_rpi_WL = {win: wins, loss: losses}
    }

    get string (){
        return this.name}

    adjustEloWins(sport_id, win_value, win_percentage, elo_adjust, playoff_game){
        this.elo += ((win_value-win_percentage)*elo_adjust)
        if(playoff_game === false && sport_id !== 104){
            if(sport_id===107 && win_value ===.5){
                this.ties++
            }else{
            this.wins += win_value
            this.losses += Math.abs(1-win_value)
        }
    }
        
    }

    calculateCFBValue(conf_champ_boost){
        let adj_elo = Number(this.elo)/100
        //conf boost gives greater boost to sec teams, and then boost to other major conf. should give boost as well to notre dame - needs to be added in.
        let conf_boost = this.conference === '10505' ? 2: this.conference === ('10501' || '10502'||'10503'||'10504') ? 1: 0
        this.cfb_value = adj_elo + conf_boost + conf_champ_boost + this.wins - (this.losses * 3)
    }

    //formula to calculate cbb_value to determine ncaa tournament value. 
    //should this take into account meaningful away games? 
    //other things not included: strength of schedule, other analytic measures (bpi, pom), conf strength, if won games away from home
    //formula has not yet been tested with past seasons
    calculateCBBValue(){
        let adj_elo = Number(this.elo)/100
        let q1_wins = 0
        let q2_wins = 0
        let q3_wins = 0
        let q4_wins = 0
        let q1_losses = 0
        let q2_losses = 0
        let q3_losses = 0
        let q4_losses = 0
         this.cbb_teams_played.home_wins.forEach(team=>{
            team.cbb_rpi_rank < 31 ? q1_wins++: team.cbb_rpi_rank < 76 ? q2_wins++:team.cbb_rpi_rank<161 ? q3_wins++:q4_wins++
        })
        this.cbb_teams_played.home_losses.forEach(team=>{
            team.cbb_rpi_rank < 31 ? q1_losses++: team.cbb_rpi_rank < 76 ? q2_losses++:team.cbb_rpi_rank<161 ? q3_losses++:q4_losses++
        })
        this.cbb_teams_played.neutral_wins.forEach(team=>{
            team.cbb_rpi_rank < 51 ? q1_wins++: team.cbb_rpi_rank < 101 ? q2_wins++:team.cbb_rpi_rank<201 ? q3_wins++:q4_wins++
        })
        this.cbb_teams_played.neutral_losses.forEach(team=>{
            team.cbb_rpi_rank < 51 ? q1_losses++: team.cbb_rpi_rank < 101 ? q2_losses++:team.cbb_rpi_rank<201 ? q3_losses++:q4_losses++
        })
        this.cbb_teams_played.away_wins.forEach(team=>{
            team.cbb_rpi_rank < 76 ? q1_wins++: team.cbb_rpi_rank < 136 ? q2_wins++:team.cbb_rpi_rank<241 ? q3_wins++:q4_wins++
        })
        this.cbb_teams_played.away_losses.forEach(team=>{
            team.cbb_rpi_rank < 76 ? q1_losses++: team.cbb_rpi_rank < 136 ? q2_losses++:team.cbb_rpi_rank<241 ? q3_losses++:q4_losses++
        })
        //all adjustments here are guesses, and not finalized, but for now
        this.cbb_value = this.cbb_rpi_value/3 + adj_elo + q1_wins*4 + q2_wins*2  - q3_losses - q4_losses*2 + this.wins - this.losses
        
    }

    calculateRPIWinPercentage(){
        this.cbb_rpi_WP = this.cbb_rpi_WL.win/(this.cbb_rpi_WL.win + this.cbb_rpi_WL.loss)
    }

    calculateOpponentWinPercentage(){
        this.cbb_all_teams_played.forEach(team=>{this.cbb_opponent_rpi_WP += team.cbb_rpi_WP})
    }

    calculateRPI(){
        let opponent_opponent_WP = 0
        this.cbb_all_teams_played.forEach(team => {opponent_opponent_WP += this.cbb_opponent_rpi_WP})
        this.cbb_rpi_value = this.cbb_rpi_WP/4 + this.cbb_opponent_rpi_WP/2 + opponent_opponent_WP/4
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
        this.total_ties += this.ties
        this.total_champions += this.champions
        this.total_finalists += this.finalist
        this.total_playoff_appearances += this.playoff_appearances
        this.total_playoff_losses += this.playoff_losses.reduce((a,b)=>a+b)
        this.total_playoff_wins += this.playoff_wins.reduce((a,b)=>a+b)
        this.total_bowl_wins += this.bowl_wins
        this.wins = this.original_wins
        this.losses = this.original_losses
        this.ties = this.original_ties
        this.elo = this.defaultElo
        this.playoff_wins = [0, 0, 0, 0, 0, 0, 0]
        this.playoff_losses = [0, 0, 0, 0, 0, 0, 0]
        this.playoff_appearances = 0
        this.finalist = 0
        this.champions = 0
        this.bowl_wins = 0
        this.playoff_game_results = []
    }
    
    cbb_reset(){
        this.cbb_value = 0
        this.cbb_elo_wins.length = 0
        this.cbb_elo_losses.length = 0
        this.cbb_rpi_WL.win = 0
        this.cbb_rpi_WL.loss = 0
        this.cbb_rpi_WP = 0 //this is winning percentage for RPI calculation
        this.cbb_opponent_rpi_WP = 0 //this is the opponents in percentage
        this.cbb_rpi_value = 0
        this.cbb_rpi_rank = 0
        this.cbb_all_teams_played.length=0
        this.cbb_teams_played = {home_wins: [], away_wins: [], home_losses: [], away_losses: [], neutral_wins: [], neutral_losses: []}
    }
    //Find Averages
    averages(sims){ //find the average of each important value, taking in the amount of sims
        this.average_wins = (this.total_wins / sims)
        this.average_playoff_wins = this.total_playoff_wins/sims
        this.average_playoff_appearances = this.total_playoff_appearances / sims
        this.average_finalists = (this.total_finalists / sims)
        this.average_champions = (this.total_champions / sims)
        this.average_losses = (this.total_losses / sims)
        this.average_ties = (this.total_ties / sims)
        this.average_bowl_wins = (this.total_bowl_wins / sims)
        if(this.playoff_status>2){
            this.average_playoff_appearances=1
            if(this.playoff_status>4){
                this.average_finalists=1
            }
            if(this.playoff_status === 6){
                this.average_champions = 1
            }
        }
    }

    calculateFantasyPoints(sport_points, sport_structure_id){
            let bonus_win = 0
            if(this.sport_id === ('103'||'104')){
                let milestone_parameter = this.sport_id === '103' ? this.wins : this.wins*2+this.ties
                let milestone_points = sport_points.regular_season.milestone_points
                //maybe this should not be so rigid - if you are close to points, projects you getting some of bonus. Fade out as season goes along
                bonus_win = milestone_parameter > sport_points.regular_season.milestone ? milestone_points : 0
              }else{
                bonus_win = 0
              }

              if(this.sport_id === '105'){bonus_win+= this.average_bowl_wins * sport_points.playoffs.bowl_win}

            this.fantasy_points_projected[sport_structure_id] =
                this.average_wins * sport_points.regular_season.win +
                this.average_ties * sport_points.regular_season.tie +
                this.average_champions * sport_points.bonus.championship +
                this.average_finalists * sport_points.bonus.finalist +
                this.average_playoff_appearances * sport_points.bonus.appearance +
                this.average_playoff_wins * sport_points.playoffs.win +
                bonus_win

    }

    calculateAboveValuesForRanking(last_drafted, average, sport_structure_id){
        this.points_above_average[sport_structure_id] = this.fantasy_points_projected[sport_structure_id]-average
        this.points_above_last_drafted[sport_structure_id] = this.fantasy_points_projected[sport_structure_id]-last_drafted
    }

    alternateCalculateAboveValues(last_drafted, average, sport_structure_id, standard_deviation){
        this.stdev_points_above_average[sport_structure_id] = (this.fantasy_points_projected[sport_structure_id]-average)/standard_deviation
        this.stdev_points_above_last_drafted[sport_structure_id] = (this.fantasy_points_projected[sport_structure_id]-last_drafted)/standard_deviation
    }
   
}

module.exports = Team