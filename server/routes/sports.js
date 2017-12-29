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


  var str = 'select a.key, a.city, a.name, c.display_name, d.sport_name, b.wins, b.losses, b.ties from ' +
  'sports.team_info a, sports.standings b, sports.conferences c, sports.leagues d ' +
  'where a.team_id = b.team_id and c.conference_id = a.conference_id and a.sport_id = d.sport_id'
  return knex.raw(str)
    .then(result =>
    {
      if (result.rows.length > 0) 
      {
        var teams = []
        result.rows.map(team => teams.push(
          {
            key:team.key, 
            team_name:team.name !== null ? team.city + ' ' + team.name : team.city,
            sport:team.sport_name,
            conference:team.display_name,
            wins: team.wins,
            losses:team.losses,
            ties:team.ties
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