const knex = require('../../db/connection')
const Colors = require('../../../common/components/Icons/Avatars/Colors')
const Patterns = require('../../../common/components/Icons/Avatars/Patterns')

const admin1 = () =>
{
  return knex.withSchema('fantasy').table('owners')
    .then((resp) =>
    {
      let updateList = []
      resp.forEach(x  => 
      {
        let num1 = Math.floor(Math.random() * 18)
        let num2 = Math.floor(Math.random() * 18)
        if (num1 === num2 && num1 < 9)
        {
          num2 = num1 + 9
        }
        else if (num1 === num2 && num1 > 8)
        {
          num2 = num1 - 9
        }

        let primary = Object.keys(Colors)[num1]
        let secondary = Object.keys(Colors)[num2]
        let pattern = Object.keys(Patterns)[Math.ceil(Math.random() * 12)]
        updateList.push(Promise.resolve(updateOneRow({pattern,primary,secondary}, x.id)))
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