
exports.up = function(knex, Promise) {
    return Promise.all([
    knex.schema.withSchema('analysis').table('current_elo', (table) => {
      table.integer('year')
    }),
    knex.schema.withSchema('analysis').table('historical_elo', (table) => {
        table.integer('year')
      }),
      knex.schema.withSchema('analysis').table('current_elo_test', (table) => {
        table.integer('year')
      })
  ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('analysis').table('current_elo', (table) => {
          table.dropColumn('year')
        }),
        knex.schema.withSchema('analysis').table('historical_elo', (table) => {
            table.dropColumn('year')
          }),
          knex.schema.withSchema('analysis').table('current_elo_test', (table) => {
            table.dropColumn('year')
          })
      ])
};
