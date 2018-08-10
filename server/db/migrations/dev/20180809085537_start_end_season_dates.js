exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('sports').table('sport_season', function(t) {
            t.date('start_season_date'),
            t.date('end_season_date')

        })
])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('sports').table('sport_season', (table) => {
            table.dropColumn('start_season_date'),
            table.dropColumn('end_season_date')
        })
    ])
};