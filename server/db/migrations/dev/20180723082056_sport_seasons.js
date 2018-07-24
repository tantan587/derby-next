exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('sports').createTable('season_call', (table) => {
            table.integer('sport_id').notNullable()
            table.date('start_pull_date')
            table.date('end_pull_date')
            table.integer('year').notNullable()
            table.json('scoring_type_ids').notNullable(), //do we need to have a different type of pull in here for epl?
            table.string('api_pull_parameter')
        }),
        knex.schema.withSchema('fantasy').createTable('season_user_display', (table) => {
            table.integer('scoring_type_id').notNullable()
            table.integer('sport_id').notNullable()
            table.date('season_start_date')
            table.date('season_end_date')
            table.integer('year').notNullable()
            table.integer('season_status_type').notNullable()
        }),
        knex.schema.withSchema('sports').createTable('season_status', (table) => {
            table.integer('season_status_type').notNullable().unique()
            table.string('season_status_name').notNullable()
        })
])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('sports').dropTable('season_call'),
        knex.schema.withSchema('fantasy').dropTable('season_user_display'),
        knex.schema.withSchema('sports').dropTable('season_status')
    ])
};