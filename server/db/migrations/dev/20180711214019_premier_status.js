exports.up = function(knex, Promise) {
    return Promise.all([knex.schema.withSchema('sports').createTable('premier_status', (table) => {
    table.decimal('team_id',6,0).unique().notNullable()
    table.boolean('division_1').notNullable()
    })
])
}


exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('sports').dropTable('premier_status')
    ])
};