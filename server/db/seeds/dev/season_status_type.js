
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.withSchema('sports').table('season_status').del()
    .then(function () {
      // Inserts seed entries
      return knex.withSchema('sports').table('season_status').insert([
        {season_status_type: 1, season_status_name: 'default derby: august 18 - october 19'},
        {season_status_type: 2, season_status_name: 'default derby scoring prefirst year: august 17 - october 18'},
      ])
    })
}
