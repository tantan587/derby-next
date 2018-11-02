let structure_data = [
  {sport_structure_id:0, league_bundle_id:0, scoring_type_id:1, active:false},
  {sport_structure_id: 1, league_bundle_id: 1, scoring_type_id: 1, previous_sport_structure_id: 2, active: true},
  {sport_structure_id: 2, league_bundle_id: 2, scoring_type_id: 1, active: false},
  {sport_structure_id: 3, league_bundle_id: 3, scoring_type_id: 2, active: true, previous_sport_structure_id: 4},
  {sport_structure_id: 4, league_bundle_id: 4, scoring_type_id: 2, active: false}
]

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.withSchema('fantasy').table('sports_structure').del()
    .then(function () {
      // Inserts seed entries
      return knex.withSchema('fantasy').table('sports_structure').insert(structure_data)
    })
}
