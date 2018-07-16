
exports.up = function(knex, Promise) {
  return Promise.all([knex.schema.withSchema('sports').createTable('playoff_standings', (table) => {
    table.increments()
    table.decimal('team_id',6,0).unique().notNullable()
    table.integer('playoff_wins').notNullable()
    table.integer('playoff_losses').notNullable()
    table.integer('byes').notNullable()
    table.string('playoff_status').notNullable()
    table.integer('bowl_wins')
    table.integer('year')
  }),
  knex.schema.withSchema('sports').table('schedule', function(t) {
    t.integer('home_team_score')
    t.integer('away_team_score')
    t.string('status')
    t.string('winner')
    t.string('time')
    t.string('period')
    t.string('updated_time')
    t.integer('season_type', 2,0)
    t.integer('year',4,0)
  }),
  knex.schema.withSchema('sports').table('standings', function(t) {
    t.integer('year')
  }),
  knex.schema.withSchema('fantasy').table('team_points', function(t) {
    t.integer('scoring_type_id').notNullable().defaultTo(1)
    t.decimal('playoff_points',8,2).notNullable().defaultTo(0.00)
  }),
  knex.schema.withSchema('sports').createTable('premier_status', (table) => {
    table.decimal('team_id',6,0).unique().notNullable()
    table.boolean('division_1').notNullable()
  }),
  knex.schema.withSchema('fantasy').table('team_points', (table) => {
    table.dropColumn('league_id')
  })
  ])
}


exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('sports').dropTable('playoff_standings'),
    knex.schema.withSchema('sports').table('schedule', (table) => {
      table.dropColumn('home_team_score')
      table.dropColumn('away_team_score')
      table.dropColumn('status')
      table.dropColumn('winner')
      table.dropColumn('time')
      table.dropColumn('period')
      table.dropColumn('updated_time')
      table.dropColumn('season_type')
      table.dropColumn('year')
    }),
    knex.schema.withSchema('sports').table('standings', (table) => {
      table.dropColumn('year')
    }),
    knex.schema.withSchema('sports').dropTable('premier_status'),
    knex.schema.withSchema('fantasy').table('team_points', (table) => {
      table.dropColumn('scoring_type_id')
      table.dropColumn('playoff_points')
    }),
    knex.schema.withSchema('fantasy').table('team_points', function(t) {
      t.string('league_id')
    })
  ])
}