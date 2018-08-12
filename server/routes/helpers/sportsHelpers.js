const knex = require('../../db/connection')
const C = require('../../../common/constants')
const fantasyHelpers = require('./fantasyHelpers')

//const getTeamProjections = async (league)

const GetRegularSeasonTeamInfo = async () => {

  var str = `
  SELECT aa.*, ee.wins as projected_wins, ee.losses as projected_losses,
  ee.ties as projected_ties, ee.playoff as projected_playoff from
  (SELECT b.sport_season_id, a.team_id, a.key, a.city, a.name, a.logo_url, b.year,
    c.conference_id, c.display_name, d.sport_name, d.sport_id, b.wins,
    b.losses, b.ties
  FROM sports.team_info a, sports.standings b, sports.conferences c,
  sports.leagues d
  WHERE a.team_id = b.team_id and c.conference_id = a.conference_id
  and a.sport_id = d.sport_id) aa
  left outer join analysis.record_projections ee on aa.team_id = ee.team_id
  and ee.day_count = (select max(day_count) from analysis.record_projections)
  and aa.year = ee.year`

 
  return knex.raw(str)
    .then(result =>
    {
      if (result.rows.length > 0)
      {
        var teams = []
        result.rows.map(team => teams.push(
          {
            sport_season_id:team.sport_season_id,
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
            projected:{
              wins:team.projected_wins,
              losses:team.projected_losses,
              ties:team.projected_ties,
              playoff:team.projected_playoff
            }
          }))
        let rtnTeams = {}
        teams.forEach(team => 
        {
          if(!rtnTeams[team.sport_season_id])
          {
            rtnTeams[team.sport_season_id] = {}
          }
          rtnTeams[team.sport_season_id][team.team_id] = team
        })
        return rtnTeams
      }
    })
}

function handleReduxResponse(res, code, action) {
  res.status(code).json(action)
}

const GetSportSeasonsAndRespond = async (league_id,res, type) => {

  let seasonIds = await fantasyHelpers.GetSportSeasonsByLeague(league_id)
  return handleReduxResponse(res,200, {
    type,
    seasonIds
  })
}

const baseScheduleStr = `
  select a.*, 
  b.city as h_city, b.name as h_name, b.logo_url as h_url,
  c.city as a_city, c.name as a_name, c.logo_url as a_url,
  d.wins as h_wins, d.losses as h_losses, d.ties as h_ties,
  e.wins as a_wins, e.losses as a_losses, e.ties as a_ties
  from 
  sports.schedule a, sports.team_info b, sports.team_info c,
  sports.standings d, sports.standings e 
  where a.home_team_id = b.team_id 
  and a.away_team_id = c.team_id
  and b.team_id = d.team_id
  and a.sport_season_id = d.sport_season_id
  and c.team_id = e.team_id
  and a.sport_season_id = e.sport_season_id `

const getNearSchedule = () => {
  var d = new Date()
  //-60 for eastern time zone. 
  var nd = new Date(d.getTime() - ((d.getTimezoneOffset()-60) * 60000))
  const dayCount = fantasyHelpers.getDayCountStr(nd.toJSON())
  var str =  baseScheduleStr + `
    and a.day_count in (` + dayCount + ', ' + (dayCount + 1) + ', ' + (dayCount - 1) + ')'    
  return getSchedule(str)
}



const getOneDaySchedule = (dayCount, res) => {
  var str =  baseScheduleStr + `
  and a.day_count = ` + dayCount
  return getSchedule(str)
    .then((resp) => {
      return handleReduxResponse(res,200, {
        type: C.GET_SCHEDULE_BY_DAY,
        schedule : resp
      })
    })
}

const getSchedule = (str) => {
  return knex.raw(str)
    .then(result =>
    {
      let scheduleRows = []
      if (result.rows.length > 0)
      {
        scheduleRows = result.rows.map(row => {
          return createGame(row)
        })
      }
      return scheduleRows
    })
}

const createGame = row => {
  row.away_team_score = row.away_team_score === -1 ? 0 : row.away_team_score
  row.home_team_score = row.home_team_score === -1 ? 0 : row.home_team_score

  let baseGame = {
    global_game_id : row.global_game_id,
    status:row.status,
    sport_id:parseInt(row.sport_id),
    date_time:row.date_time,
    start_time:fantasyHelpers.formatAMPM(new Date(row.date_time)),
    dayCount:row.day_count,
    period:row.period,
    time:row.time,
    home : {
      team_name:row.sport_id !== '107' ? row.h_city + ' ' + row.h_name : row.h_name,
      url:row.h_url,
      team_id:row.home_team_id,
      lost:row.winner === 'T',
      record:(row.h_wins + '-' + row.h_losses) + (row.h_ites > 0 ? '-' + row.h_ties : '')
    },
    away : {
      team_name:row.sport_id !== '107' ? row.a_city + ' ' + row.a_name : row.a_name,
      url:row.a_url,
      team_id:row.away_team_id,
      lost:row.winner === 'H',
      record:(row.a_wins + '-' + row.a_losses) + (row.a_ites > 0 ? '-' + row.a_ties : '') 
    },
    stadium : 'Unavaliable'
  }
  
  if(baseGame.status === 'Scheduled')
  {
    baseGame.status = baseGame.start_time
  }
  let gameExtra = row.game_extra

  switch (row.sport_id)
  {
  case '101': case '102':
  {
    baseGame.header = ['1','2','3','4','T']
    baseGame.home.score = [
      gameExtra.home_quarter_1 || 0,
      gameExtra.home_quarter_2 || 0,
      gameExtra.home_quarter_3 || 0,
      gameExtra.home_quarter_4 || 0,
      row.home_team_score]
    baseGame.away.score = [
      gameExtra.away_quarter_1 || 0,
      gameExtra.away_quarter_2 || 0,
      gameExtra.away_quarter_3 || 0,
      gameExtra.away_quarter_4 || 0,
      row.away_team_score]
    return baseGame
  }
  case '103':
  {
    if(baseGame.status === 'InProgress')
    {
      baseGame.status = (baseGame.period[0] === 'T' ? 'Top ' : 'Bottom ') + baseGame.period.substring(1)
    }

    baseGame.header = ['R','H','E']
    baseGame.home.score = [
      row.home_team_score,
      gameExtra.home_hits || 0, 
      gameExtra.home_errors || 0]
    baseGame.away.score = [
      row.away_team_score
      ,gameExtra.away_hits || 0
      ,gameExtra.away_errors ||0
    ]
    return baseGame
  }
  case '104':
  {
    baseGame.header = ['1','2','3','T']
    baseGame.home.score = [
      gameExtra.home_period_1 || 0,
      gameExtra.home_period_2 || 0,
      gameExtra.home_period_3 || 0,
      row.home_team_score]
    baseGame.away.score = [
      gameExtra.away_period_1 || 0,
      gameExtra.away_period_2 || 0,
      gameExtra.away_period_3 || 0,
      row.away_team_score]
    return baseGame
  }
  case '105':
  {
    baseGame.header = ['1','2','3','4','T']
    baseGame.home.score = [
      gameExtra.home_period_1 || 0,
      gameExtra.home_period_2 || 0,
      gameExtra.home_period_3 || 0,
      gameExtra.home_period_4 || 0,
      row.home_team_score]
    baseGame.away.score = [
      gameExtra.away_period_1 || 0,
      gameExtra.away_period_2 || 0,
      gameExtra.away_period_3 || 0,
      gameExtra.home_period_4 || 0,
      row.away_team_score]
    return baseGame
  }
  case '106': case'107':
  {
    baseGame.header = ['1','2','T']
    baseGame.home.score = [
      gameExtra.home_first_half || 0,
      gameExtra.home_second_half || 0,
      row.home_team_score]
    baseGame.away.score = [
      gameExtra.away_first_half || 0,
      gameExtra.away_second_half || 0,
      row.away_team_score]
    return baseGame
  }
  
  default:
  {
    return {}
  }
  } 
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

const GetOneTeamSchedule  = async(team_id, res) =>{

  const str = `select *
    from sports.schedule a
    where (a.home_team_id = `+ team_id + ' or a.away_team_id = ' + team_id + ' ) order by day_count'

  let schedule = await knex.raw(str)

  schedule = schedule.rows
  let oneTeam = {}
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
  oneTeam.team_id = team_id
  oneTeam.nextFive = nextFive
  oneTeam.lastFive = lastFive

  return handleReduxResponse(res,200, { type : C.GET_ONE_TEAM, oneTeam : oneTeam })

}

module.exports = {
  GetOneTeamSchedule,
  GetSportSeasonsAndRespond,
  GetRegularSeasonTeamInfo,
  getNearSchedule,
  getOneDaySchedule,
  getSportLeagues,
}

