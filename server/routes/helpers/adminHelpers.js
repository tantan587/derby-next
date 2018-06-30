const knex = require('../../db/connection')


const admin1 = (id) =>
{
  console.log(id)
  return knex
    .withSchema('users')
    .table('users')
    .update('email', id)
    .where('user_id', id)
}

        

const updateOneRow = (data,id ) =>
{
  return knex
    .withSchema('fantasy')
    .table('owners')
    .update('avatar', data)
    .where('id', id)
    .then(() =>
    {
      console.log(id, ' updated!')
    })
  // return knex
  //   .withSchema('fantasy')
  //   .table('team_points')
  //   .insert(data)
  //   .then(() =>
  //   {
  //     console.log(data.league_id, ' updated!')
  //   })
}

module.exports = {admin1}