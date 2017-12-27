
exports.up = (knex, Promise) => {
  return Promise.all([knex.schema.withSchema('sports').dropTable('nba_standings'),
    knex.schema.withSchema('sports').createTable('standings', (table) => {
      table.increments()
      table.decimal('team_id',6,0).unique().notNullable()
      table.integer('wins').notNullable()
      table.integer('losses').notNullable()
      table.integer('ties').notNullable()
    })
  ])
}

exports.down = (knex, Promise) => {
  return knex.schema.withSchema('sports').dropTable('standings')
}

