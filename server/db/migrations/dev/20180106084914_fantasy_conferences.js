

exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.withSchema('fantasy').createTable('conferences', (table) => {
      table.increments()
      table.string('league_id').notNullable()
      table.decimal('sport_id',3,0).notNullable()
      table.decimal('conference_id',5,0).notNullable()
      table.string('number_teams').notNullable()
    })
  ])
}

exports.down = (knex, Promise) => {
  return knex.schema.withSchema('fantasy').dropTable('conferences')
}
