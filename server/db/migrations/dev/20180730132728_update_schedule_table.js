//this is to add sport season id to schedule table

exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('sports').table('schedule', function(t) {
            t.integer('sport_season_id').notNullable().defaultTo(0)
        })
])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('sports').table('schedule', (table) => {
            table.dropColumn('sport_season_id')
        })
    ])
};