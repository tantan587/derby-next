const express = require('express')
const router = express.Router()
const authHelpers = require('./helpers/authHelpers')
const knex = require('../db/connection')
const C = require('../../common/constants')

//router.post('/enterdraft', authHelpers.loginRequired, (req, res, next)  => {
router.post('/enterdraft', (req, res, next)  => {
  return getDraft(req.body.room_id)
    .then((resp) => { 
      handleReduxResponse(res, 200, resp)})
    .catch((err) => { 
      console.log(err)
      handleResponse(res, 500, err)})
})

const getDraft = (room_id) =>
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
              return assembleDraft(teams.rows,owners.rows, results)})
        })
    })
}

const handleReduxResponse =(res, code, action) => {
  res.status(code).json(action)
}

const handleResponse = (res, code, statusMsg) => {
  res.status(code).json({status: statusMsg})
}

const assembleDraft = (teams,owners, results) =>
{
  let mode = ''
  let ownersMap = {}
  owners.map(x => ownersMap[x.owner_id] = [])
  let teamIds = teams.map(x => x.team_id)
  results.forEach(element => {
    switch (element.action_type){
    case 'STATE':
    {
      mode = element.action.mode ? element.action.mode : mode
    }}
    
  })
  return {
    type:C.ENTERED_DRAFT,
    mode:'pre',
    pick:0,
    teams:teamIds,
    owners:ownersMap}
}

module.exports = router