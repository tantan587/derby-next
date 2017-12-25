
exports.up = (knex, Promise) => {
  return knex.schema.withSchema('sports').createTable('nba_info', (table) => {
    table.increments()
    table.decimal('team_id',6,0).unique().notNullable()
    table.string('key').notNullable()
    table.string('city').notNullable()
    table.string('name').notNullable()
    table.string('conference').notNullable()
    table.string('division').notNullable()
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.withSchema('sports').dropTable('nba_info')
}
