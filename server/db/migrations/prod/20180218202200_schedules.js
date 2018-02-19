
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.withSchema('sports').table('team_info', function(t) {
      t.string('logo_url').notNullable()
      t.integer('global_team_id').notNullable()
    }),
    knex.schema.withSchema('sports').createTable('schedule', (table) => {
      table.increments()
      table.integer('global_game_id').notNullable().unique()
      table.decimal('home_team_id',6,0).notNullable()
      table.decimal('away_team_id',6,0).notNullable()
      table.string('date_time').notNullable()
      table.integer('day_count').notNullable()
      table.decimal('sport_id',3,0).notNullable()
    }),
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
    knex.schema.withSchema('sports').dropTable('schedule'),
    knex.schema.withSchema('sports').dropTable('results')
  ])
}
