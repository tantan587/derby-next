exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('fantasy').table('projections', function(t) {
            t.integer('sport_structure_id').notNullable().defaultTo(2)
        }), 
        knex.schema.withSchema('analysis').table('record_projections', function(t) {
            t.integer('year').notNullable()
        })
])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('fantasy').table('projections', (table) => {
            table.dropColumn('sport_structure_id')
        }),
        knex.schema.withSchema('analysis').table('record_projections', (table) => {
            table.dropColumn('year')
        })
    ])
};