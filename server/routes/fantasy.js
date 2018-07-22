const express = require('express')
const router = express.Router()
const authHelpers = require('./helpers/authHelpers')
const knex = require('../db/connection')
const C = require('../../common/constants')
const ErrorText = require('../../common/models/ErrorText')
const v4 = require('uuid/v4')
const fantasyHelpers = require('./helpers/fantasyHelpers')


router.post('/createleague', authHelpers.loginRequired, (req, res, next)  => {
  return createLeague(req, res)
    .then((response) => { 
      //this should be something different from update team points. Should just update league points, update league projected points
      return fantasyHelpers.updateTeamPoints(response.league_id)
        .then(() => {
          return getSimpleLeague(response.league_id, res, C.CREATE_LEAGUE_SUCCESS)})
      
    })
    .catch((err) => { 
      handleResponse(res, 500, err)})
})

router.post('/joinleague', authHelpers.loginRequired, (req, res, next)  => {
  return joinLeague(req, res)
    .then((league_id) => { 
      return getSimpleLeague(league_id,res, C.JOIN_LEAGUE_SUCCESS)
    })
    .catch((err) => { 
      handleResponse(res, 500, err) })
})

router.post('/saveownersettings', authHelpers.loginRequired, async (req, res, next)  => {
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

router.post('/clickleague', authHelpers.loginRequired, (req, res, next)  => {
  return fantasyHelpers.getLeague(req.body.league_id,req.body.user_id,res, C.CLICKED_LEAGUE)
})

function handleReduxResponse(res, code, action){
  res.status(code).json(action)
}

function handleResponse(res, code, statusMsg) {
  res.status(code).json({status: statusMsg})
}

function createLeague(req, res) {
  return handleCreateErrors(req)
    .then(() => {
      const league_id = v4()
      return getSportsData(req, league_id)
        .then((sportsData) =>
        {
          return knex.transaction(function (t) {
            return knex.withSchema('fantasy').table('leagues')
              .transacting(t)
              .insert({
                league_id : league_id,
                league_name: req.body.leagueInfo.league_name,
                year_starting : 2017, //this needs to be year independent, so that it can function
                year_ending : 2018,
                max_owners : req.body.leagueInfo.max_owners, 
                league_password: req.body.leagueInfo.league_password,
                total_enrolled: 1,
                private_ind: req.body.leagueInfo.privateInd,
              })
              .returning('*')
              .then((response) => {
                let owner_id = v4()
                return knex.withSchema('fantasy').table('owners')
                  .transacting(t)
                  .insert({
                    league_id: response[0].league_id,
                    user_id: req.user.user_id,
                    owner_id: owner_id,
                    owner_name:  req.body.leagueInfo.owner_name,
                    commissioner: true
                  })
                  .then(() => {
                    return knex.withSchema('fantasy').table('points')
                      .transacting(t)
                      .insert({
                        owner_id: owner_id,
                        total_points: 0,
                        rank: 1
                      })
                      .then(() => {
                        return knex.withSchema('draft').table('settings')
                          .transacting(t)
                          .insert({
                            league_id: response[0].league_id,
                            start_time: req.body.leagueInfo.fullStartTime,
                            type: req.body.leagueInfo.draft_type,
                            room_id: Math.random().toString(36).substr(2, 10),
                            draft_position: JSON.stringify([owner_id])
                          })
                          .then(() => {
                            return knex.withSchema('fantasy').table('sports')
                              .transacting(t)
                              .insert(sportsData.sports)
                              .then(() => {
                                return knex.withSchema('fantasy').table('conferences')
                                  .transacting(t)
                                  .insert(sportsData.conferences)
                                  .returning('conference_id')
                                  .then(()=>{
                                    //this may need to be updated with the update to the team points
                                    return knex.withSchema('fantasy').table('team_points')
                                      .transacting(t)
                                      .insert(sportsData.teams)
                                      .then(()=>{
                                        return response[0]
                                      })
                                  })
                              })
                          })
                      })
                  })
                  .then((response)=>{
                    t.commit
                    return response})
                  .catch(t.rollback)
              })
              .then((response)=>{
                return response
              })
              .catch(function (err) {
                console.log(err)
                res.status(403).json(err)
              })
          })
        })
        .catch((err) => {
          console.log(err)
          res.status(402).json(err)
        })
        
    })
    .catch((action) => {
      handleReduxResponse(res,401,action)
    })
}

function joinLeague(req, res) {
  return handleJoinErrors(req)
    .then((league_id) => {
      return knex.transaction(function (t) {
        let owner_id = v4()
        return knex.withSchema('fantasy').table('owners')
          .transacting(t)
          .insert({
            league_id: league_id,
            user_id: req.user.user_id,
            owner_id: owner_id,
            owner_name:  req.body.owner_name,
            commissioner: false
          })
          .then(() => {
            return knex.withSchema('fantasy').table('points')
              .transacting(t)
              .insert({
                owner_id: owner_id,
                total_points: 0,
                rank: 1
              })
              .then(() => {
                return knex.withSchema('draft').table('settings')
                  .transacting(t)
                  .where('league_id', league_id)
                  .then((resp) => {
                    const draft_position = resp[0].draft_position
                    draft_position.push(owner_id)
                    return knex
                      .withSchema('draft')
                      .table('settings')
                      .transacting(t)
                      .where('league_id',league_id)
                      .update('draft_position', JSON.stringify(draft_position))
                      .then(()=> {return})
                  })
              })  
          })
          .then(()=>{
            t.commit})
          .catch((err) => {t.rollback; throw err})
      })
        .then(()=>{
          return league_id
        })
        .catch(function (err) {
          res.status(400).json(err)
        })
    })
    .catch((action) => {
      handleReduxResponse(res,400,action)
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
    const sports = getInUseFantasySports(league_id, req.body.leagueInfo.EPL)
    const conferences = getInUseFantasyConf(league_id, req.body.leagueInfo.EPL)
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
  })
}

function handleCreateErrors(req) {
  return new Promise((resolve, reject) => {
    let errorText = new ErrorText()
    if (req.body.leagueInfo.league_name.length < 5) {
      errorText.addError('create_league_name','League name must be longer than five characters')
    }
    if (req.body.leagueInfo.league_password.length < 5) {
      errorText.addError('create_password','Password must be longer than five characters')
    }
    if (req.body.leagueInfo.owner_name.length < 5) {
      errorText.addError('create_owner_name','Owner name must be longer than five characters')
    }
    if ((new Date(req.body.leagueInfo.fullStartTime)) - new Date() < 86400000) {
      errorText.addError('create_draft_datetime','Draft Date/Time must be at least 24 hours from now')
    }
    if (errorText.foundError()) {
      reject({
        type: C.CREATE_LEAGUE_FAIL,
        error: errorText
      })
    }
    else {
      var str = 'select count(*) league_name from fantasy.leagues where league_name = \'' + req.body.leagueInfo.league_name + '\'' 
      knex.raw(str)
        .then(result =>
        {
          if (result.rows[0].league_name == 1) 
          {
            errorText.addError('create_league_name','League name already exists. Please choose a different one')
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
    }
  })
}

function handleJoinErrors(req) {
  return new Promise((resolve, reject) => {
    let errorText = new ErrorText()
    if (req.body.owner_name.length < 5) {
      errorText.addError('join_owner_name','Owner name must be longer than five characters')
    }
    if (errorText.foundError()) {
      reject({
        type: C.JOIN_LEAGUE_FAIL,
        error: errorText
      })
    }
    else {
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
            errorText.addError('join_league_name','Can not find this league')
          }
          if (result.rows[0].leagueexists === '1' && result.rows[0].passconfirm === '0') 
          {
            errorText.addError('join_league_password','password does not match')
          }
          if (result.rows[0].leagueexists === '1' && result.rows[0].joined === '1') 
          {
            errorText.addError('join_league_name','You\'ve already joined this league')
          }
          if (result.rows[0].leagueexists === '1' && result.rows[0].ownername === '1') 
          {
            errorText.addError('join_owner_name','Owner name already taken')
          }
          if (errorText.foundError()) {
            reject({
              type: C.JOIN_LEAGUE_FAIL,
              error: errorText})
          }
          else
          {
            resolve(result.rows[0].league_id)
          }
        })
    }
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
    errorText.addError('ownerName','Owner name must be longer than five characters')
  }
  
  if (req.body.ownerName && req.body.ownerName.length > 15) {
    errorText.addError('ownerName','Owner name must be shorter than fifteen characters')
  }
  if (ownerNames.includes(req.body.ownerName)) {
    errorText.addError('ownerName','Owner name must be unique')
  }
  if (silkColors.includes(req.body.avatar.primary + ';' + req.body.avatar.secondary)) {
    errorText.addError('color','This color combo has already been chosen. You must choose a unique set of colors.')
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

const getSimpleLeague = (league_id, res, type) =>{
  
  return knex.withSchema('fantasy')
    .table('leagues')
    .where('league_id',league_id)
    .then(result =>
    {
      if (result.length > 0) 
      {
        var league_name = result[0].league_name
        var league_id = result[0].league_id
        return handleReduxResponse(res,200, {
          type: type,
          league_name : league_name,
          league_id : league_id
        })
      }
      else
      {
        return handleReduxResponse(res,400, {});
      }
    })
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