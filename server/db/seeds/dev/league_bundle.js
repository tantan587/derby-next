let league_bundle_data = [
  {league_bundle_id: 0, current_sport_seasons: JSON.stringify([22, 24, 25, 27,7,9,31,33,34,36,37,39,40,42]), name: 'Default - No League'},
  {league_bundle_id: 2, current_sport_seasons: JSON.stringify([1,3,4,6,7,9,10,12,13,15,16,18,19,21]), name: 'Derby 17-18: official scoring system'},
  {league_bundle_id: 1, current_sport_seasons: JSON.stringify([22, 24, 25, 27,28,30,31,33,34,36,37,39,40,42]), name: 'Derby 18-19: official scoring system'}
]

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.withSchema('fantasy').table('league_bundle').del()
    .then(function () {
      // Inserts seed entries
      return knex.withSchema('fantasy').table('league_bundle').insert(league_bundle_data)
    })
}
