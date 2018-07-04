
exports.up = function(knex, Promise) {
  return Promise.all([knex.schema.withSchema('sports').table('playoff_standings', (table) => {
    table.integer('bowl_wins')
  })])
}

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.withSchema('sports').table('playoff_standings', (table) => {
    table.dropColumn('bowl_wins')
  })])
}

