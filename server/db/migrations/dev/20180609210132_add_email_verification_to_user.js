
exports.up = function(knex, Promise) {
  return knex.schema.withSchema('users').table('users', (t) => {
    t.boolean('verified').notNullable().defaultTo(false)
    t.string('verification_code').notNullable().defaultTo(Math.floor(1000 + Math.random() * 9000))
    t.timestamp('expires_at').notNullable().defaultTo(knex.raw("now() + INTERVAL '15 minutes'"))
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.withSchema('users').table('users', (t) => {
    t.dropColumn('verified')
    t.dropColumn('verification_code')
    t.dropColumn('expires_at')
  })
}
