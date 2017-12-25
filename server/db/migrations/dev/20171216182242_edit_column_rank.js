
exports.up = (knex, Promise) => {
  return Promise.all([
  knex.schema.withSchema('fantasy').table('points', function(t) {
      t.dropColumn('rank')
    }),
  knex.schema.withSchema('fantasy').table('points', function(t) {
    t.integer('rank').notNullable();
  })

  ])
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.withSchema('fantasy').table('points', function(t) {
      t.dropColumn('rank')
    }),
  knex.schema.withSchema('fantasy').table('points', function(t) {
    t.boolean('rank').notNullable();
  })
  ])};
