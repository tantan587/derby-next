exports.up = (knex, Promise) => {
  return knex.schema.withSchema('users').createTable('users', (table) => {
    table.increments()
    table.string('user_id').unique().notNullable()
    table.string('username').unique().notNullable()
    table.string('email').unique().notNullable()
    table.string('password').notNullable()
    table.string('first_name').notNullable()
    table.string('last_name').notNullable()
    table.boolean('admin').notNullable().defaultTo(false)
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'))
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.withSchema('users').dropTable('users');
}
