exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('sports').createTable('seasons', (table) => {
            table.integer('sport_id').notNullable()
            table.date('start_date').notNullable()
            table.date('end_date').notNullable()
            table.integer('year').notNullable()
            table.integer('season_group_type').notNullable()
            table.integer('status').notNullable()
        }),
        knex.schema.withSchema('sports').createTable('season_status_types', (table) => {
            table.integer('type_id').notNullable().unique()
            table.string('season_status').notNullable()
        }),
        knex.schema.withSchema('sports').createTable('season_group_types', (table) => {
            table.integer('type_id').notNullable().unique()
            table.string('season_group').notNullable()
        })
])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('sports').dropTable('seasons'),
        knex.schema.withSchema('sports').dropTable('season_status_types'),
        knex.schema.withSchema('sports').dropTable('season_group_types')
    ])
};