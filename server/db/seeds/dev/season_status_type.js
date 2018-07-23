
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.withSchema('sports').table('season_status_types').del()
    .then(function () {
      // Inserts seed entries
      return knex.withSchema('sports').table('season_status_types').insert([
        {type_id: 1, season_status: 'preseason: no schedule'},
        {type_id: 2, season_status: 'preseason: schedule'},
        {type_id: 3, season_status: 'preseason: preseason games'},
        {type_id: 4, season_status: 'regular-season'},
        {type_id: 5, season_status: 'playoffs'},
        {type_id: 6, season_status: 'after-season'}
      ])
    })
}
