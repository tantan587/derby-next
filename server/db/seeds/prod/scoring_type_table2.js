
var data = require('../../../../data/default_point_structure.json')

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return  knex.withSchema('fantasy').table('scoring').del()
    .then(function () {
      // Inserts seed entries
      return knex.withSchema('fantasy').table('scoring').insert(data)
    })
}
