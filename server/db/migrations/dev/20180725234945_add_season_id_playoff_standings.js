exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('sports').table('playoff_standings', function(t) {
            t.integer('sport_seasons_id').notNullable().defaultTo(0)
        })
])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('sports').table('playoff_standings', (table) => {
            table.dropColumn('sport_season_id')
        })
    ])
};