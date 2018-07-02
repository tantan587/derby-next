
var data = 
[
  {sport_id:101, conference_id:10101, name: 'Eastern', display_name: 'NBA East'},
  {sport_id:101, conference_id:10102, name: 'Western', display_name: 'NBA West'},
  {sport_id:102, conference_id:10201, name: 'AFC', display_name: 'AFC'},
  {sport_id:102, conference_id:10202, name: 'NFC', display_name: 'NFC'},
  {sport_id:103, conference_id:10301, name: 'AL', display_name: 'AL'},
  {sport_id:103, conference_id:10302, name: 'NL', display_name: 'NL'},
  {sport_id:104, conference_id:10401, name: 'Eastern', display_name: 'NHL East'},
  {sport_id:104, conference_id:10402, name: 'Western', display_name: 'NHL West'},
  {sport_id:105, conference_id:10501, name: 'Atlantic Coast', display_name: 'ACC'},
  {sport_id:105, conference_id:10502, name: 'Big 12', display_name: 'Big 12'},
  {sport_id:105, conference_id:10503, name: 'Big Ten', display_name: 'Big Ten'},
  {sport_id:105, conference_id:10504, name: 'Pac-12', display_name: 'Pac-12'},
  {sport_id:105, conference_id:10505, name: 'SEC', display_name: 'SEC'},
  {sport_id:105, conference_id:10506, name: 'FBS Independents', display_name: 'None'},
  {sport_id:105, conference_id:10507, name: 'American Athletic', display_name: 'AAC'},
  {sport_id:105, conference_id:10508, name: 'Conference USA', display_name: 'Conference USA'},
  {sport_id:105, conference_id:10509, name: 'Mid-American', display_name: 'MAC'},
  {sport_id:105, conference_id:10510, name: 'Mountain West', display_name: 'Mountain West'},
  {sport_id:105, conference_id:10511, name: 'Sun Belt', display_name: 'Sun Belt'},
  {sport_id:106, conference_id:10601, name: 'American Athletic', display_name: 'AAC'},
  {sport_id:106, conference_id:10602, name: 'American Coast', display_name: 'ACC'},
  {sport_id:106, conference_id:10603, name: 'Big East', display_name: 'Big East'},
  {sport_id:106, conference_id:10604, name: 'Big Ten', display_name: 'Big Ten'},
  {sport_id:106, conference_id:10605, name: 'Big 12', display_name: 'Big 12'},
  {sport_id:106, conference_id:10606, name: 'Pac-12', display_name: 'Pac-12'},
  {sport_id:106, conference_id:10607, name: 'SEC', display_name: 'SEC'},
  { sport_id: 106, conference_id: 10608, name: 'America East', display_name: 'America East' },
  { sport_id: 106, conference_id: 10609, name: 'Atlantic Sun', display_name: 'Atlantic Sun' },
  { sport_id: 106, conference_id: 10610, name: 'Atlantic 10', display_name: 'Atlantic 10' },
  { sport_id: 106, conference_id: 10611, name: 'Big Sky', display_name: 'Big Sky' },
  { sport_id: 106, conference_id: 10612, name: 'Big South', display_name: 'Big South' },
  { sport_id: 106, conference_id: 10613, name: 'Big West', display_name: 'Big West' },
  { sport_id: 106, conference_id: 10614, name: 'Colonial Athletic', display_name: 'Colonial Athletic' },
  { sport_id: 106, conference_id: 10615, name: 'Conference USA', display_name: 'Conference USA' },
  { sport_id: 106, conference_id: 10616, name: 'Horizon League', display_name: 'Horizon League' },
  { sport_id: 106, conference_id: 10617, name: 'Independents', display_name: 'Independents' },
  { sport_id: 106, conference_id: 10618, name: 'Ivy League', display_name: 'Ivy League' },
  { sport_id: 106, conference_id: 10619, name: 'Metro Atlantic Athletic', display_name: 'Metro Atlantic Athletic' },
  { sport_id: 106, conference_id: 10620, name: 'Mid-American', display_name: 'Mid-American' },
  { sport_id: 106, conference_id: 10621, name: 'Mid-Eastern', display_name: 'Mid-Eastern' },
  { sport_id: 106, conference_id: 10622, name: 'Missouri Valley', display_name: 'Missouri Valley' },
  { sport_id: 106, conference_id: 10623, name: 'Mountain West', display_name: 'Mountain West' },
  { sport_id: 106, conference_id: 10624, name: 'Northeast', display_name: 'Northeast' },
  { sport_id: 106, conference_id: 10625, name: 'Ohio Valley', display_name: 'Ohio Valley' },
  { sport_id: 106, conference_id: 10626, name: 'Patriot League', display_name: 'Patriot League' },
  { sport_id: 106, conference_id: 10627, name: 'Southern', display_name: 'Southern' },
  { sport_id: 106, conference_id: 10628, name: 'Southland', display_name: 'Southland' },
  { sport_id: 106, conference_id: 10629, name: 'Southwestern Athletic', display_name: 'Southwestern Athletic' },
  { sport_id: 106, conference_id: 10630, name: 'Summit', display_name: 'Summit' },
  { sport_id: 106, conference_id: 10631, name: 'Sun Belt', display_name: 'Sun Belt' },
  { sport_id: 106, conference_id: 10632, name: 'West Coast', display_name: 'West Coast' },
  { sport_id: 106, conference_id: 10633, name: 'Western Athletic', display_name: 'Western Athletic' },
  {sport_id:107, conference_id:10701, name: 'EPL', display_name: 'N/A'}]

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return  knex.withSchema('sports').table('conferences').del()
    .then(function () {
      // Inserts seed entries
      return knex.withSchema('sports').table('conferences').insert(data)
    })
}
