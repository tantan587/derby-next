
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('analysis').createTable('current_elo', (table) => {
      table.decimal('team_id',6,0).notNullable().unique()
      table.decimal('elo',6,2).notNullable()
    }),
    knex.schema.withSchema('analysis').renameTable('elo', 'historical_elo'),
    knex.schema.withSchema('analysis').table('record_projections', (table) => {
      table.integer('day_count').notNullable()
    }),
    knex.schema.withSchema('analysis').table('game_projections', (table) => {
      table.integer('scoring_type_id').notNullable()
    })
  ])
}

exports.down = function(knex, Promise) {
  
}
