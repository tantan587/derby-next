
exports.up = function(knex, Promise) {
  return knex.schema.withSchema('users').table('users', (t) => {
    t.integer('number_of_tries').notNullable().defaultTo(0)
    t.timestamp('expires_at').notNullable().defaultTo(knex.raw("now() + INTERVAL '24 hours'")).alter()
  })  
};

exports.down = function(knex, Promise) {
  return knex.schema.withSchema('users').table('users', (t) => {
    t.dropColumn('number_of_tries')
    t.timestamp('expires_at').notNullable().defaultTo(knex.raw("now() + INTERVAL '15 minutes'")).alter()
  })
};
