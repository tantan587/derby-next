const knex = require('../../server/db/connection')
const math = require('mathjs')


const adjustPastElosBySportEOS = async (sport_id) => {
    let teams = 
        await knex('analysis.current_elo_test')
            .leftOuterJoin('sports.team_info', 'sports.team_info.team_id', 'analysis.current_elo_test.team_id')
            .where('sport_id',sport_id)
            .select('*')
    
    let all_elos = teams.map(team => {
        return Number(team.elo)})
    
    let professional_sports = [101,102,103,104]
    let teams_for_insert
    let average_elo = math.mean(all_elos)
    let standard_dev = math.std(all_elos)
    if(professional_sports.includes(sport_id)){
        teams_for_insert = teams.map(team => {
            let offseason_adjustment = 0
            if(team in adjust_objects_by_sport[sport_id]){
                offseason_adjustment = adjust_objects_by_sport[sport_id][team] * standard_dev
            }
            let new_elo = (average_elo + 3 * team.elo)/4 + offseason_adjustment
            return {team_id: team.team_id, elo: new_elo, year: sport_new_years[sport_id]}
        })
    }else{
        let elos_by_conference = {}
        teams.forEach(team => {
            if(!(team.conference in elos_by_conference)){
                elos_by_conference[team.conference] = []
            }
            elos_by_conference[team.conference].push(team.elo)
        })
        let average_elo_by_conference = {}
        Object.keys(elos_by_conference).forEach(conference => {
            average_elo_by_conference[conference] = math.mean(elos_by_conference[conference])
        })
        teams_for_insert = teams.map(team => {
            let new_elo = (average_elo_by_conference[team.conference] + 3 * team.elo)/4
            return {team_id: team.team_id, elo: new_elo, year: sport_new_years[sport_id]}
        })
    }
    

    await knex('analysis.current_elo_new_season')
        .insert(teams_for_insert)
    
    console.log(`Sport_id: ${sport_id}, teams inserted: ${teams_for_insert.length}, average: ${average_elo}, standard dev: ${standard_dev}`)
}

const sport_new_years = {
    101: 2019, 
    102: 2018,
    103: 2019, 
    104: 2019,
    105: 2018,
    106: 2019,
    107: 2019
}

const nba_adjust = {
    101106: -0.5, // Cavaliers
    101103: -(1/3), // Nets
    101111: -0.25, // Rockets
    101108: -0.2, // Nuggets
    101113: -0.2, // Clippers
    101105: 0.2, // Bulls
    101117: 0.2, // Bucks
    101115: 1/3, // Grizzlies
    101107: 1/3, // Mavericks
    101114: .5, // Lakers
    101128: .25, // Raptors
    101102: .25 // Celtics

}

const adjust_objects_by_sport = {
    101: nba_adjust,
    102: nfl_adjust,
    103: mlb_adjust,
    104: nhl_adjust
}

const nfl_adjust = {

}

const nhl_adjust = {
    
}


adjustPastElosBySportEOS(101)
adjustPastElosBySportEOS(102)
adjustPastElosBySportEOS(103)
adjustPastElosBySportEOS(104)
adjustPastElosBySportEOS(105)
adjustPastElosBySportEOS(106)

