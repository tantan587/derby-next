
exports.up = function(knex, Promise) {

  return Promise.all([
    knex.schema.withSchema('fantasy').table('team_points', (table) => {
    table.dropColumn('league_id')
  })
])
}

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.withSchema('fantasy').table('team_points', function(t) {
    t.string('league_id')
  })])
}
