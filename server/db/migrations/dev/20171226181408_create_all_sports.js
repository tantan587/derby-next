
exports.up = (knex, Promise) => {
  return Promise.all([knex.schema.withSchema('sports').dropTable('nba_info'),
    knex.schema.withSchema('sports').createTable('team_info', (table) => {
      table.increments()
      table.decimal('sport_id',3,0).notNullable()
      table.decimal('team_id',6,0).unique().notNullable()
      table.string('key').notNullable()
      table.string('city').notNullable()
      table.string('name')
      table.string('conference')
      table.string('division')
    })
  ])
}

exports.down = (knex, Promise) => {
  return knex.schema.withSchema('sports').dropTable('team_info')
}
