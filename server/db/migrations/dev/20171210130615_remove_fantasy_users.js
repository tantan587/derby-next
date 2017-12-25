
exports.up = (knex, Promise) => {
  return knex.schema.withSchema('fantasy').dropTable('users');
};

exports.down = (knex, Promise) => {
};

