
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('sports').table('schedule', function(t) {
            t.integer('home_team_score',6,0).notNullable()
            t.integer('away_team_score',6,0).notNullable()
            t.string('status').notNullable()
            t.string('winner').notNullable()
            t.string('time').notNullable()
            t.string('period').notNullable()
            t.string('updated_time').notNullable()
            t.integer('season_type', 2,0).notNullable()
        })
    ])     
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('sports').table('schedule', (table) => {
            table.dropColumn('home_team_score')
            table.dropColumn('away_team_score')
            table.dropColumn('status')
            table.dropColumn('winner')
            table.dropColumn('time')
            table.dropColumn('period')
            table.dropColumn('updated_time')
            table.dropColumn('season_type')
    })
  ])
};
