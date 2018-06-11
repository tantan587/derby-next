
var data = 
[
  {sport_id:101, conference_id:10101, name: 'Eastern', display_name: 'East'},
  {sport_id:101, conference_id:10102, name: 'Western', display_name: 'West'},
  {sport_id:102, conference_id:10201, name: 'AFC', display_name: 'AFC'},
  {sport_id:102, conference_id:10202, name: 'NFC', display_name: 'NFC'},
  {sport_id:103, conference_id:10301, name: 'AL', display_name: 'AL'},
  {sport_id:103, conference_id:10302, name: 'NL', display_name: 'NL'},
  {sport_id:104, conference_id:10401, name: 'Eastern', display_name: 'East'},
  {sport_id:104, conference_id:10402, name: 'Western', display_name: 'West'},
  {sport_id:105, conference_id:10501, name: 'Atlantic', display_name: 'ACC'},
  {sport_id:105, conference_id:10502, name: 'Big 12', display_name: 'Big 12'},
  {sport_id:105, conference_id:10503, name: 'Big Ten', display_name: 'Big Ten'},
  {sport_id:105, conference_id:10504, name: 'Pac-12', display_name: 'Pac-12'},
  {sport_id:105, conference_id:10505, name: 'SEC', display_name: 'SEC'},
  {sport_id:105, conference_id:10506, name: 'FBS Independents', display_name: 'None'},
  {sport_id:106, conference_id:10601, name: 'American Athletic', display_name: 'AAC'},
  {sport_id:106, conference_id:10602, name: 'American Coast', display_name: 'ACC'},
  {sport_id:106, conference_id:10603, name: 'Big East', display_name: 'Big East'},
  {sport_id:106, conference_id:10604, name: 'Big Ten', display_name: 'Big Ten'},
  {sport_id:106, conference_id:10605, name: 'Big 12', display_name: 'Big 12'},
  {sport_id:106, conference_id:10606, name: 'Pac-12', display_name: 'Pac-12'},
  {sport_id:106, conference_id:10607, name: 'SEC', display_name: 'SEC'},
  {sport_id:107, conference_id:10701, name: 'EPL', display_name: 'N/A'},
]

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return  knex.withSchema('sports').table('conferences').del()
    .then(function () {
      // Inserts seed entries
      return knex.withSchema('sports').table('conferences').insert(data)
    })
}
