const knex = require('../../server/db/connection')
const helpers = require('../helpers.js').data
const math = require('mathjs')


const m = async () => {
    let team_points = await knex('fantasy.team_points')//.leftOuterJoin('sports.team_info', 'sports.team_info.team_id', 'fantasy.team_points.team_id')
    let teams_by_sport = {101: [], 102: [], 103: [], 104: [], 105: [], 106: [], 107: []}
    console.log(teams_by_sport)
    team_points.forEach(team => {
        team.total_points = Number(team.reg_points) + Number(team.bonus_points) + Number(team.playoff_points)
        team.team_id<101999 ? teams_by_sport[101].push(team) :
        team.team_id<102999 ? teams_by_sport[102].push(team) :
        team.team_id<103999 ? teams_by_sport[103].push(team) :
        team.team_id<104999 ? teams_by_sport[104].push(team) :
        team.team_id<105999 ? teams_by_sport[105].push(team) :
        team.team_id<106999 ? teams_by_sport[106].push(team) :
        teams_by_sport[107].push(team)
        })

    let sport_ids = [101, 102, 103, 104, 105, 106, 107]
    let sport_teams = []
    sport_ids.forEach(sport => {
        teams_by_sport[sport].sort(function(a,b){return b.total_points - a.total_points})
        let size = 12
        let roster_size_for_ranking = sport === (106||105) ? size*3 : sport === 107 ? size : size*2
        let points = teams_by_sport[sport].map(team => team.total_points)
        let drafted_teams = points.slice(0, roster_size_for_ranking)
        let average = math.mean(drafted_teams)
        let standard_dev = math.std(drafted_teams)
        console.log(sport)
        if(sport===107){console.log(points)}
        let last_drafted = points[roster_size_for_ranking-1]
        teams_by_sport[sport].forEach(team => {
            let points_above_average = team.total_points - average
            let points_above_last = team.total_points - last_drafted
            sport_teams.push({
                ...team, 
                points_above_average: team.total_points - average, points_above_last: team.total_points - last_drafted,
                rank_above_average: 0,
                rank_above_last: 0,
                rank: 0    
            })
        })
    })
        
    sport_teams.sort(function(a,b){return b.points_above_average - a.points_above_average})
    let rank = 1 
    sport_teams.forEach(team =>{
        team.rank_above_average = rank
        rank++
    })
    sport_teams.sort(function(a,b){return b.points_above_last-a.points_above_last})
    rank = 1
    sport_teams.forEach(team =>{
        team.rank_above_last = rank
        rank++
    })
    sport_teams.sort(function(a,b){return a.rank_above_last+a.rank_above_average-b.rank_above_average-b.rank_above_last})
    rank = 1
    sport_teams.forEach(team =>{
        team.rank = rank
        rank++
    })


    let for_insert = sport_teams.map(team => {
        return {team_id: team.team_id, total_points: team.total_points, ranking: team.rank, ranking_last: team.rank_above_last, ranking_average: team.rank_above_average}
    })

    return helpers.insertIntoTable(knex, 'analysis', 'rankings', for_insert)
    .then(() => {
        process.exit()
    })
}


m()