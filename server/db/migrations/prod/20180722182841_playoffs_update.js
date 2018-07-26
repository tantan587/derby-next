
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('sports').createTable('playoff_types', (table) => {
      table.integer('type_id').notNullable().unique()
      table.string('playoff_status').notNullable()
    }),
    knex.schema.withSchema('sports').table('schedule', function(t) {
      t.json('game_extra')
    }),
    knex.schema.withSchema('sports').table('playoff_standings', function(t) {
      t.dropColumn('playoff_status')
    }),
    knex.schema.withSchema('sports').table('playoff_standings', function(t) {
      t.integer('playoff_status').defaultTo(1)
    }),
    knex.schema.withSchema('fantasy').table('projections', function(t) {
      t.integer('ranking')
    }),
    knex.schema.withSchema('fantasy').table('points', function(t) {
      t.decimal('total_projected_points', 8, 2)
      t.integer('projected_rank')
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('sports').dropTable('playoff_types'),
    knex.schema.withSchema('sports').table('schedule', (table) => {
      table.dropColumn('game_extra')
    }),
    knex.schema.withSchema('sports').table('playoff_standings', (t) => {
      t.dropColumn('playoff_status')
    }),
    knex.schema.withSchema('sports').table('playoff_standings', function(t) {
      t.string('playoff_status').defaultTo('tbd')
    }),
    knex.schema.withSchema('fantasy').table('projections', (t) => {
      t.dropColumn('ranking')
    }),
    knex.schema.withSchema('fantasy').table('points', function(t) {
      t.dropColumn('total_projected_points')
      t.dropColumn('projected_rank')
    })
  ])
}

