exports.up = function(knex, Promise) {
  return Promise.all([knex.schema.withSchema('sports').createTable('playoff_standings', (table) => {
    table.increments()
    table.decimal('team_id',6,0).unique().notNullable()
    table.integer('playoff_wins').notNullable()
    table.integer('playoff_losses').notNullable()
    table.integer('byes').notNullable()
    table.string('playoff_status').notNullable() //for prod, this should be changed to integer to link to playoff status table
    })
])
}


exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('sports').dropTable('playoff_standings')
  ])
}