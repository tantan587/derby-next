
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.withSchema('sports').table('leagues', function(t) {
      t.string('fantasy_data_key')
    }),
    knex.schema.withSchema('sports').createTable('conferences', (table) => {
      table.increments()
      table.decimal('sport_id',3,0).notNullable()
      table.decimal('conference_id',5,0).unique().notNullable()
      table.string('name').notNullable()
      table.string('display_name').notNullable()
    })
  ])
}

exports.down = (knex, Promise) => {
  return knex.schema.withSchema('sports').dropTable('conferences')
}

