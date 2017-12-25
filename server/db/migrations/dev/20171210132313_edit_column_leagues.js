
exports.up = (knex, Promise) => {
  return knex.schema.withSchema('fantasy').table('leagues', (table) => {
    table.renameColumn('max_rosters', 'max_owners');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.withSchema('fantasy').table('leagues', (table) => {
    table.renameColumn('max_owners', 'max_rosters');
  });
};
