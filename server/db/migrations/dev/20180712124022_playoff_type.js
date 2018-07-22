
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('types').createTable('playoff_types', (table) => {
            table.integer('type_id').notNullable().unique()
            table.string('playoff_status').notNullable()
    })
])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('sports').dropTable('premier_status')
    ])
};
