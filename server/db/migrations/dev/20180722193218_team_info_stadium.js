
exports.up = function(knex, Promise) {
    return Promise.all([
      knex.schema.withSchema('sports').table('team_info', function(t) {
        t.integer('stadium_id')
      })
    ])
  }
  
  exports.down = function(knex, Promise) {
    return Promise.all([knex.schema.withSchema('sports').table('team_info', (t) => {
      t.dropColumn('stadium_id')
    })])
  }
  