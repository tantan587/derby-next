
exports.up = function(knex, Promise) {
  return knex.schema.withSchema('users').table('users', (t) => {
    t.boolean('verified')
    t.string('verification_code')
    t.timestamp('expires_at').notNullable().defaultTo(knex.raw("now() + INTERVAL '15 minutes'"))
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.withSchema('users').table('users', (t) => {
    t.dropColumn('verified')
    t.dropColumn('verification_code')
    t.dropColumn('expires_at')
  })
};
