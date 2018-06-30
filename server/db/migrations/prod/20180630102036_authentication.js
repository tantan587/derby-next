exports.up = function(knex, Promise) {
  return Promise.all([knex.raw(`
    CREATE TABLE users.session (
      "sid" varchar NOT NULL COLLATE "default",
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL
    )
    WITH (OIDS=FALSE);
    ALTER TABLE users.session ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
  `),
  knex.schema.withSchema('users').table('users', (t) => {
    t.boolean('verified').notNullable().defaultTo(false)
    t.integer('number_of_tries').notNullable().defaultTo(0)
    t.string('verification_code').notNullable().defaultTo(Math.floor(1000 + Math.random() * 9000))
    t.timestamp('expires_at').notNullable().defaultTo(knex.raw('now() + INTERVAL \'24 hours\''))})
  ])  
}

exports.down = function(knex, Promise) {
  return Promise.all([knex.raw('DROP TABLE users.session'),
    knex.schema.withSchema('users').table('users', (t) => {
      t.dropColumn('verified')
      t.dropColumn('number_of_tries')
      t.dropColumn('verification_code')
      t.dropColumn('expires_at')
    })
  ])
}
