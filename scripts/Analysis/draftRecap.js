const math = require('mathjs')
const knex = require('../../server/db/connection')

const draftRecap = async (league_id) => {
    let rosters = await knex('fantasy.rosters')
        .leftJoin('fantasy.leagues', 'fantasy.rosters.league_id', 'fantasy.leagues.league_id')
        .leftJoin('fantasy.projections', function(){
            this.on('fantasy.projections.team_id','=','fantasy.rosters.team_id').andOn('fantasy.leagues.sport_structure_id', '=', 'fantasy.projections.sport_structure_id')
            })
        .leftJoin('sports.team_info', 'sports.team_info.team_id', 'fantasy.rosters.team_id')
        .where('league_id', league_id)
        .select('*')
    
    let rosters_by_owner = {}
    let total_owners = rosters[0].total_enrolled

    rosters.sort(function(a,b){return a.overall_pick - b.overall_pick})
    let points_by_sport = {10101: [], 10201: [], 10301: [], 10401: [], 10102: [], 10202: [], 10302: [], 10402: [], 105: [], 106: [], 107: []}
    rosters.forEach(team => {
        if(!(team.owner_id in rosters_by_owner)){
            rosters_by_owner[team.owner_id] = []
        }
        rosters_by_owner[team.owner_id].push(...team)
        team.round = Math.ceil(team.overall_pick/total_owners)
        if(['105', '106', '107'].includes(team.sport_id)){
            points_by_sport[team.sport_id].push(team.projected_points)
            team.sport_conference = team.sport_id
        }else{
            points_by_sport[team.conference_id].push(team.projected_points)
            team.sport_conference = team.conference_id
        }
    })

    let average_by_sport = {10101: 0, 10201: 0, 10301: 0, 10401: 0, 10102: 0, 10202: 0, 10302: 0, 10402: 0, 105: 0, 106: 0, 107: 0}
    let stdev_by_sport = {10101: 0, 10201: 0, 10301: 0, 10401: 0, 10102: 0, 10202: 0, 10302: 0, 10402: 0, 105: 0, 106: 0, 107: 0}
    Object.keys(points_by_sport).forEach(sport_id => {
        average_by_sport[sport_id] = math.average(points_by_sport[sport_id])
        stdev_by_sport[sport_id] = math.average(points_by_sport[sport_id])
    })

    let teams_per_league = rosters_by_owner[rosters[0].owner_id].length
    let points_by_round = {}
    let analysis_by_round= {}
    let points_over_sport_av_by_round = {}
    for(let i=1; i++; i<(teams_per_league+1)){
        points_by_round[i] = []
        analysis_by_round[i] = {standard_dev: 0, average: 0}
        points_over_sport_av_by_round = []
    }

    rosters.forEach(team => {
        points_by_round[team.round].push(team.projected_points)
    })

    for(let n = 0; n++; n<teams_per_league){
        analysis_by_round[n].average = math.mean(points_by_round[i])
        analysis_by_round[n].standard_dev = math.std(points_by_round[i])
    }

    rosters.forEach(team => {
        team.points_vs_average = team.projected_points - analysis_by_round[team.round].average
        team.points_over_sport_average = team.projected_points - average_by_sport[team.sport_conference]
        points_over_sport_av_by_round[team.round].push(team.points_over_sport_average)
    })
    
    let average_over_sport_by_round = Object.values(points_over_sport_av_by_round).map(round_points =>{
        return math.mean(round_points)
    })



}