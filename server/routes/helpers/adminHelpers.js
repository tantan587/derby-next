
const knex = require('../../db/connection')

const admin1 = () =>
{
  return knex.withSchema('fantasy').table('leagues')
    .then((resp) =>
    {
      let updateList = []
      resp.forEach(x  => 
      {
        updateList.push(Promise.resolve(updateOneRow({league_id: x.league_id,team_id: 106441, reg_points:0.00, bonus_points:0.00})))
      })
      return Promise.all(updateList)
        .then(()=> {return true})
    })
}

// updateList.push(Promise.resolve(updateOneRow('fantasy','points','owner_id',owner.owner_id,'rank',owner.rank )))
//       })
//       if (updateList.length > 0)
//       {
//         return Promise.all(updateList)
//           .then(() => { 
//             console.log("im done updating!")
//             return updateList.length
        

const updateOneRow = (data ) =>
{
  return knex
    .withSchema('fantasy')
    .table('team_points')
    .insert(data)
    .then(() =>
    {
      console.log(data.league_id, ' updated!')
    })
}

module.exports = {admin1}