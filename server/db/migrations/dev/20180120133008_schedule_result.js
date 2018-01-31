exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('sports').createTable('schedule', (table) => {
      table.increments()
      table.integer('global_game_id').notNullable().unique()
      table.decimal('home_team_id',6,0).notNullable()
      table.decimal('away_team_id',6,0).notNullable()
      table.string('date_time').notNullable()
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('sports').dropTable('schedule')

  ])
}
