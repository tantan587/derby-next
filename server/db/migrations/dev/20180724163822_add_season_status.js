
exports.up = function(knex, Promise) {
    return Promise.all([
      knex.schema.withSchema('fantasy').table('team_points', function(t) {
        t.integer('season_status_type').notNullable().defaultTo(2)
      })
    ])
  }
  
  exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('fantasy').table('team_points', (t) => {
      t.dropColumn('season_status_type')
    })])
  }
