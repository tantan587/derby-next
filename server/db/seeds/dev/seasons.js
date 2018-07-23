var data = require('../../../../data/seasons.json')

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return  knex.withSchema('sports').table('seasons').del()
    .then(function () {
      // Inserts seed entries
      return knex.withSchema('sports').table('seasons').insert(data)
    })
}