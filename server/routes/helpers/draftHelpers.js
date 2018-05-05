
const GetDraftOrder = (totalTeams, totalOwners) =>
{
  let draftOrder = []
  for(let round = 0; round < totalTeams; round++)
  {
    let ownerIndex = round % 2 === 0 
      ? Array.apply(null, {length: totalOwners}).map(Number.call, Number)
      : Array.apply(null, {length: totalOwners}).map(Number.call, Number).reverse()

    ownerIndex.map((ownerIndex,pick) => draftOrder.push({pick:pick + round*totalOwners, ownerIndex:ownerIndex}))

  }
  return draftOrder
}

const GetDraftRules = (knex, roomId) => {

  const knexStr = `select distinct 
    c.sport_id, b.conference_id, 
    b.number_teams as conf_teams, c.number_teams as sport_teams 
    from draft.settings a, fantasy.conferences b, fantasy.sports c 
    where a.league_id = b.league_id 
    and a.league_id = c.league_id 
    and b.sport_id = c.sport_id 
    and a.room_id = '` + roomId + '\''

  const rtnObj = {}
  return knex.raw(knexStr)
    .then(rules => {
      rules.rows.map(rule => 
      {
        if(!rtnObj[rule.sport_id])
        {
          rtnObj[rule.sport_id] = 
          {max:rule.sport_teams, total:0, conferences:{}}
        }

        rtnObj[rule.sport_id].conferences[rule.conference_id] = 
        {max:rule.conf_teams, total:0, team:''}
      })
      return rtnObj
    })
}

module.exports = {GetDraftOrder, GetDraftRules}