var data = 
[
  {conference_id:10501,fantasy_data_key:3, name: 'Atlantic'},
  {conference_id:10502,fantasy_data_key:5, name: 'Big 12 Conference'},
  {conference_id:10503,fantasy_data_key:6, name: 'Big Ten - East'},
  {conference_id:10503,fantasy_data_key:5, name: 'Big Ten - West'},
  {conference_id:10504,fantasy_data_key:15, name: 'Pac-12 North'},
  {conference_id:10504,fantasy_data_key:16, name: 'Pac-12 South'},
  {conference_id:10505,fantasy_data_key:17, name: 'SEC - East'},
  {conference_id:10505,fantasy_data_key:18, name: 'SEC - West'},
  {conference_id:10506,fantasy_data_key:10, name: 'FBS Independents'},
  {conference_id:10601,fantasy_data_key:1, name: 'American Athletic'},
  {conference_id:10602,fantasy_data_key:3, name: 'American Coast'},
  {conference_id:10603,fantasy_data_key:6, name: 'Big East'},
  {conference_id:10604,fantasy_data_key:9, name: 'Big Ten'},
  {conference_id:10605,fantasy_data_key:10, name: 'Big 12'},
  {conference_id:10606,fantasy_data_key:24, name: 'Pac-12'},
  {conference_id:10607,fantasy_data_key:26, name: 'SEC'},
]

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return  knex.withSchema('sports').table('conferences_link').del()
    .then(function () {
      // Inserts seed entries
      return knex.withSchema('sports').table('conferences_link').insert(data)
    })
}

