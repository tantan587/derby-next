
exports.up = function(knex, Promise) {
  return Promise.all([
  //   knex.schema.withSchema('fantasy').table('data_link', (table) => {
  //   table.integer('global_team_id')
  //   table.dropColumn('team_name')
  //   table.dropColumn('fantasydata_id')
  // })
])
}

exports.down = function(knex, Promise) {
  return Promise.all([
  //   knex.schema.withSchema('fantasy').table('data_link', (table) => {
  //   table.dropColumn('global_team_id')
  //   table.string('team_name')
  //   table.string('fantasydata_id')
  // })
])
}
