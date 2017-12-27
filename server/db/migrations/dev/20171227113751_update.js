
exports.up = (knex, Promise) => {
  return Promise.all([
  knex.schema.withSchema('sports').table('team_info', function(t) {
      t.dropColumn('conference')
    }),
  knex.schema.withSchema('sports').table('team_info', function(t) {
    t.decimal('conference_id',5,0).notNullable();
  })
  ])
};

exports.down = (knex, Promise) => {
  return Promise.all([
  ])};