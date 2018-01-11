exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('fantasy').createTable('conferences', (table) => {
      table.increments()
      table.string('league_id').notNullable()
      table.decimal('sport_id',3,0).notNullable()
      table.decimal('conference_id',5,0).notNullable()
      table.string('number_teams').notNullable()
    }),
    knex.schema.withSchema('fantasy').createTable('team_points', (table) => {
      table.increments()
      table.string('league_id').notNullable()
      table.decimal('team_id',6,0).notNullable()
      table.decimal('reg_points',8,2).notNullable()
      table.decimal('bonus_points',8,2).notNullable()
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('fantasy').dropTable('conferences'),
    knex.schema.withSchema('fantasy').dropTable('team_points'),
  ])
}
