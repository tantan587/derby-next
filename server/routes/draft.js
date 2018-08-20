const express = require('express')
const router = express.Router()
const authHelpers = require('./helpers/authHelpers')
const knex = require('../db/connection')
const C = require('../../common/constants')
const draftHelpers = require('./helpers/draftHelpers')

//router.post('/enterdraft', authHelpers.loginRequired, (req, res, next)  => {
router.post('/enterdraft', (req, res)  => {
  return getDraft(req.body.room_id, req.body.owner_id)
    .then((resp) => { 
      handleReduxResponse(res, 200, resp)})
    .catch((err) => { 
      console.log(err)
      handleResponse(res, 500, err)})
})

router.post('/savedraft', authHelpers.loginRequired, (req, res)  => {
  return draftHelpers.enterDraftToDb(req.body.allTeams, req.body.league_id, res)
    .catch((err) => {
      handleResponse(res, 500, err) })
})

router.post('/updateDraftOrder', authHelpers.loginRequired, (req, res)  => {
  return knex.withSchema('draft')
    .table('settings')
    .where('league_id', req.body.league_id)
    .update('draft_position', JSON.stringify(req.body.draftOrder))
    .then(() => { 
      handleReduxResponse(res, 200, {type:C.UPDATE_DRAFT_ORDER, draftOrder:req.body.draftOrder})})
    .catch((err) => { 
      console.log(err)
      handleResponse(res, 500,err)})
})

const getDraft = async (room_id, owner_id) =>
{

  const strOwners = `select b.owner_id from draft.settings a, fantasy.owners b
  where a.league_id = b.league_id and a.room_id = '` + room_id + '\''

  let owners = await knex.raw(strOwners)
  let rules = await draftHelpers.GetDraftRules(room_id)
  let teamMap = await draftHelpers.GetTeamMap(room_id)
  let results = await knex.withSchema('draft').table('results')
    .where('room_id', room_id)
    .orderBy('server_ts')
  return assembleDraft(owners.rows, results, owner_id, rules, teamMap)
}

const handleReduxResponse =(res, code, action) => {
  res.status(code).json(action)
}

const handleResponse = (res, code, statusMsg) => {
  res.status(code).json({status: statusMsg})
}

const assembleDraft = (owners, results, my_owner_id, rules, teamMap) =>{
  let mode = 'pre'
  let allPicks = []
  let ownersMap = {}
  let draftedTeams = []
  let queue = []
  let messages = []
  owners.map(x => ownersMap[x.owner_id] = [])
  let allTeams = Object.keys(teamMap).filter(x => x > 99999)
  let availableTeams = [].concat(allTeams)
  let eligibleTeams = [].concat(allTeams)
  results.forEach(element => {
    switch (element.action_type){
    case 'STATE':
    {
      mode = element.action.mode ? element.action.mode : mode
      break
    }
    case 'PICK':
    {
      allPicks.push(element.action.pick)
      ownersMap[element.initiator].push(element.action)
      const index = availableTeams.indexOf(element.action.teamId)
      availableTeams.splice(index, 1)
      draftedTeams.push(element.action.teamId)
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

  queue = queue.filter(team => {
    return !draftedTeams.includes(team)
  })
  
  ownersMap[my_owner_id].forEach(x => {
    let resp = draftHelpers.FilterDraftPick(x.teamId, teamMap, rules, eligibleTeams, queue)
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
    eligibleTeams}
}

module.exports = router