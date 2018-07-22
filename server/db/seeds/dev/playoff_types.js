
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.withSchema('sports').table('playoff_types').del()
    .then(function () {
      // Inserts seed entries
      return knex.withSchema('sports').table('playoff_types').insert([
        {type_id: 1, playoff_status: 'tbd'},
        {type_id: 2, playoff_status: 'missed_playoffs'},
        {type_id: 3, playoff_status: 'made-playoffs'},
        {type_id: 4, playoff_status: 'made-playoffs-eliminated'},
        {type_id: 5, playoff_status: 'made-playoffs-finalist'},
        {type_id: 6, playoff_status: 'made-playoffs-champion'}
      ])
    })
}
