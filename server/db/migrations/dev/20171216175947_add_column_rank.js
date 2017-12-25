
exports.up = (knex, Promise) => {
  return Promise.all([
     knex.schema.withSchema('fantasy').createTable('points', (table) => {
    table.increments();
    table.string('owner_id').unique().notNullable();
    table.integer('total_points').notNullable()
    table.boolean('rank').notNullable()
    table.timestamps();
  })
  ])
};

exports.down = (knex, Promise) => {
  return Promise.all([
     knex.schema.withSchema('fantasy').dropTable('points')
  ])};