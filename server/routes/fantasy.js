const express = require('express')
const router = express.Router()
const authHelpers = require('./helpers/authHelpers')
const knex = require('../db/connection')
const C = require('../../common/constants')
const ErrorText = require('../../common/models/ErrorText')
const v4 = require('uuid/v4')
const fantasyHelpers = require('./helpers/fantasyHelpers')


router.post('/createleague', authHelpers.loginRequired, (req, res)  => {
  return createLeague(req)
    .then((league_id) => { 
      return fantasyHelpers.getLeague(league_id, req.user.user_id, res, C.CREATE_LEAGUE_SUCCESS)
    })
    .catch((action) => {  
      handleReduxResponse(res, 400, action)})
})

router.post('/joinleague', authHelpers.loginRequired, (req, res)  => {
  return joinLeague(req, res)
    .then((league_id) => { 
      return fantasyHelpers.getLeague(league_id, req.user.user_id, res, C.JOIN_LEAGUE_SUCCESS)
    })
    .catch((action) => {  
      handleReduxResponse(res, 400, action)})
})

router.post('/saveownersettings', authHelpers.loginRequired, async (req, res)  => {
  const resp = await handleOwnerSettingsErrors(req)
  if (resp.success){
    await updateOwnerSettings(req)
    return handleReduxResponse(res,200,
      {type:C.SAVE_OWNER_SETTINGS_SUCCESS, 
        owner_name:req.body.ownerName,
        owner_id:req.body.owner_id, avatar:req.body.avatar})
  } 
  else{
    return handleReduxResponse(res,401,{type:C.SAVE_OWNER_SETTINGS_FAIL, error: resp.error})
  } 
  
})

router.post('/updateleague', authHelpers.loginRequired, (req, res)  => {
  return updateLeague(req, res)
    .then(() => { 
      return fantasyHelpers.getLeague(req.body.league_id, req.user.user_id, res, C.CREATE_LEAGUE_SUCCESS)
    })
    .catch((action) => {  
      handleReduxResponse(res, 400, action)})
})

router.post('/clickleague', authHelpers.loginRequired, (req, res)  => {
  return fantasyHelpers.getLeague(req.body.league_id,req.body.user_id,res, C.CLICKED_LEAGUE)
})

function handleReduxResponse(res, code, action){
  res.status(code).json(action)
}

const createLeague = async (req) => {

  await handleCreateErrors(req)
  
  const league_id = v4()

  const sportsData = await getSportsData(req, league_id)

  return knex.transaction((trx) => {
    knex.withSchema('fantasy').table('leagues')
      .transacting(trx)
      .insert({
        league_id : league_id,
        league_name: req.body.leagueInfo.name,
        year_starting : 2017, //this needs to be year independent, so that it can function
        year_ending : 2018,
        max_owners : req.body.leagueInfo.owners, 
        league_password: req.body.leagueInfo.password,
        total_enrolled: 1,
        private_ind: true,
        scoring_type_id:1
      })
      .returning('*')
      .then((response) => {
        let owner_id = v4()
        return knex.withSchema('fantasy').table('owners')
          .transacting(trx)
          .insert({
            league_id: response[0].league_id,
            user_id: req.user.user_id,
            owner_id: owner_id,
            owner_name:  req.body.leagueInfo.name + '-owner-1',
            commissioner: true
          })
          .then(() => {
            return knex.withSchema('fantasy').table('points')
              .transacting(trx)
              .insert({
                owner_id: owner_id,
                total_points: 0,
                rank: 1
              })
              .then(() => {
                return knex.withSchema('draft').table('settings')
                  .transacting(trx)
                  .insert({
                    league_id: response[0].league_id,
                    start_time: req.body.leagueInfo.draftDate,
                    type: req.body.leagueInfo.draftType,
                    room_id: Math.random().toString(36).substr(2, 10),
                    draft_position: JSON.stringify([owner_id]),
                    seconds_pick: req.body.leagueInfo.pickTime
                  })
                  .then(() => {
                    return knex.withSchema('fantasy').table('sports')
                      .transacting(trx)
                      .insert(sportsData.sports)
                      .then(() => {
                        return knex.withSchema('fantasy').table('conferences')
                          .transacting(trx)
                          .insert(sportsData.conferences)
                          .returning('conference_id')
                          .then(()=>{
                          }) //fantasy.conferences
                      }) //fantasy.sports
                  }) //draft.settings
              }) //fantasy.points
          }) //fantasy.owners
      }) //fantasy.leagues
      .then(trx.commit)
      .catch(trx.rollback)
  }) //trans
    .then(() => {
      return league_id
    })
    .catch(function(error) {
      console.error(error)
      let errorText = new ErrorText()
      errorText.addError(C.PAGES.CREATE_LEAGUE,'Something went wrong with the server. Please try again.')
      throw {type:C.CREATE_LEAGUE_FAIL, error: errorText}
    })
  
}

const joinLeague = async (req) => {

  let {league_id, total_enrolled} = await handleJoinErrorsAndGetInfo(req)

  return knex.transaction((trx) => {
    let owner_id = v4()
    return knex.withSchema('fantasy').table('owners')
      .transacting(trx)
      .insert({
        league_id: league_id,
        user_id: req.user.user_id,
        owner_id: owner_id,
        owner_name:  req.body.league_name + '-owner-' + total_enrolled+1,
        commissioner: false
      })
      .then(() => {
        return knex.withSchema('fantasy').table('points')
          .transacting(trx)
          .insert({
            owner_id: owner_id,
            total_points: 0,
            rank: 1
          })
          .then(() => {
            return knex.withSchema('fantasy').table('leagues')
              .transacting(trx)
              .where({
                'league_id': league_id
              })
              .update({
                total_enrolled:total_enrolled+1
              })
              .then(() => {
                return knex.withSchema('draft').table('settings')
                  .transacting(trx)
                  .where('league_id', league_id)
                  .then((resp) => {
                    const draft_position = resp[0].draft_position
                    draft_position.push(owner_id)
                    return knex
                      .withSchema('draft')
                      .table('settings')
                      .transacting(trx)
                      .where('league_id',league_id)
                      .update('draft_position', JSON.stringify(draft_position))
                      .then(()=> {return})
                  })//draft settings
              }) //fantasy leagues
          })//fantasy points  
      })//fantasy owners
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .then(() => {
      return league_id
    })
    .catch(function(error) {
      console.error(error)
      let errorText = new ErrorText()
      errorText.addError(C.PAGES.JOIN_LEAGUE,'Something went wrong with the server. Please try again.')
      throw {type:C.JOIN_LEAGUE_FAIL, error: errorText}
    })
}

const updateLeague =  (req) => {
  
  return knex.transaction((trx) => {
    knex.withSchema('draft').table('settings')
      .transacting(trx)
      .update({
        start_time: req.body.leagueInfo.draftDate,
        type: req.body.leagueInfo.draftType,
        seconds_pick: req.body.leagueInfo.pickTime
      })
      .where('league_id', req.body.league_id)
      .then(trx.commit)
      .catch(trx.rollback)
  }) //trans
    .then(() => {
      return 
    })
    .catch(function(error) {
      console.error(error)
      let errorText = new ErrorText()
      errorText.addError(C.PAGES.UPDATE_LEAGUE,'Something went wrong with the server. Please try again.')
      throw {type:C.CREATE_LEAGUE_FAIL, error: errorText}
    })
  
}

const updateOwnerSettings =  async (req) =>
{
  return knex.withSchema('fantasy').table('owners')
    .update({
      avatar:req.body.avatar,
      owner_name: req.body.ownerName
    })
    .where('owner_id', req.body.owner_id)
}

function getSportsData(req, league_id)
{
  return new Promise((resolve) => {
    const sports = getInUseFantasySports(league_id, req.body.leagueInfo.premier)
    const conferences = getInUseFantasyConf(league_id, req.body.leagueInfo.premier)
    const selectConfs = []
    conferences.map(conf => selectConfs.push(conf.conference_id))
    return knex.withSchema('sports').table('team_info')
      .select('team_id')
      .whereIn('conference_id',selectConfs)
      .then((teamIds)=>{
        var teams = [] //this is where this needs to be modified to create teamPoints. Needs to pull in scoring type id from somwhere - tbd
        teamIds.map(teamId => {teams.push({league_id:league_id, team_id:teamId.team_id,reg_points:0,bonus_points:0})})
        resolve({sports:sports, conferences:conferences, teams:teams})
      })
      .catch(error => {
        console.log(error)
        let errorText = new ErrorText()
        errorText.addError(C.PAGES.CREATE_LEAGUE,'Something went wrong with the server. Please try again.')
        throw {type:C.CREATE_LEAGUE_FAIL, error: errorText}
      })
  })
}

function handleCreateErrors(req) {
  return new Promise((resolve, reject) => {
    
    let errorText = new ErrorText()

    var str = 'select count(*) league_name from fantasy.leagues where league_name = \'' + req.body.leagueInfo.name + '\'' 
    knex.raw(str)
      .then(result =>
      {
        if (result.rows[0].league_name == 1) 
        {
          errorText.addError(C.PAGES.CREATE_LEAGUE,'League name already exists. Please choose a different one')
        }
        if (errorText.foundError()) {
          reject({
            type: C.CREATE_LEAGUE_FAIL,
            error: errorText})
        }
        else
        {
          resolve()
        }
      })
  })
}

const getLeagueInfoForJoin = async (league_name) => {
  const str = 'select league_id, total_enrolled, max_owners from fantasy.leagues where league_name = \'' + league_name + '\''
  let result = await knex.raw(str)
  return result.rows[0]


}

const handleJoinErrorsAndGetInfo= async (req) => {
  let league_info = await getLeagueInfoForJoin(req.body.league_name)
  return new Promise(async (resolve, reject) => {

    let errorText = new ErrorText()
    var str = 'select (select count(*) leagueexists from fantasy.leagues where league_name = \'' + req.body.league_name +
      '\'), (select count(*) passconfirm from fantasy.leagues where league_password = \'' + req.body.league_password +
      '\'), (select count(*) joined from fantasy.leagues a, fantasy.owners b where a.league_id = b.league_id and a.league_name = \'' + req.body.league_name +
      '\' and b.user_id = \'' + req.user.user_id +
      '\'), (select count(*) nametaken from fantasy.leagues a, fantasy.owners b where a.league_id = b.league_id and a.league_name = \'' + req.body.league_name +
      '\' and b.owner_name = \'' +req.body.owner_name +
      '\'), (select league_id from fantasy.leagues where league_name = \'' + req.body.league_name + '\')'
    knex.raw(str)
      .then(result =>
      {
        if (result.rows[0].leagueexists === '0') 
        {
          errorText.addError(C.PAGES.JOIN_LEAGUE,'Can not find this league')
        }
        else if (result.rows[0].leagueexists === '1' && result.rows[0].passconfirm === '0') 
        {
          errorText.addError(C.PAGES.JOIN_LEAGUE,'password does not match')
        }
        else if (league_info.total_enrolled === league_info.max_owners) 
        {
          errorText.addError(C.PAGES.JOIN_LEAGUE,'This league is already full')
        }
        else if (result.rows[0].leagueexists === '1' && result.rows[0].joined === '1') 
        {
          errorText.addError(C.PAGES.JOIN_LEAGUE,'You\'ve already joined this league')
        }
        if (errorText.foundError()) {
          reject({
            type: C.JOIN_LEAGUE_FAIL,
            error: errorText})
        }
        else
        {
          resolve(league_info)
        }
      })
  })
}

const handleOwnerSettingsErrors = async (req) => {
  console.log(req.body)
  const resp = await knex.withSchema('fantasy')
    .table('owners')
    .where('league_id', req.body.league_id)

  let allOwnersButMe = resp.filter(x => x.owner_id != req.body.owner_id)
  let ownerNames = allOwnersButMe.map(x => x.owner_name)
  let silkColors = allOwnersButMe.map(x => x.avatar.primary + ';' + x.avatar.secondary)

  let errorText = new ErrorText()
  if (!req.body.ownerName || req.body.ownerName.length < 5) {
    errorText.addError(C.PAGES.CUSTOMIZE_TEAMS,'Owner name must be longer than five characters')
  }
  
  if (req.body.ownerName && req.body.ownerName.length > 15) {
    errorText.addError(C.PAGES.CUSTOMIZE_TEAMS,'Owner name must be shorter than fifteen characters')
  }
  if (ownerNames.includes(req.body.ownerName)) {
    errorText.addError(C.PAGES.CUSTOMIZE_TEAMS,'Owner name must be unique')
  }
  if (silkColors.includes(req.body.avatar.primary + ';' + req.body.avatar.secondary)) {
    errorText.addError(C.PAGES.CUSTOMIZE_TEAMS,'This color combo has already been chosen. You must choose a unique set of colors.')
  }
   
  if (errorText.foundError()) {
    return {
      success: false,
      error: errorText
    }
  }
  else
    return {success: true}

}

//this should not all be hard coded
const getInUseFantasySports = (league_id, useEPL) =>
{
  const sports =  [{
    league_id:league_id,
    sport_id: 101,
    number_teams: 2,
    conf_strict : true
  },
  {
    league_id: league_id,
    sport_id: 102,
    number_teams: 2,
    conf_strict : true
  },
  {
    league_id: league_id,
    sport_id: 103,
    number_teams: 2,
    conf_strict : true
  },
  {
    league_id: league_id,
    sport_id: 104,
    number_teams: 2,
    conf_strict : true
  },
  {
    league_id: league_id,
    sport_id: 105,
    number_teams: 3,
    conf_strict : true
  },
  {
    league_id: league_id,
    sport_id: 106,
    number_teams: 3,
    conf_strict : true
  },
  {
    league_id: league_id,
    sport_id: 107,
    number_teams: 1,
    conf_strict : true
  }
  ]

  return useEPL ? sports : sports.filter(x => x.sport_id !== 107)
}

const getInUseFantasyConf = (league_id, useEPL) =>
{
  const confs = [
    {league_id:league_id, sport_id: 101, conference_id:10101,number_teams: 1},
    {league_id:league_id, sport_id: 101, conference_id:10102,number_teams: 1},
    {league_id:league_id, sport_id: 102, conference_id:10201,number_teams: 1},
    {league_id:league_id, sport_id: 102, conference_id:10202,number_teams: 1},
    {league_id:league_id, sport_id: 103, conference_id:10301,number_teams: 1},
    {league_id:league_id, sport_id: 103, conference_id:10302,number_teams: 1},
    {league_id:league_id, sport_id: 104, conference_id:10401,number_teams: 1},
    {league_id:league_id, sport_id: 104, conference_id:10402,number_teams: 1},
    {league_id:league_id, sport_id: 105, conference_id:10501,number_teams: 1},
    {league_id:league_id, sport_id: 105, conference_id:10502,number_teams: 1},
    {league_id:league_id, sport_id: 105, conference_id:10503,number_teams: 1},
    {league_id:league_id, sport_id: 105, conference_id:10504,number_teams: 1},
    {league_id:league_id, sport_id: 105, conference_id:10505,number_teams: 1},
    {league_id:league_id, sport_id: 105, conference_id:10506,number_teams: 1},
    {league_id:league_id, sport_id: 106, conference_id:10601,number_teams: 1},
    {league_id:league_id, sport_id: 106, conference_id:10602,number_teams: 1},
    {league_id:league_id, sport_id: 106, conference_id:10603,number_teams: 1},
    {league_id:league_id, sport_id: 106, conference_id:10604,number_teams: 1},
    {league_id:league_id, sport_id: 106, conference_id:10605,number_teams: 1},
    {league_id:league_id, sport_id: 106, conference_id:10606,number_teams: 1},
    {league_id:league_id, sport_id: 106, conference_id:10607,number_teams: 1},
    {league_id:league_id, sport_id: 107, conference_id:10701,number_teams: 1},
  ]

  return useEPL ? confs : confs.filter(x => x.sport_id !== 107)
}


module.exports = router

