const knex = require('../../db/connection')
const C = require('../../../common/constants')
const fantasyHelpers = require('./fantasyHelpers')

//const getTeamProjections = async (league)

const GetRegularSeasonTeamInfo = async () => {

  //this needs to change to reflect correct projections
  //based on season,
  //this only has 622 teams not 742 teams as expected
  var str = `
  SELECT b.sport_season_id, a.team_id, a.key, a.city, a.name, a.logo_url,
    c.conference_id, c.display_name, d.sport_name, d.sport_id, b.wins,
    b.losses, b.ties, e.wins as projected_wins, e.losses as projected_losses,
    e.ties as projected_ties, e.playoff as projected_playoff
  FROM sports.team_info a, sports.standings b, sports.conferences c,
  sports.leagues d, analysis.record_projections e
  WHERE a.team_id = b.team_id and c.conference_id = a.conference_id
  and a.sport_id = d.sport_id
  and e.day_count = (select max(day_count) from analysis.record_projections)
  and a.team_id = e.team_id`
 
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

const getNearSchedule = () => {
  var d = new Date()
  //-60 for eastern time zone. 
  var nd = new Date(d.getTime() - ((d.getTimezoneOffset()-60) * 60000))
  const dayCount = fantasyHelpers.getDayCountStr(nd.toJSON())
  var str =  `select * from sports.schedule where
   day_count in(` + dayCount + ', ' + (dayCount + 1) + ', ' + (dayCount - 1) + ')'    
  return getSchedule(str)
}

const getLeagueSchedule = (league_id, date, res) => {
  const dayCount = fantasyHelpers.getDayCountStr(date)
  var str =  `select a.*, b.* from sports.schedule a, fantasy.sports b where
          b.league_id = '` + league_id + `' and a.sport_id = b.sport_id
          and day_count = ` + dayCount

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
      const scheduleRows = []
      if (result.rows.length > 0)
      {
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
            period:row.period,
            dayCount:row.day_count
          })


        })
      }
      return scheduleRows
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
  getLeagueSchedule,
  getSportLeagues,
}

