
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('draft').table('settings', function(t) {
      t.integer('seconds_pick').defaultTo(60)
    }),
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.withSchema('draft').table('settings', (t) => {
    t.dropColumn('seconds_pick')
  })])
}
