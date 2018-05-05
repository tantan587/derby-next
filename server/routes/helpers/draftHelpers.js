const knex = require('../../db/connection')

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

const GetDraftRules = async (roomId) => {

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
          {max:parseInt(rule.sport_teams), total:0, conferences:{}}
        }

        rtnObj[rule.sport_id].conferences[rule.conference_id] = 
        {max:parseInt(rule.conf_teams), total:0, team:''}
      })
      return rtnObj
    })
}

const GetTeamMap = async (roomId) =>{
  const teamMapStr = `select c.team_id, c.sport_id, c.conference_id 
  from draft.settings a, fantasy.team_points b, sports.team_info c 
  where a.league_id = b.league_id  and b.team_id = c.team_id and a.room_id = '` +  roomId + '\''

  const rtnObj = {}
  return knex.raw(teamMapStr)
    .then(teams => {
      teams.rows.map(team => 
      {
        rtnObj[team.team_id] = 
        {'conference_id':team.conference_id,
          'sport_id': team.sport_id}
        if(!rtnObj[team.sport_id])
        {
          rtnObj[team.sport_id] = []
        }
        if(!rtnObj[team.conference_id])
        {
          rtnObj[team.conference_id] = []
        }
        rtnObj[team.sport_id].push(team.team_id)
        rtnObj[team.conference_id].push(team.team_id)
      })
      return rtnObj
    })
}

const FilterDraftPick = (teamId, teamMap, draftRules, eligibleTeams, queue) =>{

  let confId = teamMap[teamId].conference_id
  let sportId = teamMap[teamId].sport_id
  let teamsInConf = teamMap[confId]
  let teamsInSport = teamMap[sportId]


  let sport = draftRules[sportId]
  let conf = sport.conferences[confId]
  if(eligibleTeams.includes(teamId))
  {
    sport.total++
    conf.total++
    if(sport.total === sport.max)
    {
      eligibleTeams = filterByArr(eligibleTeams, teamsInSport) 
      queue = filterByArr(queue, teamsInSport)
    }
    else if (conf.total === conf.max)
    {
      eligibleTeams = filterByArr(eligibleTeams, teamsInConf)
      queue = filterByArr(queue, teamsInConf) 
    }
    return {eligibleTeams:eligibleTeams, queue:queue}
  }
  return false
}

const filterByArr = (arrToBeFiltered, filterByArr) =>
{
  return arrToBeFiltered.filter(team => {
    return !filterByArr.includes(team)
  })
}

module.exports = {GetDraftOrder, GetDraftRules, GetTeamMap, FilterDraftPick}