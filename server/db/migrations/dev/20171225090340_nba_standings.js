
exports.up = (knex, Promise) => {
  return Promise.all([knex.schema.withSchema('sports').createTable('nba_standings', (table) => {
    table.increments()
    table.decimal('team_id',6,0).unique().notNullable()
    table.integer('wins').notNullable()
    table.integer('losses').notNullable()
    table.integer('conference_wins').notNullable()
    table.integer('conference_losses').notNullable()
  })])
}

exports.down = (knex, Promise) => {
  return knex.schema.withSchema('sports').dropTable('nba_standings')
}
