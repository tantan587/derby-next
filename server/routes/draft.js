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
  return draftHelpers.AssembleDraft(owners.rows, results, owner_id, rules, teamMap)
}

const handleReduxResponse =(res, code, action) => {
  res.status(code).json(action)
}

const handleResponse = (res, code, statusMsg) => {
  res.status(code).json({status: statusMsg})
}



module.exports = router