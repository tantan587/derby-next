
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.withSchema('sports').table('season_group_types').del()
    .then(function () {
      // Inserts seed entries
      return knex.withSchema('sports').table('season_group_types').insert([
        {type_id: 1, season_group: 'default derby: august 18 - october 19'},
        {type_id: 2, season_group: 'february derby: march 18 - february 19'}
      ])
    })
}
