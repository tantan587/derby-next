
exports.up = function(knex, Promise) {
  return knex.schema.withSchema('fantasy').table('leagues', function(t) {
    t.string('league_password').notNullable();
    t.boolean('private_ind').notNullable();
});
};

exports.down = function(knex, Promise) {
  return knex.schema.withSchema('fantasy').table('leagues', function(t) {
    t.dropColumn('league_password');
    t.dropColumn('private_ind');
});
};

