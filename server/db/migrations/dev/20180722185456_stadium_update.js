
exports.up = function(knex, Promise) {
    return Promise.all([
      knex.schema.withSchema('sports').table('schedule', function(t) {
        t.integer('stadium_id')
      })
    ])
  }
  
  exports.down = function(knex, Promise) {
    return Promise.all([knex.schema.withSchema('sports').table('schedule', (t) => {
      t.dropColumn('stadium_id')
    })])
  }
  