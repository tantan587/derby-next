var data = require('../../../../data/sport_seasons.json')

//some of below should only be up to today's date initially, and then changed once we reimplement all the data
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('sports.sport_season').del()
    .then(function () {
      // Inserts seed entries
      return knex('sports.sport_season').insert(data)
    })
}
