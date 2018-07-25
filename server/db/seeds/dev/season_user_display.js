  exports.seed = function(knex) {
    // Deletes ALL existing entries
    return  knex.withSchema('fantasy').table('season_user_display').del()
      .then(function () {
        // Inserts seed entries
        return knex.withSchema('fantasy').table('season_user_display').insert([
          {"sport_id": 101, "year": 2019, "scoring_type_id": 1, "season_status_type": 1},
          {"sport_id": 102, "year": 2018, "scoring_type_id": 1, "season_status_type": 1},        
          {"sport_id": 103, "year": 2019, "scoring_type_id": 1, "season_status_type": 1},
          {"sport_id": 104, "year": 2019, "scoring_type_id": 1, "season_status_type": 1},
          {"sport_id": 105, "year": 2018, "scoring_type_id": 1, "season_status_type": 1},
          {"sport_id": 106, "year": 2019, "scoring_type_id": 1, "season_status_type": 1},
          {"sport_id": 107, "year": 2019, "scoring_type_id": 1, "season_status_type": 1},
          {"sport_id": 101, "year": 2018, "scoring_type_id": 1, "season_status_type": 2},
          {"sport_id": 102, "year": 2017, "scoring_type_id": 1, "season_status_type": 2},
          {"sport_id": 103, "year": 2018, "scoring_type_id": 1, "season_status_type": 2},
          {"sport_id": 104, "year": 2018, "scoring_type_id": 1, "season_status_type": 2},
          {"sport_id": 105, "year": 2017, "scoring_type_id": 1, "season_status_type": 2},
          {"sport_id": 106, "year": 2018, "scoring_type_id": 1, "season_status_type": 2},
          {"sport_id": 107, "year": 2018, "scoring_type_id": 1, "season_status_type": 2}
    
        ])
      })
  }
