
const knex = require('../../db/connection')

const admin1 = () =>
{
  return knex.withSchema('fantasy').table('owners')
    .then((resp) =>
    {
      const leagueMap = {}
      resp.map(x => {
        if(!leagueMap[x.league_id])
          leagueMap[x.league_id] = []
        leagueMap[x.league_id].push(x.owner_id)
      })
      let updateList = []
      Object.keys(leagueMap).map((league_id) => 
      {
        console.log(leagueMap[league_id])
        updateList.push(Promise.resolve(updateOneRow(league_id, leagueMap[league_id])))
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
        

const updateOneRow = (league_id,owner_ids ) =>
{
  return knex
    .withSchema('draft')
    .table('settings')
    .where('league_id',league_id)
    .update('draft_position', JSON.stringify(owner_ids))
    .then(() =>
    {
      console.log(league_id, ' updated!')
    })
}

module.exports = {admin1}