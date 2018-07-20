var data = 
[
  {conference_id:10501,fantasy_data_key:3, name: 'Atlantic'},
  {conference_id:10501,fantasy_data_key: 4, name: 'Coastal'},
  {conference_id:10502,fantasy_data_key:5, name: 'Big 12 Conference'},
  {conference_id:10503,fantasy_data_key:6, name: 'Big Ten - East'},
  {conference_id:10503,fantasy_data_key:7, name: 'Big Ten - West'},
  {conference_id:10504,fantasy_data_key:15, name: 'Pac-12 North'},
  {conference_id:10504,fantasy_data_key:16, name: 'Pac-12 South'},
  {conference_id:10505,fantasy_data_key:17, name: 'SEC - East'},
  {conference_id:10505,fantasy_data_key:18, name: 'SEC - West'},
  {conference_id:10506,fantasy_data_key:10, name: 'FBS Independents'}, 
  {conference_id: 10507,fantasy_data_key: 1, name: 'American Athletic - East' },
  {conference_id: 10507, fantasy_data_key: 2, name: 'American Athletic - West' },
  {conference_id: 10508, fantasy_data_key: 8, name: 'Conference USA East' },
  {conference_id: 10508, fantasy_data_key: 9, name: 'Conference USA West' },
  {conference_id: 10509, fantasy_data_key: 11, name: 'Mid-American - East' },
  {conference_id: 10509, fantasy_data_key: 12, name: 'Mid-American - West' },
  {conference_id: 10510,fantasy_data_key: 13,name: 'Mountain West - Mountain' },
  {conference_id: 10510,fantasy_data_key: 14,name: 'Mountain West - West' },
  {conference_id: 10511, fantasy_data_key: 19, name: 'Sun Belt Conference' },
  { conference_id: 10601,
    fantasy_data_key: 1,
    name: 'American Athletic' },
  { conference_id: 10608,
    fantasy_data_key: 2,
    name: 'America East' },
  { conference_id: 10602,
    fantasy_data_key: 3,
    name: 'Atlantic Coast' },
  { conference_id: 10609,
    fantasy_data_key: 4,
    name: 'Atlantic Sun' },
  { conference_id: 10610,
    fantasy_data_key: 5,
    name: 'Atlantic 10' },
  { conference_id: 10603, fantasy_data_key: 6, name: 'Big East' },
  { conference_id: 10611, fantasy_data_key: 7, name: 'Big Sky' },
  { conference_id: 10612, fantasy_data_key: 8, name: 'Big South' },
  { conference_id: 10604, fantasy_data_key: 9, name: 'Big Ten' },
  { conference_id: 10605, fantasy_data_key: 10, name: 'Big 12' },
  { conference_id: 10613, fantasy_data_key: 11, name: 'Big West' },
  { conference_id: 10614,
    fantasy_data_key: 12,
    name: 'Colonial Athletic' },
  { conference_id: 10615,
    fantasy_data_key: 13,
    name: 'Conference USA' },
  { conference_id: 10616,
    fantasy_data_key: 14,
    name: 'Horizon League' },
  { conference_id: 10617,
    fantasy_data_key: 15,
    name: 'Independents' },
  { conference_id: 10618,
    fantasy_data_key: 16,
    name: 'Ivy League' },
  { conference_id: 10619,
    fantasy_data_key: 17,
    name: 'Metro Atlantic Athletic' },
  { conference_id: 10620,
    fantasy_data_key: 18,
    name: 'Mid-American' },
  { conference_id: 10621,
    fantasy_data_key: 19,
    name: 'Mid-Eastern' },
  { conference_id: 10622,
    fantasy_data_key: 20,
    name: 'Missouri Valley' },
  { conference_id: 10623,
    fantasy_data_key: 21,
    name: 'Mountain West' },
  { conference_id: 10624, fantasy_data_key: 22, name: 'Northeast' },
  { conference_id: 10625,
    fantasy_data_key: 23,
    name: 'Ohio Valley' },
  { conference_id: 10606, fantasy_data_key: 24, name: 'Pac-12' },
  { conference_id: 10626,
    fantasy_data_key: 25,
    name: 'Patriot League' },
  { conference_id: 10607,
    fantasy_data_key: 26,
    name: 'Southeastern' },
  { conference_id: 10627, fantasy_data_key: 27, name: 'Southern' },
  { conference_id: 10628, fantasy_data_key: 28, name: 'Southland' },
  { conference_id: 10629,
    fantasy_data_key: 29,
    name: 'Southwestern Athletic' },
  { conference_id: 10630, fantasy_data_key: 30, name: 'Summit' },
  { conference_id: 10631, fantasy_data_key: 31, name: 'Sun Belt' },
  { conference_id: 10632,
    fantasy_data_key: 32,
    name: 'West Coast' },
  { conference_id: 10633,
    fantasy_data_key: 33,
    name: 'Western Athletic' } ]


exports.seed = function(knex) {
  // Deletes ALL existing entries
  return  knex.withSchema('sports').table('conferences_link').del()
    .then(function () {
      // Inserts seed entries
      return knex.withSchema('sports').table('conferences_link').insert(data)
    })
}

