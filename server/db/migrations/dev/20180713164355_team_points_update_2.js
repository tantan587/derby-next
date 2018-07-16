
exports.up = function(knex, Promise) {
  return Promise.all([knex.schema.withSchema('fantasy').table('team_points', function(t) {
    t.decimal('playoff_points',8,2).notNullable().defaultTo(0.00)
  })])
}

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.withSchema('fantasy').table('team_points', (table) => {
    table.dropColumn('playoff_points')
  })])
}
