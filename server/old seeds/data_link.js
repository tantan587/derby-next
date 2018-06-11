
var data = require('../../../../data/teamid-fantasyid.json')

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return  knex.withSchema('sports').table('data_link').del()
    .then(function () {
      // Inserts seed entries
      return knex.withSchema('sports').table('data_link').insert(data)
    })
}
