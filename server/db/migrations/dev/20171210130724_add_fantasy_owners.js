
exports.up = (knex, Promise) => {
  return Promise.all([
     knex.schema.withSchema('fantasy').createTable('owners', (table) => {
    table.increments();
    table.string('league_id').notNullable()
    table.string('user_id').notNullable();
    table.string('owner_id').unique().notNullable();
    table.string('owner_name').notNullable()
    table.boolean('commissioner').notNullable()
    table.timestamps();
  }),
  knex.schema.withSchema('fantasy').table('rosters', function(t) {
    t.string('owner_id').notNullable();
  }),
  knex.schema.withSchema('fantasy').table('rosters', function(t) {
    t.dropColumn('roster_id')
  })
  ])
};

exports.down = (knex, Promise) => {
  return Promise.all([
     knex.schema.withSchema('fantasy').dropTable('owners'),
     knex.schema.withSchema('fantasy').table('rosters', function(t) {
      t.string('roster_id').notNullable();
    }),
    knex.schema.withSchema('fantasy').table('rosters', function(t) {
      t.dropColumn('owner_id')
    })
  ])};
