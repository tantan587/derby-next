

exports.up = (knex, Promise) => {
  return knex.schema.withSchema('sports').createTable('data_link', (table) => {
    table.increments()
    table.string('fantasydata_id').notNullable()
    table.string('team_name').notNullable()
    table.integer('sport_id').notNullable()
    table.string('team_id').unique().notNullable()
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.withSchema('sports').dropTable('data_link');
}

