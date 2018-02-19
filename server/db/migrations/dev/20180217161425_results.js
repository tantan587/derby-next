exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('sports').createTable('results', (table) => {
      table.increments()
      table.integer('global_game_id').notNullable().unique()
      table.integer('home_team_score',6,0).notNullable()
      table.integer('away_team_score',6,0).notNullable()
      table.string('status').notNullable()
      table.string('winner').notNullable()
      table.string('time').notNullable()
      table.string('period').notNullable()
      table.string('updated_time').notNullable()
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('sports').dropTable('results')

  ])
}
