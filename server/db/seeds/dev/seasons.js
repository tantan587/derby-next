var data = require('../../../../data/seasons.json')

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return  knex.withSchema('sports').table('season_call').del()
    .then(function () {
      // Inserts seed entries
      return knex.withSchema('sports').table('season_call').insert([
        {"sport_id": 101, "year": 2019, "scoring_type_ids": JSON.stringify([1]), "api_pull_parameter": 2019},
        {"sport_id": 102, "year": 2018, "scoring_type_ids": JSON.stringify([1]), "api_pull_parameter": 2018},        
        {"sport_id": 103, "year": 2019, "scoring_type_ids": JSON.stringify([1]), "api_pull_parameter": 2019},
        {"sport_id": 104, "year": 2019, "scoring_type_ids": JSON.stringify([1]), "api_pull_parameter": 2019},
        {"sport_id": 105, "year": 2018, "scoring_type_ids": JSON.stringify([1]), "api_pull_parameter": 2018},
        {"sport_id": 106, "year": 2019, "scoring_type_ids": JSON.stringify([1]), "api_pull_parameter": 2019},
        {"sport_id": 107, "year": 2019, "scoring_type_ids": JSON.stringify([1]), "api_pull_parameter": 9999999},
        {"sport_id": 101, "year": 2018, "scoring_type_ids": JSON.stringify([1]), "api_pull_parameter": 2018},
        {"sport_id": 102, "year": 2017, "scoring_type_ids": JSON.stringify([1]), "api_pull_parameter": 2017},
        {"sport_id": 103, "year": 2018, "scoring_type_ids": JSON.stringify([1]), "api_pull_parameter": 2018},
        {"sport_id": 104, "year": 2018, "scoring_type_ids": JSON.stringify([1]), "api_pull_parameter": 2018},
        {"sport_id": 105, "year": 2017, "scoring_type_ids": JSON.stringify([1]), "api_pull_parameter": 2017},
        {"sport_id": 106, "year": 2018, "scoring_type_ids": JSON.stringify([1]), "api_pull_parameter": 2018},
        {"sport_id": 107, "year": 2018, "scoring_type_ids": JSON.stringify([1]), "api_pull_parameter": 144}
  
      ])
    })
}