exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('users').table('users', function(t) {
            t.date('birthday'),
            t.string('gender'),
            t.boolean('terms')

        })
])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('users').table('users', (table) => {
            table.dropColumn('birthday'),
            table.dropColumn('gender'),
            table.dropColumn('terms')
        })
    ])
};