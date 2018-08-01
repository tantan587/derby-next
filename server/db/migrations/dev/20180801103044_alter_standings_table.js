exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('sports').table('standings', function(t) {
            t.dropUnique('team_id')
        }),
        knex.schema.withSchema('sports').table('playoff_standings', function(t) {
            t.dropUnique('team_id')
        })
])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('sports').table('standings', (table) => {
            table.unique('team_id')
        }),
        knex.schema.withSchema('sports').table('playoff_standings', (table) => {
            table.unique('team_id')
        })
    ])
};