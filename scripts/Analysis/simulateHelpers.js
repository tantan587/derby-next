const leagues = require('./leagues.js')
const math = require('mathjs')


const individualSportTeamsWithYear = (all_teams, sport_id, year) => {
    let sport_teams = Object.keys(all_teams[sport_id][year]).map(team => {return all_teams[sport_id][year][team]})
    return sport_teams
  }

//Function to simulate an entire series - round is what round of the playoffs this is (1,2,3, etc.)
const Series = (home, away, games, sport_id, round, neutral=false) => {
    round--
    let clinch = Math.ceil(games/2)
    let homeGames = [0,1,4,6]
    let roadGames = [2,3,5]
    let x = 0
    while(home.playoff_wins[round] < clinch && away.playoff_wins[round] < clinch){
        let results = homeGames.includes(x) ? simulateGame(home, away, sport_id, neutral, true):simulateGame(away, home, sport_id, neutral, true)
        results[0].playoff_wins[round]++
        x++
    }
    if(home.playoff_wins[round] === clinch){
        return home
    } else{
        return away
    }
}

//tells you which team has more Wins between two, returns them as array
const moreWins = (team_a, team_b) => {
    let teams = team_a.wins > team_b.wins ? [team_a,team_b]:[team_b,team_a]
    return teams
}

//nhl tie percentage is .23
const simulateGame = (home, away, sport_id, neutral = false, playoff_game = false) => 
{   //need to add adjustment in this function for playoffs, NHL
    let home_adv = neutral === false ? leagues[sport_id].home_advantage:0
    let elo_difference = home.elo - away.elo + home_adv
    let home_win_percentage = 1/(Math.pow(10,(-1*elo_difference/400))+1)
    let random_number = Math.random()
    let home_win_value = random_number < home_win_percentage ? 1:0

    home.adjustEloWins(sport_id, home_win_value, home_win_percentage, leagues[sport_id].elo_adjust, playoff_game)
    away.adjustEloWins(sport_id, Math.abs(1-home_win_value), 1 - home_win_percentage, leagues[sport_id].elo_adjust, playoff_game)
    let results = home_win_value === 1 ?[home, away]:[away,home]
    return results

}

const simulateBowlGame = (home, away) => 
{   //need to add adjustment in this function for playoffs, NHL
    let elo_difference = home.elo - away.elo
    let home_win_percentage = 1/(Math.pow(10,(-1*elo_difference/400))+1)
    let random_number = Math.random()
    let home_win_value = random_number < home_win_percentage ? 1:0
    home.adjustEloWins(105, home_win_value, home_win_percentage, leagues['105'].elo_adjust, true)
    away.adjustEloWins(105, Math.abs(1-home_win_value), 1 - home_win_percentage, leagues['105'].elo_adjust, true)
    home_win_value === 1 ? home.bowl_wins++ : away.bowl_wins++
}


const simulateNHLGame = (home, away, neutral = false) => 
{   //need to add adjustment in this function for playoffs
    let home_adv = neutral === false ? leagues['104'].home_advantage:0
    let elo_difference = home.elo - away.elo + home_adv
    let home_win_percentage = 1/(Math.pow(10,(-1*elo_difference/400))+1)
    let random_number = Math.random()
    //in NHL, teams can tie.
    let tie_percentage = .23
    let home_win_no_OT = home_win_percentage - tie_percentage/2
    let away_win_in_OT = home_win_percentage + tie_percentage/2
    //ELO assumes an overtime loss and overtime win is the same as a tie. 
    let home_win_value_ELO = random_number < home_win_no_OT ? 1 : random_number < away_win_in_OT ? .5 : 0
    //this calculates the values for standings, giving .5 for OT loss
    let home_win_value_standings = 0
    let away_win_value_standings = 0
    random_number < home_win_no_OT ? (
        home_win_value_standings = 1
    ) : random_number < home_win_percentage ? (
        home_win_value_standings = 1, away_win_value_standings = .5
    ) : random_number < away_win_in_OT ? (
        home_win_value_standings = .5, away_win_value_standings = 1
    ) : away_win_value_standings = 1

    home.adjustEloWins(104, home_win_value_ELO, home_win_percentage, leagues[104].elo_adjust)
    away.adjustEloWins(104, Math.abs(1-home_win_value_ELO), 1 - home_win_percentage, leagues[104].elo_adjust)

    return [home_win_value_standings, away_win_value_standings]
    

}


const simulateEPLGame = (home, away) => 
{   
    let home_adv = leagues['107'].home_advantage
    let elo_difference = home.elo - away.elo + home_adv
    let home_win_percentage_raw = 1/(Math.pow(10,(-1*elo_difference/400))+1)
    let random_number = Math.random()
    //EPL: teams just straight up tie.
    let tie_percent = .23  //how often teams in the EPL tie - maybe?
    let home_win_percentage = home_win_percentage_raw - tie_percent/2
    let tie_percentage = home_win_percentage_raw + tie_percent/2
    //ELO assumes an overtime loss and overtime win is the same as a tie. 
    let home_win_value = random_number < home_win_percentage ? 1 : random_number < tie_percentage ? .5 : 0
    home.adjustEloWins(107, home_win_value, home_win_percentage_raw, leagues['107'].elo_adjust, false)
    away.adjustEloWins(107, Math.abs(1-home_win_value), 1 - home_win_percentage_raw, leagues['107'].elo_adjust, false)

    return home_win_value
    
    //return [home_win_value, Math.abs(1-home_win_value)]
}

const updateProjections = (teams, day) => {
    let rows = teams.map(team => {
        //let playoff_json = JSON.stringify({wins: team.average_playoff_wins, playoffs: team.average_playoff_appearances, finalists: team.average_finalists, champions: team.average_champions})
        //console.log(playoff_json)
        return {team_id: team.team_id, wins: team.average_wins, year: team.year,
             losses: team.average_losses, ties: team.average_ties, day_count: day, 
             playoff: {wins: team.average_playoff_wins, playoffs: team.average_playoff_appearances, finalists: team.average_finalists, champions: team.average_champions, bowl_wins: team.average_bowl_wins}}
    })
    console.log('amount of teams projections updated', rows.length)
    return rows

    }

const normalizeImpact = (games) => {
    let all_impacts = games.map(game => {
        return game.hard_impact
    })
    let average = math.mean(all_impacts)
    let standard_dev = math.std(all_impacts)
    let max = math.max(all_impacts)
    let min = math.min(all_impacts)
    let adj = (max-average)>(average-min) ? max-average: average-min
    let new_standard_dev = 50/(adj/standard_dev)
    let adjust_standard_dev = new_standard_dev/standard_dev
    //should i create a sport impact link table, to add these impacts, and adjust over time, to keep consistent and more varied?
    games.forEach(game => {
        game.adjusted_impact = ((game.hard_impact-average)*adjust_standard_dev)+50
    })
}

const createImpactArray = (sport_games, sport_id, points) => {
    let game_projections = []
    // years.forEach(year => {
    sport_games.forEach(game => {
        game.calculateRawImpact(points)
    })
    normalizeImpact(sport_games)

    //console.log(game.raw_impact['home'])
    sport_games.forEach(game => {
        game_projections.push({ team_id: game.home.team_id, global_game_id: game.global_game_id, win_percentage: game.home_win_percentage, impact: game.adjusted_impact, scoring_type_id: 1 })
        game_projections.push({ team_id: game.away.team_id, global_game_id: game.global_game_id, win_percentage: game.away_win_percentage, impact: game.adjusted_impact, scoring_type_id: 1})
    })

    return game_projections
}


const fantasyProjections = (all_teams, day, points, sport_structures, year_seasons) => {
    let data_for_insert = []
    let sport_ids = Object.keys(all_teams)
    //let sport_ids = ['101','102', '103', '104', '105', '106', '107']

    sport_structures.forEach(structure => {
        let array_of_all_teams = []
        sport_ids.forEach(sport => {
            let sport_years = Object.keys(all_teams[sport])
            sport_years.forEach(year =>{
                if(year_seasons[sport][year].some(season_id => 
                    structure.current_sport_seasons.includes(season_id)
                )){
                    let sport_teams = Object.keys(all_teams[sport][year]).map(team => {return all_teams[sport][year][team]})
                    let points_array = []
                    //let points_array = array_for_copy.slice(0)
            
                    sport_teams.forEach(team => {
                        team.calculateFantasyPoints(points[structure.scoring_type_id][sport], structure.sport_structure_id)
                        points_array.push(team.fantasy_points_projected[structure.sport_structure_id])
                    })

                    points_array.sort(function(a,b){return b-a})
                    //normalize size of leagues for rankings
                    let size = 12 //should this maybe be set to a different size league to be normalized?
                    let roster_size_for_ranking = sport === ('106'||'105') ? size*3 : sport === '107' ? size : size*2
                    let drafted_teams
                    if(sport === '106'){
                        let filtered_teams = sport_teams.filter(team => {
                            return Number(team.conference)<10608
                        })
                        let alt_points_array = filtered_teams.map(team => {
                            return team.fantasy_points_projected[structure.sport_structure_id]
                        })
                        alt_points_array.sort(function(a,b){return b-a})
                        drafted_teams = alt_points_array.slice(0, roster_size_for_ranking)
                    }else{
                        drafted_teams = points_array.slice(0, roster_size_for_ranking)
                    }
                    let average = math.mean(drafted_teams)
                    let standard_dev = math.std(drafted_teams)
                    let last_drafted = drafted_teams[roster_size_for_ranking-1]
                    
                    
                    console.log(`Sport: ${sport}, Year: ${year}, last_drafted: ${last_drafted}, average: ${average}, standard_dev: ${standard_dev}`)
                    //let non_zero_sport_teams = sport_teams.filter(team => {return team.fantasy_points_projected[structure.sport_structure_id]>0})
                    
                    sport_teams.forEach(team => {
                        team.calculateAboveValuesForRanking(last_drafted, average, structure.sport_structure_id)
                        team.alternateCalculateAboveValues(last_drafted, average, structure.sport_structure_id, standard_dev)
                    })
                    array_of_all_teams.push(...sport_teams)
                }
            })
        })

        //can only use one of the following three methods to create ranking. Believe final one is the best.

        // //value above method
         //pureValueRankMethod(array_of_all_teams, structure, data_for_insert, day)

        // //standard deviation method
        //standardDeviationRankMethod(array_of_all_teams, structure, data_for_insert, day)

        //combination method
        combinationMethodRank(array_of_all_teams, structure, data_for_insert, day)

    })
    return data_for_insert
}



const pureValueRankMethod = (array_of_all_teams, structure, data_for_insert, day) => {
    findPointsAbove(array_of_all_teams, structure)
    array_of_all_teams.sort(function (a, b) { return a.rank_above_last[structure.sport_structure_id] + a.rank_above_average[structure.sport_structure_id] - b.rank_above_last[structure.sport_structure_id] - b.rank_above_average[structure.sport_structure_id] })
    rankTeams(array_of_all_teams, structure, data_for_insert, day)
}

const findPointsAbove = (array_of_all_teams, structure) => {
    array_of_all_teams.sort(function (a, b) { return b.points_above_last_drafted[structure.sport_structure_id] - a.points_above_last_drafted[structure.sport_structure_id] })
    let rank = 0
    array_of_all_teams.forEach(team => {
        team.rank_above_last[structure.sport_structure_id] = rank
        rank++
    })
    array_of_all_teams.sort(function (a, b) { return b.points_above_average[structure.sport_structure_id] - a.points_above_average[structure.sport_structure_id] })
    rank = 0
    array_of_all_teams.forEach(team => {
        team.rank_above_average[structure.sport_structure_id] = rank
        rank++
    })
}

const standardDeviationRankMethod = (array_of_all_teams, structure, data_for_insert, day) => {
    findStandardDevPointsAbove(array_of_all_teams, structure)
    array_of_all_teams.sort(function (a, b) { return a.stdev_rank_above_last[structure.sport_structure_id] + a.stdev_rank_above_average[structure.sport_structure_id] - b.stdev_rank_above_last[structure.sport_structure_id] - b.stdev_rank_above_average[structure.sport_structure_id] })
    rankTeams(array_of_all_teams, structure, data_for_insert, day)
}
const findStandardDevPointsAbove = (array_of_all_teams, structure) => {
    array_of_all_teams.sort(function (a, b) { return b.stdev_points_above_last_drafted[structure.sport_structure_id] - a.stdev_points_above_last_drafted[structure.sport_structure_id] })
    let rank = 0
    array_of_all_teams.forEach(team => {
        team.stdev_rank_above_last[structure.sport_structure_id] = rank
        rank++
    })
    array_of_all_teams.sort(function (a, b) { return b.stdev_points_above_average[structure.sport_structure_id] - a.stdev_points_above_average[structure.sport_structure_id] })
    rank = 0
    array_of_all_teams.forEach(team => {
        team.stdev_rank_above_average[structure.sport_structure_id] = rank
        rank++
    })
}

const combinationMethodRank = (array_of_all_teams, structure, data_for_insert, day) => {
    findStandardDevPointsAbove(array_of_all_teams, structure)
    findPointsAbove(array_of_all_teams, structure)
    array_of_all_teams.sort(function (a, b) { 
        let m = a.stdev_rank_above_last[structure.sport_structure_id] + a.stdev_rank_above_average[structure.sport_structure_id] + 
            a.rank_above_last[structure.sport_structure_id] + a.rank_above_average[structure.sport_structure_id] - 
            b.stdev_rank_above_last[structure.sport_structure_id] - b.stdev_rank_above_average[structure.sport_structure_id] -
            b.rank_above_last[structure.sport_structure_id] - b.rank_above_average[structure.sport_structure_id]
        if(m !== 0){
            return m
        }else{
            return b.fantasy_points_projected[structure.sport_structure_id]-a.fantasy_points_projected[structure.sport_structure_id]
        }  
            // a.stdev_rank_above_last[structure.sport_structure_id] + a.stdev_rank_above_average[structure.sport_structure_id] + 
            // a.rank_above_last[structure.sport_structure_id] + a.rank_above_average[structure.sport_structure_id] - 
            // b.stdev_rank_above_last[structure.sport_structure_id] - b.stdev_rank_above_average[structure.sport_structure_id] -
            // b.rank_above_last[structure.sport_structure_id] - b.rank_above_average[structure.sport_structure_id]
    })
    rankTeams(array_of_all_teams, structure, data_for_insert, day)
}

const rankTeams = (array_of_all_teams, structure, data_for_insert, day) => {
    let rank = 1
    array_of_all_teams.forEach(team => {
        team.overall_ranking[structure.sport_structure_id] = rank
        let f_points = math.round(team.fantasy_points_projected[structure.sport_structure_id], 2)
        data_for_insert.push({
            team_id: team.team_id, scoring_type_id: structure.scoring_type_id, points: f_points, day_count: day, ranking: rank, sport_structure_id: structure.sport_structure_id
        })
        rank++
    })
}


module.exports = {Series, moreWins, simulateGame, updateProjections, simulateNHLGame, createImpactArray, fantasyProjections, simulateBowlGame, simulateEPLGame, individualSportTeamsWithYear}