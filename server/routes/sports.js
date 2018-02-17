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

router.post('/schedule', authHelpers.loginRequired, (req, res, next)  => {
  return getSchedule(req.body.league_id, req.body.date, res)
    .catch((err) => { 
      handleResponse(res, 500, err)})
})

router.post('/savedraft', authHelpers.loginRequired, (req, res, next)  => {
  return enterDraftToDb(req, res)
    .then(() => { 
      return fantasyHelpers.updateFantasy(req.body.league_id, res)
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
    .where('league_id', req.body.league_id).del()
    .then(() => 
    {
      return knex.withSchema('fantasy').table('rosters').insert(dataToInput)
    })
}

const getStandings = (league_id, res, type) =>{


  var str = `select x.*, y.owner_id, y.owner_name from 
  (select a.team_id, a.key, a.city, a.name, a.logo_url, c.conference_id, c.display_name, d.sport_name, b.wins, b.losses, b.ties, e.reg_points from 
  sports.team_info a, sports.standings b, sports.conferences c, sports.leagues d, fantasy.team_points e
  where a.team_id = b.team_id and c.conference_id = a.conference_id and a.sport_id = d.sport_id and a.team_id = e.team_id and e.league_id = '` + league_id + '\'' +
  `) x
  left outer join
  (select f.team_id, g.owner_id, g.owner_name from 
  fantasy.rosters f, fantasy.owners g 
  where f.owner_id = g.owner_id and f.league_id ='` + league_id + '\') y on x.team_id = y.team_id'


  // var str = 'select a.team_id, a.key, a.city, a.name, c.conference_id, c.display_name, d.sport_name, b.wins, b.losses, b.ties from ' +
  // 'sports.team_info a, sports.standings b, sports.conferences c, sports.leagues d, fantasy.sports e, fantasy.owners f' +
  // 'where a.team_id = b.team_id and c.conference_id = a.conference_id and a.sport_id = d.sport_id and b.team_id = e.team_id and e.owner_id = '
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
            team_name:team.sport_name !== 'EPL' ? team.city + ' ' + team.name : team.name,
            sport:team.sport_name,
            conference:team.display_name,
            conference_id:team.conference_id,
            wins: team.wins,
            losses:team.losses,
            ties:team.ties,
            logo_url:team.logo_url,
            owner_id:team.owner_id ? team.owner_id : 'N/A',
            owner_name:team.owner_name ? team.owner_name : 'N/A',
            points: Number.parseFloat(team.reg_points)  
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

const getSchedule = (league_id, date, res) => {
  const dayCount = fantasyHelpers.getDayCountStr(date)
  console.log(date)
  console.log(dayCount)
  var str =  `select a.* from sports.schedule a, fantasy.sports b where 
          b.league_id = '` + league_id + `' and a.sport_id = b.sport_id 
          and day_count = ` + dayCount
  console.log(str)
  return knex.raw(str)
    .then(result =>
    {
      if (result.rows.length > 0) 
      {
        const scheduleRows = []
        result.rows.map(row => 
        {
          scheduleRows.push({
            global_game_id:row.global_game_id,
            home_team_id:row.home_team_id,
            away_team_id:row.away_team_id,
            date_time:row.date_time,
            sport_id:row.sport_id,
            time:fantasyHelpers.formatAMPM(new Date(row.date_time))
          })

        })
        return handleReduxResponse(res,200, {
          type: C.GET_SCHEDULE_BY_DAY,
          schedule : scheduleRows
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

