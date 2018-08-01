
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('draft').table('settings', function(t) {
      t.string('state').defaultTo('pre')
    }),
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.withSchema('draft').table('settings', (t) => {
    t.dropColumn('state')
  })])
}