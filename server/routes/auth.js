const express = require('express')
const router = express.Router()
const authHelpers = require('./helpers/authHelpers')
const adminHelpers = require('./helpers/adminHelpers')
const passport = require('./helpers/local')
const C = require('../../common/constants')
const ErrorText = require('../../common/models/ErrorText')

//https://blog.jscrambler.com/implementing-jwt-using-passport/
//https://github.com/trandainhan/next.js-example-authentication-with-jwt/blob/master/utils/CookieUtils.js
//https://github.com/zeit/next.js/issues/153

router.post('/signup', authHelpers.loginRedirect, (req, res, next)  => {
  return authHelpers.createUser(req, res)
    .then((response) => {
    //need to check to make sure there is a reponse, else there was an error
      if (response)
      {
        passport.authenticate('local', (err, user, info) => {
          if (err || !user) {
            handleResponse(res, 500, err) }
          if (user) {
            req.login(user, function (err) {
              if (err) { handleResponse(res, 500, 'error') }
              handleReduxResponse(res, 200, {
                type: C.SIGNUP_SUCCESS,
                id: user.user_id,
                last_name : user.last_name,
                first_name : user.first_name,
                username : user.username
              })
            })
          }
        })(req, res, next)
      }
    })
    .catch((err) => {
      handleResponse(res, 500, 'error'); });
})

router.post('/login', authHelpers.loginRedirect, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { handleResponse(res, 500, 'error') }
    if (!user) {
      var errorText = new ErrorText()
      errorText.addError('login_password','Username / Password does not match')
      handleReduxResponse(res, 404, {
        type: C.LOGIN_FAIL,
        error: errorText
      })
    }
    if (user) {
      return req.login(user, function (err) {
        if (err) { handleResponse(res, 500, 'error') }
        else{
          return authHelpers.getUserLeagues(user, (user1,leagues) =>
            handleReduxResponse(res, 200, {
              type: C.LOGIN_SUCCESS,
              id: user1.user_id,
              last_name : user1.last_name,
              first_name : user1.first_name,
              username : user1.username,
              leagues : leagues
            })
          )
        }
      })
    }
  })(req, res, next)
})

router.post('/logout', (req, res, next) => {
  req.logout()
  handleReduxResponse(res, 200, {
    type: C.LOGOUT  })
})

router.post('/adminupdates', (req, res, next) => {
  adminHelpers.admin1()
})

router.post('/forgotpassword', (req, res, next) => {
  return authHelpers.createNewPassword(req, res)
    .then((user) => {
      if (user)
      {
        authHelpers.sendForgotPasswordEmail(user, res)
      }
    })
})

router.post('/createpassword', authHelpers.loginRedirect, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { handleResponse(res, 500, 'error') }
    if (!user) {
      var errorText = new ErrorText()
      errorText.addError('create_password_password','Username / Password does not match')
      handleReduxResponse(res, 404, {
        type: C.CREATE_PASSWORD_FAIL,
        error: errorText
      })
    }
    if (user) {
      authHelpers.updatePassword(req)
        .then(() =>
          handleReduxResponse(res, 200, {
            type: C.CREATE_PASSWORD_SUCCESS}
          ))
        .catch((err) => {
          res.status(400).json(err)
        })
    }
  })(req, res, next)
})

// *** helpers *** //

function handleResponse(res, code, statusMsg) {
  res.status(code).json({status: statusMsg})
}

function handleReduxResponse(res, code, action)
{
  res.status(code).json(action);
}

module.exports = router
