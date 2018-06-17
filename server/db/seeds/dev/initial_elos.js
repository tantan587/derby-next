var data = require('../../../../data/startingElo.json')

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return  knex.withSchema('analysis').table('current_elo').del()
    .then(function () {
      // Inserts seed entries
      return knex.withSchema('analysis').table('current_elo').insert(data)
    })
}
