
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.withSchema('sports').createTable('conferences_link', (table) => {
      table.increments()
      table.decimal('conference_id',5,0).notNullable()
      table.string('fantasy_data_key').notNullable()
      table.string('name').notNullable()
    })
  ])
}

exports.down = (knex, Promise) => {
  return knex.schema.withSchema('sports').dropTable('conferences_link')
}