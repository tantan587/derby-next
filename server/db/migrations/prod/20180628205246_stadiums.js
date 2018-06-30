
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('sports').createTable('stadium', (table) => {
      table.increments()
      table.decimal('stadium_id',6,0).notNullable().unique()
      table.string('name').notNullable()
      table.string('city')
      table.string('state')
    }),
    knex.schema.withSchema('sports').table('data_link', (table) => {
      table.integer('global_team_id')
      table.dropColumn('team_name')
      table.dropColumn('fantasydata_id')
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('sports').dropTable('stadium'),
    knex.schema.withSchema('sports').table('data_link', (table) => {
      table.dropColumn('global_team_id')
      table.string('team_name')
      table.string('fantasydata_id')
    })
  ])
}
