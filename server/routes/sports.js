const express = require('express')
const router = express.Router()
const authHelpers = require('./helpers/authHelpers')
const knex = require('../db/connection')
const C = require('../../common/constants')

router.post('/standings', authHelpers.loginRequired, (req, res, next)  => {
  return getStandings(req.league_id, res, C.GET_TEAMS)
    .catch((err) => { 
      handleResponse(res, 500, err)})
})

function handleReduxResponse(res, code, action){
  res.status(code).json(action)
}

function handleResponse(res, code, statusMsg) {
  res.status(code).json({status: statusMsg})
}

const getStandings = (league_id, res, type) =>{


  var str = 'select a.key, a.city, a.name, a.conference, b.wins, b.losses from ' +
  'sports.nba_info a, sports.nba_standings b where a.team_id = b.team_id;'
  return knex.raw(str)
    .then(result =>
    {
      if (result.rows.length > 0) 
      {
        var teams = []
        result.rows.map(team => teams.push(
          {
            key:team.key, 
            team_name:team.city + ' ' + team.name,
            conference:team.conference,
            wins: team.wins,
            losses:team.losses
          }))
        return handleReduxResponse(res,200, {
          type: type,
          teams : teams
        })
      }
      else
      {
        return handleReduxResponse(res,400, {})
      }
    })
}

module.exports = router