let league_bundle_data = [
  {league_bundle_id: 2, current_sport_seasons: JSON.stringify([1,3,4,6,7,9,10,12,13,15,16,18,19,21]), name: 'Derby 17-18: official scoring system'},
  {league_bundle_id: 1, current_sport_seasons: JSON.stringify([]), name: 'Derby 18-19: official scoring system'}
]

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.withSchema('fantasy').table('league_bundle').del()
    .then(function () {
      // Inserts seed entries
      return knex.withSchema('fantasy').table('league_bundle').insert(league_bundle_data)
    })
}
