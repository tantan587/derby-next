const express = require('express')
const router = express.Router()
const authHelpers = require('./helpers/authHelpers')
const knex = require('../db/connection')
const C = require('../../common/constants')
const fantasyHelpers = require('./helpers/fantasyHelpers')

router.post('/standings', authHelpers.loginRequired, (req, res, next)  => {
  return getStandings(req.body.league_id, res, C.GET_TEAMS)
    .catch((err) => { 
      handleResponse(res, 500, err)})
})

router.post('/sportleagues', authHelpers.loginRequired, (req, res, next)  => {
  return getSportLeagues(req.body.league_id, res, C.GET_SPORT_LEAGUES)
    .catch((err) => { 
      handleResponse(res, 500, err)})
})

router.post('/savedraft', authHelpers.loginRequired, (req, res, next)  => {
  return enterDraftToDb(req, res)
    .then(() => { 
      fantasyHelpers.updateFantasy(req.body.league_id, res)
    })
    .catch((err) => { 
      handleResponse(res, 500, err) })
})

function handleReduxResponse(res, code, action){
  res.status(code).json(action)
}

function handleResponse(res, code, statusMsg) {
  res.status(code).json({status: statusMsg})
}

const enterDraftToDb = (req, res) =>
{
  const dataToInput = req.body.allTeams.map(team => {team.league_id = req.body.league_id; return team})
  return knex.withSchema('fantasy').table('rosters')
    .insert(dataToInput)
}

const getStandings = (league_id, res, type) =>{


  var str = 'select a.team_id, a.key, a.city, a.name, c.conference_id, c.display_name, d.sport_name, b.wins, b.losses, b.ties from ' +
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
            team_id:team.team_id,
            team_name:team.name !== null ? team.city + ' ' + team.name : team.city,
            sport:team.sport_name,
            conference:team.display_name,
            conference_id:team.conference_id,
            wins: team.wins,
            losses:team.losses,
            ties:team.ties
          }))
        teams.sort(function(a,b)
        { return a.team_name.toLowerCase() < b.team_name.toLowerCase() ? -1 : 1})
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

const getSportLeagues = (league_id, res, type) =>{


  var str = `select a.sport_id, a.conference_id, a.number_teams as num_in_conf, b.number_teams as num_of_conf,
   b.conf_strict, c.sport_name, d.display_name from fantasy.conferences a, fantasy.sports b,
    sports.leagues c, sports.conferences d where a.league_id = '` + league_id +
    '\' and a.league_id = b.league_id and a.sport_id = b.sport_id and a.sport_id = c.sport_id and a.conference_id = d.conference_id'
  return knex.raw(str)
    .then(result =>
    {
      if (result.rows.length > 0) 
      {
        const leaguesToConferenceMap = {}
        result.rows.map(row => 
        {
          if(!leaguesToConferenceMap[row.sport_id])
          {
            leaguesToConferenceMap[row.sport_id] = 
            {sport_id:row.sport_id, sport:row.sport_name, conf_strict:row.conf_strict, num:row.num_of_conf, conferences:[]}
          }
          leaguesToConferenceMap[row.sport_id].conferences.push({conference_id:row.conference_id, conference:row.display_name, num:row.num_in_conf})

        })
        return handleReduxResponse(res,200, {
          type: type,
          sportLeagues : Object.values(leaguesToConferenceMap)
        })
      }
      else
      {
        return handleReduxResponse(res,400, {})
      }
    })
}

module.exports = router

