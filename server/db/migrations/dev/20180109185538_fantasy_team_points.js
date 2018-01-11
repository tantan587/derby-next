
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.withSchema('fantasy').createTable('team_points', (table) => {
      table.increments()
      table.string('league_id').notNullable()
      table.decimal('team_id',6,0).notNullable()
      table.decimal('reg_points',8,2).notNullable()
      table.decimal('bonus_points',8,2).notNullable()
    })
  ])
}

exports.down = (knex, Promise) => {
  return knex.schema.withSchema('fantasy').dropTable('team_points')
}

