
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('analysis').createTable('elo', (table) => {
      table.decimal('team_id',6,0).notNullable()
      table.decimal('elo',6,2).notNullable()
      table.date('date').notNullable()
    }),
    knex.schema.withSchema('analysis').createTable('record_projections', (table) => {
      table.decimal('team_id',6,0).notNullable().unique() //FOR PROD MAKE NOT UNIQUE
      table.decimal('wins',5,2).notNullable()
      table.decimal('losses',5,2).notNullable()
      table.decimal('ties',5,2).notNullable()
      table.json('playoff').notNullable()
    }),
    knex.schema.withSchema('analysis').createTable('game_projections', (table) => {
      table.decimal('team_id',6,0).notNullable()
      table.integer('global_game_id').notNullable()
      table.decimal('win_percentage',4,4).notNullable()
      table.decimal('impact',5,2).notNullable()
    }),
    knex.schema.withSchema('fantasy').createTable('projections', (table) => {
      table.decimal('team_id',6,0).notNullable()
      table.integer('scoring_type_id').notNullable()
      table.decimal('points',8,2).notNullable()
      table.date('date').notNullable()
    }),
    knex.schema.withSchema('fantasy').createTable('scoring', (table) => {
      table.integer('scoring_type_id').notNullable()
      table.decimal('sport_id',3,0).notNullable()
      table.string('name')
      table.json('regular_season')
      table.json('playoffs')
      table.json('bonus')
    }),
    knex.schema.withSchema('fantasy').table('leagues', function(t) {
      t.integer('scoring_type_id')
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('analysis').dropTable('elo'),
    knex.schema.withSchema('analysis').dropTable('record_projections'),
    knex.schema.withSchema('analysis').dropTable('game_projections'),
    knex.schema.withSchema('analysis').dropTable('projections'),
    knex.schema.withSchema('analysis').dropTable('scoring'),

  ])
}

