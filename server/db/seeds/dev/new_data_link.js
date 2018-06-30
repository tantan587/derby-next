var data = require('../../../../data/team-sport-global-id.json')

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return  knex.withSchema('sports').table('data_link').del()
    .then(function () {
      // Inserts seed entries
      return knex.withSchema('sports').table('data_link').insert(data)
    })
}

/* exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('table_name').del()
    .then(function () {
      // Inserts seed entries
      return knex('table_name').insert([
        {id: 1, colName: 'rowValue1'},
        {id: 2, colName: 'rowValue2'},
        {id: 3, colName: 'rowValue3'}
      ]);
    });
}; */
