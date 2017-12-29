exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('sports').createTable('data_link', (table) => {
      table.increments()
      table.string('fantasydata_id').notNullable()
      table.string('team_name').notNullable()
      table.integer('sport_id').notNullable()
      table.string('team_id').unique().notNullable()
    }),
    knex.schema.withSchema('sports').createTable('standings', (table) => {
      table.increments()
      table.decimal('team_id',6,0).unique().notNullable()
      table.integer('wins').notNullable()
      table.integer('losses').notNullable()
      table.integer('ties').notNullable()
    }),
    knex.schema.withSchema('sports').createTable('team_info', (table) => {
      table.increments()
      table.decimal('sport_id',3,0).notNullable()
      table.decimal('team_id',6,0).unique().notNullable()
      table.string('key').notNullable()
      table.string('city').notNullable()
      table.string('name')
      table.decimal('conference_id',5,0).notNullable()
      table.string('division')
    }),
    knex.schema.withSchema('sports').createTable('conferences', (table) => {
      table.increments()
      table.decimal('sport_id',3,0).notNullable()
      table.decimal('conference_id',5,0).unique().notNullable()
      table.string('name').notNullable()
      table.string('display_name').notNullable()
    }),
    knex.schema.withSchema('sports').createTable('conferences_link', (table) => {
      table.increments()
      table.decimal('conference_id',5,0).notNullable()
      table.string('fantasy_data_key').notNullable()
      table.string('name').notNullable()
    }),
    knex.schema.withSchema('sports').createTable('leagues', (table) => {
      table.increments()
      table.string('sport_name').notNullable()
      table.decimal('sport_id',3,0).unique().notNullable()
      table.string('type').notNullable()
      table.string('fantasy_data_key')
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('sports').dropTable('data_link'),
    knex.schema.withSchema('sports').dropTable('standings'),
    knex.schema.withSchema('sports').dropTable('team_info'),
    knex.schema.withSchema('sports').dropTable('conferences'),
    knex.schema.withSchema('sports').dropTable('conferences_link'),
    knex.schema.withSchema('sports').dropTable('leagues')
  ])
}
