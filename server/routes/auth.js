const express = require('express')
const router = express.Router()
const authHelpers = require('./helpers/authHelpers')
const adminHelpers = require('./helpers/adminHelpers')
const userHelpers = require('./helpers/userHelpers')
const passport = require('./helpers/local')
const C = require('../../common/constants')
const ErrorText = require('../../common/models/ErrorText')
const EMAIL_VERIFICATION = require('../../common/constants/email_verification')

//https://blog.jscrambler.com/implementing-jwt-using-passport/
//https://github.com/trandainhan/next.js-example-authentication-with-jwt/blob/master/utils/CookieUtils.js
//https://github.com/zeit/next.js/issues/153

router.post('/signup', authHelpers.loginRedirect, (req, res, next)  => {
  return authHelpers.createUser(req, res)
    .then((response) => {
      const newUser = response[0]
      return authHelpers
        .sendSignupEmail(newUser)
        .then(() => {
          return response
        })
    })
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
    if (user && user.verified === false) {
      var errorText = new ErrorText()
      errorText.addError('form', `
        You can\'t login if your email is not verified.<br />
        <a href="/email-verification?i=${user.user_id}">Click here to verify.</a>
      `)
      return handleReduxResponse(res, 404, {
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
              leagues : leagues,
              verified: user1.verified
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

router.get('/verify-email', (req, res) => {
  const { i: user_id } = req.query
  return userHelpers.isVerified(user_id).then(user => {
    if (!user || user.verified) res.sendStatus(400)
    else res.json({expires_at: user.expires_at, number_of_tries: user.number_of_tries})
  })
})

router.post('/verify-email', (req, res) => {
  const { i: user_id, c: verification_code } = req.body
  return userHelpers.verify(user_id, verification_code).then(payload => {
    switch(payload.type) {
      case EMAIL_VERIFICATION.CORRECT:
        return res.sendStatus(200)
      case EMAIL_VERIFICATION.INCORRECT:
      case EMAIL_VERIFICATION.NOT_FOUND:
      case EMAIL_VERIFICATION.LIMIT_EXCEEDED:
        return res.status(400).json(payload)
    }
  })
})

router.get('/verify-email/resend', (req, res) => {
  const { i: user_id } = req.query
  return userHelpers.resendEmail(user_id).then(payload => {
    if (payload) return res.sendStatus(200)
    else return res.sendStatus(400)
  })
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
