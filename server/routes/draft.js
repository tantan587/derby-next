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
      handleResponse(res, 500, err)})
})

const getDraft = (room_id) =>
{
  return knex.withSchema('draft').table('results')
    .where('room_id', room_id)
    .orderBy('server_ts')
    .then((results) => 
    {return assembleDraft(results)})
}

const handleReduxResponse =(res, code, action) => {
  res.status(code).json(action)
}

const handleResponse = (res, code, statusMsg) => {
  res.status(code).json({status: statusMsg})
}

const assembleDraft = (results) =>
{
  let mode = ''
  let owners = {}
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
    pick:0}
}

module.exports = router