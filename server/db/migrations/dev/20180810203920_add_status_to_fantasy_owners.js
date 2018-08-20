
exports.up = function(knex, Promise) {
  return knex.schema.withSchema('fantasy').table('owners', (t) => {
    t.enu('status', [
      'not_invited',
      'pending',
      'confirmed',
      'rejected',
      'inactive',
    ]).defaultTo('not_invited')
  }).then(() => {
    return knex('fantasy.owners')
    .update({status: 'confirmed'})
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.withSchema('fantasy').table('owners', (t) => {
    t.dropColumn('status')
  })
};
