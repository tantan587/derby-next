const express = require('express')
const router = express.Router()
const authHelpers = require('./helpers/authHelpers')
const C = require('../../common/constants')
const sportsHelpers = require('./helpers/sportsHelpers')

router.post('/sportSeasons', (req, res)  => {
  return sportsHelpers.GetSportSeasonsAndRespond(req.body.league_id,res, C.GET_SPORT_SEASONS)
    .catch((err) => {
      handleResponse(res, 500, err)})
})

router.post('/schedule', authHelpers.loginRequired, (req, res)  => {
  return sportsHelpers.getLeagueSchedule(req.body.league_id, req.body.date, res)
    .catch((err) => {
      handleResponse(res, 500, err)})
})

router.post('/oneteam',  (req, res)  => {
  return sportsHelpers.GetOneTeamSchedule(req.body.team_id, res)
    .catch((err) => {
      handleResponse(res, 500, err)})
})

function handleResponse(res, code, statusMsg) {
  res.status(code).json({status: statusMsg})
}

module.exports = router
