
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.withSchema('fantasy').table('team_points', function(t) {
            t.integer('scoring_type_id')
            t.numeric('playoff_points',8,2)
        })
    ])     
};

exports.down = function(knex, Promise) {
  
};
