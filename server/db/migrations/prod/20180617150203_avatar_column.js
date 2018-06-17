
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('fantasy').table('owners', (table) => {
      table.json('avatar')
    })
  ])
}

exports.down = function(knex, Promise) {
  
}
