const knex = require('../server/db/connection')


const create_structures_bundles = async () => {
    let structure_data = [{sport_structure_id: 1, league_bundle_id: 1, scoring_type_id: 1, previous_sport_structure_id: 1, active: true},
        {sport_structure_id: 2, league_bundle_id: 2, scoring_type_id: 1, active: false}]
    
    let league_bundle_data = [
        {league_bundle_id: 2, current_sport_seasons: JSON.stringify([1,3,4,6,7,9,10,12,13,15,16,18,19,21]), name: 'Derby 17-18: official scoring system'},
        {league_bundle_id: 1, current_sport_seasons: JSON.stringify([]), name: 'Derby 18-19: official scoring system'}
    ]

    await db_helpers.insertIntoTable(knex, 'fantasy', 'sports_structure', structure_data)
    await db_helpers.insertIntoTable(knex, 'fantasy', 'league_bundle', league_bundle_data)
}