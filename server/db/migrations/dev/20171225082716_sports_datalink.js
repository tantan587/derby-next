
exports.up = (knex, Promise) => {
  return knex.schema.withSchema('sports').createTable('datalink', (table) => {
    table.increments()
    table.string('fantasydata_id').unique().notNullable()
    table.string('team_name').unique().notNullable()
    table.integer('sport').unique().notNullable()
    table.string('team_id').notNullable()
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.withSchema('sports').dropTable('datalink');
}

