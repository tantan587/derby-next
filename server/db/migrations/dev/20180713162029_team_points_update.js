
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('fantasy').table('team_points', function(t) {
    t.integer('scoring_type_id').notNullable().defaultTo(1)
  })
])
}

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.withSchema('fantasy').table('team_points', (table) => {
    table.dropColumn('scoring_type_id')
  })])
}
