
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('draft').table('settings', function(t) {
      t.boolean('dirty').notNullable().defaultTo(false)
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('draft').table('settings', (table) => {
      table.dropColumn('dirty')
    })
  ])
}
