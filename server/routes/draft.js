const express = require('express')
const router = express.Router()
const authHelpers = require('./helpers/authHelpers')
const knex = require('../db/connection')
const C = require('../../common/constants')

//router.post('/enterdraft', authHelpers.loginRequired, (req, res, next)  => {
router.post('/enterdraft', (req, res, next)  => {
  return getDraft(req.body.room_id, req.body.owner_id)
    .then((resp) => { 
      handleReduxResponse(res, 200, resp)})
    .catch((err) => { 
      console.log(err)
      handleResponse(res, 500, err)})
})

const getDraft = (room_id, owner_id) =>
{
  const strTeams = `select b.team_id from draft.settings a, fantasy.team_points b
  where a.league_id = b.league_id and a.room_id = '` + room_id + '\''

  const strOwners = `select b.owner_id from draft.settings a, fantasy.owners b
  where a.league_id = b.league_id and a.room_id = '` + room_id + '\''
  
  return knex.withSchema('draft').table('results')
    .where('room_id', room_id)
    .orderBy('server_ts')
    .then((results) => {
      return knex.raw(strTeams)
        .then((teams) => {
          return knex.raw(strOwners)
            .then((owners) => {
              return assembleDraft(teams.rows,owners.rows, results, owner_id)})
        })
    })
}

const handleReduxResponse =(res, code, action) => {
  res.status(code).json(action)
}

const handleResponse = (res, code, statusMsg) => {
  res.status(code).json({status: statusMsg})
}

const assembleDraft = (teams,owners, results, my_owner_id) =>
{
  let mode = 'pre'
  let pick = 0
  let ownersMap = {}
  let draftedTeams = []
  let queue = []
  owners.map(x => ownersMap[x.owner_id] = [])
  let availableTeams = teams.map(x => x.team_id)
  results.forEach(element => {
    switch (element.action_type){
    case 'STATE':
    {
      mode = element.action.mode ? element.action.mode : mode
      console.log(mode)
      break
    }
    case 'PICK':
    {
      pick = element.action.pick
      ownersMap[element.initiator].push(element.action)
      const index = availableTeams.indexOf(element.action.teamId)
      availableTeams.splice(index, 1)
      draftedTeams.push(element.action.teamId)
      return
    }
    case 'QUEUE':
    {
      if (my_owner_id === element.initiator)
        queue = element.action.queue ? element.action.queue : queue
    }
    }
  })
  return {
    type:C.ENTERED_DRAFT,
    mode:mode,
    pick:pick,
    availableTeams:availableTeams,
    draftedTeams:draftedTeams,
    owners:ownersMap,
    queue:queue}
}

module.exports = router