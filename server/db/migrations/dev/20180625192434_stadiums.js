
exports.up = function(knex, Promise) {
  return Promise.all([knex.schema.withSchema('sports').createTable('stadium', (table) => {
    table.increments()
    table.decimal('stadium_id',6,0).notNullable().unique()
    table.string('name').notNullable()
    table.string('city')
    table.string('state')
  })])
}

exports.down = function(knex, Promise) {
  knex.schema.withSchema('sports').dropTable('stadium')
}
