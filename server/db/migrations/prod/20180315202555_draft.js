exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('draft').createTable('results', (table) => {
      table.increments()
      table.string('room_id').notNullable()
      table.string('initiator').notNullable()
      table.timestamp('client_ts')
      table.timestamp('server_ts').notNullable()
      table.string('action_type').notNullable()
      table.json('action').notNullable()
    }),
    knex.schema.withSchema('draft').createTable('settings', (table) => {
      table.increments()
      table.string('league_id').notNullable().unique()
      table.timestamp('start_time').notNullable()
      table.string('type').notNullable()
      table.string('room_id').notNullable()
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('draft').dropTable('results'),
    knex.schema.withSchema('draft').dropTable('settings')
  ])
}
