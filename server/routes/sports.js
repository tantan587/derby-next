const express = require('express')
const router = express.Router()
const authHelpers = require('./helpers/authHelpers')
const knex = require('../db/connection')
const C = require('../../common/constants')
const sportsHelpers = require('./helpers/sportsHelpers')

router.post('/standings', authHelpers.loginRequired, (req, res, next)  => {
  return sportsHelpers.getTeamInfoAndRespond(res, C.GET_TEAMS)
    .catch((err) => {
      handleResponse(res, 500, err)})
})

router.post('/sportleagues', authHelpers.loginRequired, (req, res, next)  => {
  return sportsHelpers.getSportLeagues(req.body.league_id, res, C.GET_SPORT_LEAGUES)
    .catch((err) => {
      handleResponse(res, 500, err)})
})

router.post('/schedule', authHelpers.loginRequired, (req, res, next)  => {
  return sportsHelpers.getLeagueSchedule(req.body.league_id, req.body.date, res)
    .catch((err) => {
      handleResponse(res, 500, err)})
})

router.post('/oneteam',  (req, res, next)  => {
  return sportsHelpers.getOneTeam(req.body.league_id, req.body.team_id, res)
    .catch((err) => {
      handleResponse(res, 500, err)})
})

function handleResponse(res, code, statusMsg) {
  res.status(code).json({status: statusMsg})
}

module.exports = router
