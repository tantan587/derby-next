const knex = require('../../db/connection')
const fantasyHelpers = require('./fantasyHelpers')
const C = require('../../../common/constants')

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
          rtnObj[rule.sport_id] = {max:parseInt(rule.sport_teams), total:0, conferences:{}}
        }

        rtnObj[rule.sport_id].conferences[rule.conference_id] = {max:parseInt(rule.conf_teams), total:0, team:''}
      })
      return rtnObj
    })
}

const GetTeamMap = async (roomId) =>{
  //this needs to adjust better for relgated teams
  const teamMapStr = `select distinct c.team_id, c.sport_id, c.conference_id
  from draft.settings a, fantasy.conferences b, sports.team_info c, sports.premier_status d
  where a.league_id = b.league_id  
  and b.conference_id = c.conference_id
  and ((c.sport_id = 107 and d.division_1 = 't' and c.team_id = d.team_id) OR c.sport_id != 107)
  and a.room_id = '` +  roomId + '\''

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
    return {eligibleTeams, queue}
  }
  return false
}

const enterDraftToDb = (allTeams,league_id, res) =>
{
  const dataToInput = allTeams.map(team => {team.league_id = league_id; return team})
  return knex.withSchema('fantasy').table('rosters')
    .where('league_id', league_id).del()
    .then(() =>
    {
      return knex.withSchema('fantasy').table('rosters').insert(dataToInput)
        .then(() => {
          return fantasyHelpers.updateLeaguePoints(league_id)
            .then(()=>{
              return fantasyHelpers.updateLeagueProjectedPoints(league_id)
                .then(()=>{
                  if(res){
                    fantasyHelpers.handleReduxResponse(res, 200, {type: C.SAVED_DRAFT})
                  }
                })
            })
        })
    })
}

const filterByArr = (arrToBeFiltered, filterByArr) =>
{
  return arrToBeFiltered.filter(team => {
    return !filterByArr.includes(team)
  })
}

const AssembleDraft =  (owners, results, my_owner_id, rules, teamMap) =>{
  let mode = 'pre'
  let allPicks = []
  let ownersMap = {}
  let autoDraftOwnersMap = {}
  let draftedTeams = []
  let queue = []
  let messages = []
  owners.map(x => ownersMap[x.owner_id] = [])
  owners.map(x => autoDraftOwnersMap[x.owner_id] = false)
  let allTeams = Object.keys(teamMap).filter(x => x > 99999)
  let availableTeams = [].concat(allTeams)
  let eligibleTeams = [].concat(allTeams)

  let resultsToEnter = []

  results.forEach(element => {
    switch (element.action_type){
    case 'STATE':
    {
      mode = element.action.mode ? element.action.mode : mode
      break
    }
    case 'PICK':
    {
      resultsToEnter.push({
        pick:element.action.pick,
        ownerId:element.initiator,
        action:element.action,
        teamId:element.action.teamId
      })
      break
    }
    case 'ROLLBACK':
    {
      resultsToEnter.splice(-1,1)
      break
    }
    case 'AUTODRAFT':
    {
      autoDraftOwnersMap[element.initiator] = element.action.toggle
      break
    }
    case 'QUEUE':
    {
      if (my_owner_id === element.initiator)
        queue = element.action.queue ? element.action.queue : queue
      break
    }
    case 'MESSAGE':
    {
      let message =element.action
      message.ownerId = element.initiator
      messages.push(message)
      break
    }
    }
  })

  resultsToEnter.forEach(x => {
    allPicks.push(x.pick)
    ownersMap[x.ownerId].push(x.action)
    const index = availableTeams.indexOf(x.teamId)
    availableTeams.splice(index, 1)
    draftedTeams.push(x.teamId)
  })

  queue = queue.filter(team => {
    return !draftedTeams.includes(team)
  })
  
  ownersMap[my_owner_id].forEach(x => {
    let resp = FilterDraftPick(x.teamId, teamMap, rules, eligibleTeams, queue)
    eligibleTeams = resp.eligibleTeams
    queue = resp.queue
  })

  draftedTeams.forEach(x => {
    const index1 = eligibleTeams.indexOf(x)
    if(index1 > -1)
      eligibleTeams.splice(index1, 1)
  })

  return {
    type:C.ENTERED_DRAFT,
    mode,
    pick:allPicks.length === 0 ? 0 : (Math.max(...allPicks)+1),
    availableTeams,
    draftedTeams,
    allTeams,
    owners:ownersMap,
    queue,
    rules,
    messages,
    autoDraftOwnersMap,
    eligibleTeams}
}

module.exports = { GetDraftRules, GetTeamMap, FilterDraftPick, enterDraftToDb, AssembleDraft}