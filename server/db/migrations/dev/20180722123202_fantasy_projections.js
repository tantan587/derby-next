
exports.up = function(knex, Promise) {
  return Promise.all([
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
  return Promise.all([knex.schema.withSchema('fantasy').table('projections', (t) => {
    t.dropColumn('ranking')
  }),
  knex.schema.withSchema('fantasy').table('points', function(t) {
    t.dropColumn('total_projected_points')
    t.dropColumn('projected_rank')
  })])
}
