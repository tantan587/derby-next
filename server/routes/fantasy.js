const express = require('express')
const router = express.Router()
const authHelpers = require('./helpers/authHelpers')
const knex = require('../db/connection')
const C = require('../../common/constants')
const ErrorText = require('../../common/models/ErrorText')
const v4 = require('uuid/v4')

router.post('/createleague', authHelpers.loginRequired, (req, res, next)  => {
  return createLeague(req, res)
    .then((response) => { 
      return getSimpleLeague(response.league_id, res, C.CREATE_LEAGUE_SUCCESS)
    })
    .catch((err) => { 
      handleResponse(res, 500, err)})
})

router.post('/joinleague', authHelpers.loginRequired, (req, res, next)  => {
  return joinLeague(req, res)
    .then((response) => { 
      return getSimpleLeague(response.league_id,res, C.JOIN_LEAGUE_SUCCESS)
    })
    .catch((err) => { 
      handleResponse(res, 500, err) })
})

router.post('/clickleague', authHelpers.loginRequired, (req, res, next)  => {
  return getLeague(req.body.league_id,res, C.CLICKED_LEAGUE)
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
      return knex.transaction(function (t) {
        return knex.withSchema('fantasy').table('leagues')
          .transacting(t)
          .insert({
            league_id : v4(),
            league_name: req.body.leagueInfo.league_name,
            year_starting : 2017,
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
                  .then(()=>{
                    return response[0]})
                  .then((response)=>{
                    return response})
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
          res.status(400).json(err)
        })
    })
    .catch((err) => {
      res.status(400).json(err)
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
          .returning('*')
          .then((response) => {
            return knex.withSchema('fantasy').table('points')
              .transacting(t)
              .insert({
                owner_id: owner_id,
                total_points: 0,
                rank: 1
              })
              .then(()=>{
                return response[0]})
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
          res.status(400).json(err)
        })
    })
    .catch((action) => {
      handleReduxResponse(res,400,action)
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

const getLeague = (league_id, res, type) =>{


  var str = 'select a.*, b.username, c.league_name, c.max_owners, c.league_id, d.total_points, d.rank from ' +
  'fantasy.owners a, users.users b, fantasy.leagues c, fantasy.points d where a.league_id = \'' + league_id +
  '\' and a.user_id = b.user_id and a.league_id = c.league_id and a.owner_id = d.owner_id'
  return knex.raw(str)
    .then(result =>
    {
      if (result.rows.length > 0) 
      {
        var league_name = result.rows[0].league_name
        var max_owners = result.rows[0].max_owners
        var league_id = result.rows[0].league_id
        var owners = []
        result.rows.map(owner => owners.push(
          {
            owner_name:owner.owner_name, 
            total_points:owner.total_points,
            rank:owner.rank,
            username:owner.username,
            user_id: owner.user_id
          }))
        return handleReduxResponse(res,200, {
          type: type,
          league_name : league_name,
          max_owners : max_owners,
          league_id : league_id,
          owners : owners
        })
      }
      else
      {
        return handleReduxResponse(res,400, {})
      }
    })
}

module.exports = router