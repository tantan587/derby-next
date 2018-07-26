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
        }),
        knex.schema.withSchema('fantasy').createTable('league_bundle', (table) => {
            table.integer('league_bundle_id').notNullable().unique()
            table.json('current_sport_seasons').notNullable()
            table.integer('previous_year_league_bundle')
            table.string('name')
        }),
        //this should probably have a boolean that says if a league is active - if it is not active, it shoudl not be updated
        knex.schema.withSchema('fantasy').createTable('sports_structure', (table) => {
            table.integer('sport_structure_id').notNullable().unique()
            table.integer('league_bundle_id').notNullable()
            table.integer('scoring_type_id').notNullable()
        }),
        knex.schema.withSchema('fantasy').table('team_points', function(t) {
            t.integer('sport_structure_id').notNullable().defaultTo(2)
        }),
        knex.schema.withSchema('sports').table('standings', function(t) {
            t.integer('sport_seasons_id').notNullable().defaultTo(0)
        })
])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('sports').dropTable('sport_season'),
        knex.schema.withSchema('fantasy').dropTable('league_bundle'),
        knex.schema.withSchema('sports').dropTable('sports_structure'),
        knex.schema.withSchema('fantasy').table('team_points', (table) => {
            table.dropColumn('sport_structure_id')
        }),
        knex.schema.withSchema('sports').table('standings', (table) => {
            table.dropColumn('sport_season_id')
        })
    ])
};