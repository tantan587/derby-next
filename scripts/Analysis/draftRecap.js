const math = require('mathjs')
const knex = require('../../server/db/connection')

const draftRecap = async (league_id) => {
    let team_record_projections = await league_team_projections(league_id)

    let rosters = await knex('fantasy.rosters')
        .leftOuterJoin('fantasy.leagues', 'fantasy.rosters.league_id', 'fantasy.leagues.league_id')
        .leftOuterJoin('fantasy.projections', function(){
            this.on('fantasy.projections.team_id','=','fantasy.rosters.team_id')
                .andOn('fantasy.projections.sport_structure_id', '=', 'fantasy.leagues.sport_structure_id')
            })
        .leftOuterJoin('sports.team_info', 'sports.team_info.team_id', 'fantasy.rosters.team_id')
        .where('fantasy.leagues.league_id', league_id)
        .select('*')

    let rosters_by_owner = {}

    rosters.sort(function(a,b){return a.overall_pick - b.overall_pick})
    let points_by_sport = {10101: [], 10201: [], 10301: [], 10401: [], 10102: [], 10202: [], 10302: [], 10402: [], 105: [], 106: [], 107: []}
    rosters.forEach(team => {
        if(!(team.owner_id in rosters_by_owner)){
            rosters_by_owner[team.owner_id] = []
        }
        rosters_by_owner[team.owner_id].push(team)
    })
    let total_owners = Object.keys(rosters_by_owner).length
    rosters.forEach(team=>  {
        team.round = Math.ceil(team.overall_pick/total_owners)
        if(['105', '106', '107'].includes(team.sport_id)){
            points_by_sport[team.sport_id].push(team.points)
            team.sport_conference = team.sport_id
        }else{
            points_by_sport[team.conference_id].push(team.points)
            team.sport_conference = team.conference_id
        }
    })

    let average_by_sport = {10101: 0, 10201: 0, 10301: 0, 10401: 0, 10102: 0, 10202: 0, 10302: 0, 10402: 0, 105: 0, 106: 0, 107: 0}
    let stdev_by_sport = {10101: 0, 10201: 0, 10301: 0, 10401: 0, 10102: 0, 10202: 0, 10302: 0, 10402: 0, 105: 0, 106: 0, 107: 0}
    Object.keys(points_by_sport).forEach(sport_id => {
        average_by_sport[sport_id] = math.mean(points_by_sport[sport_id])
        stdev_by_sport[sport_id] = math.mean(points_by_sport[sport_id])
    })
    console.log(1)
    let teams_per_league = rosters_by_owner[rosters[0].owner_id].length
    let points_by_round = {}
    let analysis_by_round= {}
    let points_over_sport_av_by_round = {}
    for(let i=1; i<(Number(teams_per_league)+1); i++){
        points_by_round[i] = []
        analysis_by_round[i] = {standard_dev: 0, average: 0}
        points_over_sport_av_by_round[i] = []
    }
    console.log(2)
    rosters.forEach(team => {
        points_by_round[team.round].push(team.points)
    })
    console.log(3)
    for(let n = 0; n++; n<teams_per_league){
        analysis_by_round[n].average = math.mean(points_by_round[i])
        analysis_by_round[n].standard_dev = math.std(points_by_round[i])
    }
    console.log(4)
    rosters.forEach(team => {
        team.points_vs_average = team.points - analysis_by_round[team.round].average
        team.points_over_sport_average = team.points - average_by_sport[team.sport_conference]
        points_over_sport_av_by_round[team.round].push(team.points_over_sport_average)
    })
    console.log(5)
    //this is done where index is round-1
    let average_over_sport_by_round = Object.values(points_over_sport_av_by_round).map(round_points =>{
        return math.mean(round_points)
    })
    console.log(6)
    rosters.forEach(team => {
        team.points_over_round_by_sport = team.points_over_sport_average - average_over_sport_by_round[team.round-1]
        team.average_over_sport_by_round = average_over_sport_by_round[team.round-1]
    })

    let sport_owner_ranks = {}
    let owner_picks = {}
    Object.keys(rosters_by_owner).forEach(owner => {
        // console.log(owner)
        rosters_by_owner[owner].sort(function(a,b){return b.points_over_round_by_sport - a.points_over_round_by_sport})
        // rosters_by_owner[owner].forEach(team => {
        //     console.log(team.city, team.name)
        // })
        owner_picks[owner] = {best_pick: {}, worst_pick: {}, championships: 0, playoffs: 0, finalists: 0}
        let best = rosters_by_owner[owner][0]
        let worst = rosters_by_owner[owner][teams_per_league-1]
        owner_picks[owner].best_pick = {owner: team_id_list[owner], team_name: best.name, city: best.city, xValue: best.points_over_round_by_sport, projectedPoints: best.points, round: best.round}
        owner_picks[owner].worst_pick = {owner: team_id_list[owner], team_name: worst.name, city: worst.city, xValue: worst.points_over_round_by_sport, projectedPoints: worst.points, round: worst.round}
        sport_owner_ranks[owner] = {}
    })

    console.log(owner_picks)


    let sport_points_by_owner = {}
    rosters.forEach(team => {
        if(!(team.sport_id in sport_points_by_owner)){
            sport_points_by_owner[team.sport_id] = {}
        }
        if(!(team.owner_id in sport_points_by_owner[team.sport_id])){
            sport_points_by_owner[team.sport_id][team.owner_id] = 0
        }
        sport_points_by_owner[team.sport_id][team.owner_id] += team.points

    })

    let sport_max_min = {}

    Object.keys(sport_points_by_owner).forEach(sport_id => {
        let sport_ordered = Object.keys(sport_points_by_owner[sport_id]).sort(
            function(a,b){return sport_points_by_owner[sport_id].b-sport_points_by_owner[sport_id].b})
        sport_max_min[sport_id] = {max: team_id_list[sport_ordered[0]], min: team_id_list[sport_ordered.pop()]}
        let rank = 1
        sport_ordered.forEach(owner => {
            sport_owner_ranks[owner][sport_id]=rank
            rank++
        })
    })

    console.log(sport_max_min)

    //most championships
    rosters.forEach(team => {
        owner_picks[team.owner_id].championships += team_record_projections[team.team_id].projected_playoff.champions
        owner_picks[team.owner_id].playoffs += team_record_projections[team.team_id].projected_playoff.playoffs
        owner_picks[team.owner_id].finalists += team_record_projections[team.team_id].projected_playoff.finalists
    })

    let most_bonus = {championships: {}, finalists: {}, playoffs: {}}
    most_bonus.championships.owner = Object.keys(owner_picks).sort(function(a,b){return owner_picks[b].championships-owner_picks[a].championships})[0]
    most_bonus.finalists.owner = Object.keys(owner_picks).sort(function(a,b){return owner_picks[b].finalists-owner_picks[a].finalists})[0]
    most_bonus.playoffs.owner = Object.keys(owner_picks).sort(function(a,b){return owner_picks[b].playoffs-owner_picks[a].playoffs})[0]

    most_bonus.championships.team = best_bonus(rosters_by_owner, most_bonus.championships.owner, team_record_projections, 'championships')
    most_bonus.finalists.team = best_bonus(rosters_by_owner, most_bonus.finalists.owner, team_record_projections, 'finalists')
    most_bonus.playoffs.team = best_bonus(rosters_by_owner, most_bonus.playoffs.owner, team_record_projections, 'playoffs')
    
    console.log(most_bonus)
    // let best_champ =
    //     rosters_by_owner[most_champs].sort(function(a,b){
    //         return team_record_projections[b].projected_playoff.champions 
    //         - team_record_projections[a].projected_playoff.champions
    //     })[0]

    
    let overall_projections = 
        await knex('fantasy.points')
            .whereIn('owner_id', Object.keys(team_id_list))
            .orderBy('projected_rank')


    let rank = 1
    overall_projections.forEach(owner => {
        let owner_name = team_id_list[owner.owner_id]
        let best_sport = Object.keys(sport_owner_ranks[owner.owner_id]).sort(function(a,b){return sport_owner_ranks[owner.owner_id][a]-sport_owner_ranks[owner.owner_id][b]})[0]
        let superlative = rank<3 ? 'great' : rank<6 ? 'solid' : rank<10 ? 'okay': 'one or two nice'
        console.log(`${rank}. ${owner_name}: ${owner_name} made ${superlative} picks. 
            Second best: ${rosters_by_owner[owner.owner_id][1].city} ${rosters_by_owner[owner.owner_id][1].name} .
            Third best: ${rosters_by_owner[owner.owner_id][2].city} ${rosters_by_owner[owner.owner_id][2].name} .
            Best Sport: ${best_sport}
            Best Pick: ${owner_picks[owner.owner_id].best_pick.city} ${owner_picks[owner.owner_id].best_pick.team_name} in the ${owner_picks[owner.owner_id].best_pick.round} round.
            Worst Pick: ${owner_picks[owner.owner_id].worst_pick.city} ${owner_picks[owner.owner_id].worst_pick.team_name} in the ${owner_picks[owner.owner_id].worst_pick.round} round.
            Projected Points: ${owner.total_projected_points}
            `)
        rank++
    })
}



async function league_team_projections(league_id) {
    var str = `
    SELECT aa.*, ee.wins as projected_wins, ee.losses as projected_losses,
    ee.ties as projected_ties, ee.playoff as projected_playoff from
      (select a.*, b.sport_season_id, b.year, c.sport_name, c.sport_id, b.wins, b.losses, b.ties
        from (select x.team_id, x.sport_id, x.key, x.city, x.name, x.logo_url, y.conference_id, y.display_name
        from sports.team_info x
        left outer join sports.conferences y on x.conference_id = y.conference_id) a,
        sports.standings b, sports.leagues c
        WHERE a.team_id = b.team_id
        and a.sport_id = c.sport_id) aa
    left outer join analysis.record_projections ee on aa.team_id = ee.team_id
    and ee.day_count = (select max(day_count) from analysis.record_projections)
    and aa.year = ee.year`
    const teamInfo = await knex.raw(str)
    const all_teams = teamInfo.rows
    let league = await knex('fantasy.leagues')
        .where('league_id', league_id)
    let sport_structure_id = league[0].sport_structure_id
    let raw_seasons = await knex('fantasy.sports_structure')
        .leftOuterJoin('fantasy.league_bundle', 'fantasy.league_bundle.league_bundle_id', 'fantasy.sports_structure.league_bundle_id')
        .where('fantasy.sports_structure.sport_structure_id', sport_structure_id)
        .select('fantasy.league_bundle.current_sport_seasons')
    let league_bundle_seasons = raw_seasons[0].current_sport_seasons
    const league_teams =  all_teams.filter(team => { return league_bundle_seasons.includes(team.sport_season_id)})
    let projections_by_team = {}
    league_teams.forEach(team =>{
        projections_by_team[team.team_id] = team
    })

    return projections_by_team
}

const best_bonus = (rosters_by_owner, owner, team_record_projections, bonus_type) => {
    let best = 
        rosters_by_owner[owner].sort(function(a,b){
            return team_record_projections[b.team_id].projected_playoff.bonus_type 
            - team_record_projections[a.team_id].projected_playoff.bonus_type
        })
    return [best[0].city, best[0].name]
}

const team_id_list = {
    '0d0c4f59-fb17-43fd-a811-f6f2516b0ec7': 'Jonah',
    '0f139157-303e-46fa-bab8-48f236b47cd2': 'Shay',
    '402a30f3-7312-462e-a1a6-14e79967c081': 'Joseph',
    '21173d78-f521-47c0-bb1b-6390913b086a': 'Jon',
    'b2c6899e-5216-4e45-9268-c9247da8c9bf': 'Josh Bay',
    '6aa5ed82-fd12-43b9-bcbc-bb6b9eff1132': 'yoni',
    '91965137-11e6-4262-9523-eebb0f482ee9': 'perry',
    'b9104486-cbeb-49e3-ad69-77fe143cc85b': 'ian',
    'f99067ca-08d8-4a2e-abea-8f6a29d9dabb': 'david',
    '2b0c9479-e366-4ffd-83ad-8c06e24d4dc2': 'jesse',
    '4b3cb3db-1761-478f-94a6-2bc4ac237d21': 'aj',
    'e5ec37b7-8b75-45ef-8f64-1260e9518747': 'avi',
    '6e773d42-3f72-4ac3-a53c-d17aed71772e': 'matt',
    '97977328-66b2-4f08-8d53-52202a1b120e': 'camila',
    'f23d63b6-f64e-432d-8563-e42605d8fb85': 'ezer'
}

draftRecap('aa61f52e-d492-4ffb-aa72-3f5d91d1aa08')