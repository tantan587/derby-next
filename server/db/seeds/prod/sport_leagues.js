var data = 
[
  {sport_name:'NBA',sport_id:101,type:'Basketball',fantasy_data_key:'TBD'},
  {sport_name:'NFL',sport_id:102,type:'Football',fantasy_data_key:'TBD'},
  {sport_name:'MLB',sport_id:103,type:'Baseball',fantasy_data_key:'TBD'},
  {sport_name:'NHL',sport_id:104,type:'Hockey',fantasy_data_key:'TBD'},
  {sport_name:'CFB',sport_id:105,type:'Football',fantasy_data_key:'TBD'},
  {sport_name:'CBB',sport_id:106,type:'Basketball',fantasy_data_key:'TBD'},
  {sport_name:'EPL',sport_id:107,type:'Soccer',fantasy_data_key:'TBD'}]

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return  null
  
  // knex.withSchema('sports').table('leagues').del()
  //   .then(function () {
  //     // Inserts seed entries
  //     return knex.withSchema('sports').table('leagues').insert(data)
  //   })
}

