
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('sports').table('schedule', function(t) {
      t.json('game_extra')
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.withSchema('sports').table('schedule', (table) => {
    table.dropColumn('game_extra')
  })])
}
