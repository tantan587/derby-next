exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('analysis').table('current_elo', function(t) {
            t.dropUnique('team_id')
        })
])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('analysis').table('current_elo', (table) => {
            table.unique('team_id')
        })
    ])
};