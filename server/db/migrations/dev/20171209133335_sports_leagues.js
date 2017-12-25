

exports.up = (knex, Promise) => {
  return knex.schema.withSchema('sports').createTable('leagues', (table) => {
    table.increments();
    table.string('sport_name');
    table.decimal('sport_id',3,0).unique();
    table.string('type');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.withSchema('sports').dropTable('leagues');
};