
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.withSchema('sports').table('team_info', function(t) {
      t.string('logo_url').notNullable()
      t.integer('global_team_id').notNullable()
    })
  ])
}

exports.down = (knex, Promise) => {
}
