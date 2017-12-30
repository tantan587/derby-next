
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.withSchema('users').createTable('email_auth', (table) => {
      table.string('api_key')
      table.string('domain')
      table.string('email')
      table.string('application')
    })
  ])
}

exports.down = (knex, Promise) => {
  return knex.schema.withSchema('users').dropTable('email_auth')
}
