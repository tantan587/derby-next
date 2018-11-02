exports.up = (knex, Promise) => {
    return Promise.all([
      knex.schema.withSchema('analysis').createTable('elo_updates', (table) => {
        table.increments()
        table.integer('day_count').notNullable()
        table.boolean('updated').notNullable()
      })
    ])
  }
  
  exports.down = (knex, Promise) => {
    return knex.schema.withSchema('analysis').dropTable('elo_updates')
  }
  