
exports.up = function(knex, Promise) { 
  return Promise.all([ 
    knex.schema.withSchema('sports').createTable('sport_season', (table) => { 
      table.integer('sport_season_id').notNullable().unique() 
      table.integer('sport_id').notNullable() 
      table.integer('year').notNullable() 
      table.integer('season_type').notNullable() 
      table.date('start_pull_date') 
      table.date('end_pull_date') 
      table.string('api_pull_parameter')
      table.date('start_season_date'), 
      table.date('end_season_date') 
    }), 
    knex.schema.withSchema('fantasy').createTable('league_bundle', (table) => { 
      table.integer('league_bundle_id').notNullable().unique() 
      table.json('current_sport_seasons').notNullable() 
      table.string('name') 
    }), 
    //this should probably have a boolean that says if a league is active - if it is not active, it shoudl not be updated 
    knex.schema.withSchema('fantasy').createTable('sports_structure', (table) => { 
      table.integer('sport_structure_id').notNullable().unique() 
      table.integer('league_bundle_id').notNullable() 
      table.integer('scoring_type_id').notNullable() 
      table.integer('previous_sport_structure_id') 
      table.boolean('active') 
    }), 
    knex.schema.withSchema('fantasy').table('team_points', function(t) { 
      t.integer('sport_structure_id').notNullable().defaultTo(2) 
    }), 
    knex.schema.withSchema('sports').table('standings', function(t) { 
      t.integer('sport_season_id').notNullable().defaultTo(0)
      t.dropUnique('team_id') 
    }), 
    knex.schema.withSchema('sports').table('playoff_standings', function(t) { 
      t.integer('sport_season_id').notNullable().defaultTo(0)
      t.dropUnique('team_id') 
    }),
    knex.schema.withSchema('sports').table('schedule', function(t) { 
      t.integer('sport_season_id').notNullable().defaultTo(0) 
    }),
    knex.schema.withSchema('fantasy').table('leagues', function(t) { 
      t.integer('sport_structure_id').notNullable().defaultTo(1) 
      t.dropColumn('scoring_type_id') 
    }),
    knex.schema.withSchema('draft').table('settings', function(t) { 
      t.string('state').defaultTo('pre') 
    }),
    knex.schema.withSchema('fantasy').table('projections', function(t) { 
      t.integer('sport_structure_id').notNullable().defaultTo(2) 
    }),  
    knex.schema.withSchema('analysis').table('record_projections', function(t) { 
      t.integer('year').notNullable() 
    })
  ]) 
}
 
exports.down = function(knex, Promise) { 
  return Promise.all([ 
    knex.schema.withSchema('sports').dropTable('sport_season'), 
    knex.schema.withSchema('fantasy').dropTable('league_bundle'), 
    knex.schema.withSchema('fantasy').dropTable('sports_structure'), 
    knex.schema.withSchema('fantasy').table('team_points', (table) => { 
      table.dropColumn('sport_structure_id') 
    }), 
    knex.schema.withSchema('sports').table('standings', (table) => { 
      table.dropColumn('sport_season_id')
      table.unique('team_id') 
    }), 
    knex.schema.withSchema('sports').table('playoff_standings', (table) => { 
      table.dropColumn('sport_season_id')
      table.unique('team_id') 
    }),
    knex.schema.withSchema('sports').table('schedule', (table) => { 
      table.dropColumn('sport_season_id') 
    }),
    knex.schema.withSchema('fantasy').table('leagues', (table) => { 
      table.dropColumn('sport_structure_id') 
      table.integer('scoring_type_id') 
    }),
    knex.schema.withSchema('draft').table('settings', (t) => { 
      t.dropColumn('state')  
    }),
    knex.schema.withSchema('fantasy').table('projections', (table) => { 
      table.dropColumn('sport_structure_id') 
    }), 
    knex.schema.withSchema('analysis').table('record_projections', (table) => { 
      table.dropColumn('year') 
    })
  ]) 
}

