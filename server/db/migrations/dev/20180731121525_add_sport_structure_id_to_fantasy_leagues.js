exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('fantasy').table('leagues', function(t) {
            t.integer('sport_structure_id').notNullable().defaultTo(1)
            t.dropColumn('scoring_type_id')
        })
])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('fantasy').table('leagues', (table) => {
            table.dropColumn('sport_structure_id')
            table.integer('scoring_type_id')
        })
    ])
};