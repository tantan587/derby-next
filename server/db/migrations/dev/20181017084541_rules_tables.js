exports.up = (knex, Promise) => {
    return Promise.all([
      knex.schema.withSchema('fantasy').createTable('league_rules', (table) => {
        table.integer('league_rule_id').notNullable()
        table.string('league_rule_hash').notNullable()
        table.json('league_rules').notNullable()
      }),
      knex.schema.withSchema('fantasy').createTable('conference_rules', (table) => {
        table.integer('conference_rule_id').notNullable()
        table.string('conference_rule_hash').notNullable()
        table.json('conference_rules').notNullable()
      }),
      knex.schema.withSchema('fantasy').table('leagues', function(t) {
        t.integer('league_rule_id').notNullable().defaultTo(1),
        t.integer('conference_rule_id').notNullable().defaultTo(1)
    })
    ])
  }
  
  exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('fantasy').dropTable('league_rules'),
        knex.schema.withSchema('fantasy').dropTable('conference_rules'),
        knex.schema.withSchema('fantasy').table('leagues', (table) => {
            table.dropColumn('league_rule_id')
            table.dropColumn('conference_rule_id')
          }),
    ])
};
  