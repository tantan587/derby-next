
exports.up = function(knex, Promise) {
    return Promise.all([
    knex.schema.withSchema('analysis').table('current_elo', (table) => {
      table.integer('year')
      table.dropUnique('team_id')
    }),
    knex.schema.withSchema('analysis').table('historical_elo', (table) => {
        table.integer('year')
      })
  ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('analysis').table('current_elo', (table) => {
          table.dropColumn('year')
          table.unique('team_id')
        }),
        knex.schema.withSchema('analysis').table('historical_elo', (table) => {
            table.dropColumn('year')
          })
      ])
};
