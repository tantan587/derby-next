const knex = require('../../db/connection')
const C = require('../../../common/constants')
const fantasyHelpers = require('./fantasyHelpers')

const getTeamInfo = () => {

  var str = `select a.team_id, a.key, a.city, a.name, a.logo_url,
    c.conference_id, c.display_name, d.sport_name, d.sport_id, b.wins,
     b.losses, b.ties from
  sports.team_info a, sports.standings b, sports.conferences c,
  sports.leagues d
  where a.team_id = b.team_id and c.conference_id = a.conference_id
  and a.sport_id = d.sport_id` 

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
            sport_id:team.sport_id,
            conference:team.display_name,
            conference_id:team.conference_id,
            wins: team.wins,
            losses:team.losses,
            ties:team.ties,
            logo_url:team.logo_url,
          }))
        // teams.sort(function(a,b)
        // { return a.team_name.toLowerCase() < b.team_name.toLowerCase() ? -1 : 1})
        let rtnTeams = {}
        teams.map(team => rtnTeams[team.team_id] = team)
        return rtnTeams
      }
    })
}

function handleReduxResponse(res, code, action) {
  res.status(code).json(action)
}

const getTeamInfoAndRespond = async (res, type) => {

  let rtnTeams = await getTeamInfo()
  return handleReduxResponse(res,200, {
    type: type,
    teams : rtnTeams,
    updateTime:(new Date()).toJSON()
  })
}

const getSchedule = (league_id, date, res) => {
  const dayCount = fantasyHelpers.getDayCountStr(date)
  var str =  `select a.*, c.* from sports.schedule a, fantasy.sports b, sports.results c where
          b.league_id = '` + league_id + `' and a.sport_id = b.sport_id and a.global_game_id = c.global_game_id
          and day_count = ` + dayCount
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
            time:fantasyHelpers.formatAMPM(new Date(row.date_time)),
            home_team_score:row.home_team_score,
            away_team_score:row.away_team_score,
            status:row.status,
            winner:row.winner,
            game_time:row.time,
            period:row.period
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

const getOneTeam  = async(league_id, team_id, res) =>{

  const str1 = `select a.*, b.wins, b.losses, b.ties
   from sports.team_info a, sports.standings b
   where a.team_id = b.team_id and a.team_id = ` + team_id

  const str2 = `select *
    from (
      select *
      from fantasy.team_points a
      where a.team_id = `+ team_id +
      ' and league_id = \'' + league_id + '\') x' +
    ` left outer join (
      select c.team_id, d.owner_name, d.owner_id, c.overall_pick
      from fantasy.rosters c, fantasy.owners d
      where c.owner_id = d.owner_id and c.team_id = ` + team_id +
      ' and c.league_id = \'' + league_id + `') y
    on x.team_id = y.team_id `

  const str3 = `select *
    from sports.schedule a, sports.results b
    where a.global_game_id = b.global_game_id
    and (a.home_team_id = `+ team_id + ' or a.away_team_id = ' + team_id + ' ) order by day_count'
  let teamInfo = await knex.raw(str1)
  let fantasyInfo = await knex.raw(str2)
  let schedule = await knex.raw(str3)

  teamInfo = teamInfo.rows[0]
  fantasyInfo = fantasyInfo.rows[0]
  schedule = schedule.rows
  let oneTeam = {}
  oneTeam.team_name = teamInfo.sport_name !== 'EPL' ? teamInfo.city + ' ' + teamInfo.name : teamInfo.name
  oneTeam.owner = fantasyInfo.owner_name
  oneTeam.owned_in_derby_leagues = 'TBD'
  oneTeam.rank_in_league = 'TBD'
  oneTeam.record = teamInfo.wins + '-' + teamInfo.losses + (teamInfo.ties > 0 ? '-' + teamInfo.ties : '')
  oneTeam.curr_points = parseFloat(fantasyInfo.reg_points) + parseFloat(fantasyInfo.bonus_points)

  const currDayCount =  fantasyHelpers.getDayCountStr((new Date()).toJSON())
  let lastFive = []
  let nextFive = []

  schedule.forEach(row => {
    if(row.day_count >= currDayCount && nextFive.length < 5)
    {
      if(row.status[0] != 'F')
      {
        nextFive.push({
          global_game_id:row.global_game_id,
          home_team_id:row.home_team_id,
          away_team_id:row.away_team_id,
          date_time:fantasyHelpers.formatGameDate(new Date(row.date_time)),
          sport_id:row.sport_id,
          time:fantasyHelpers.formatAMPM(new Date(row.date_time)),
          home_team_score:row.home_team_score,
          away_team_score:row.away_team_score,
          status:row.status,
          winner:row.winner,
          game_time:row.time,
          period:row.period
        })
      }
    }
  })

  schedule.slice(0).reverse().forEach(row => {
    if(row.day_count <= currDayCount && lastFive.length < 5)
    {
      if(row.status[0] === 'F')
      {
        lastFive.push({
          global_game_id:row.global_game_id,
          home_team_id:row.home_team_id,
          away_team_id:row.away_team_id,
          date_time:fantasyHelpers.formatGameDate(new Date(row.date_time)),
          sport_id:row.sport_id,
          time:fantasyHelpers.formatAMPM(new Date(row.date_time)),
          home_team_score:row.home_team_score,
          away_team_score:row.away_team_score,
          status:row.status,
          winner:row.winner,
          game_time:row.time,
          period:row.period
        })
      }
    }
  })
  oneTeam.nextFive = nextFive
  oneTeam.lastFive = lastFive

  return handleReduxResponse(res,200, { type : C.GET_ONE_TEAM, oneTeam : oneTeam })

}

module.exports = {
  getOneTeam,
  getTeamInfoAndRespond,
  getTeamInfo,
  getSchedule,
  getSportLeagues
}

