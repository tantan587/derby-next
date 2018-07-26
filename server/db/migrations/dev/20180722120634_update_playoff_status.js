
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('sports').table('playoff_standings', function(t) {
      t.dropColumn('playoff_status')
    }),
    knex.schema.withSchema('sports').table('playoff_standings', function(t) {
      t.integer('playoff_status').defaultTo(1)
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.withSchema('sports').table('playoff_standings', (t) => {
    t.dropColumn('playoff_status')
  }),
  knex.schema.withSchema('sports').table('playoff_standings', function(t) {
    t.string('playoff_status').defaultTo('tbd')
  })])
}
