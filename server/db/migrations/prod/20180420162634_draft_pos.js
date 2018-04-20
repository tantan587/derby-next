
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.withSchema('draft').table('settings', function(t) {
      t.json('draft_position')
    })
  ])
}

exports.down = (knex, Promise) => {
  return Promise.all([
  ])}