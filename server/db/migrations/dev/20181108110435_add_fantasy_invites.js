const STATUS_ENUM = ['invited_to_signup', 'not_invited', 'invited']


exports.up = function(knex, Promise) {
  return knex.schema.withSchema('fantasy').createTable('invites', (t) => {
    t.increments()
    t.string('invite_id').unique().notNullable()
    t.string('league_id').notNullable()
    t.string('from_id').notNullable()
    t.string('email').notNullable()
    t.enum('status', STATUS_ENUM).notNullable()
    t.timestamps()
    t.index('invite_id')
    t.index('league_id')
    t.unique(['league_id', 'from_id', 'email'])
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.withSchema('fantasy').dropTable('invites')
};
