const express = require('express')
const router = express.Router()
const authHelpers = require('./helpers/authHelpers')
const adminHelpers = require('./helpers/adminHelpers')
const userHelpers = require('./helpers/userHelpers')
const passport = require('./helpers/local')
const C = require('../../common/constants')
const ErrorText = require('../../common/models/ErrorText')
const EMAIL_VERIFICATION = require('../../common/constants/email_verification')
const forgotusernameTemplates = require('../email-templates/forgotusername')
const forgotpasswordTemplates = require('../email-templates/forgotpassword')
const signupTemplates = require('../email-templates/signup')

//https://blog.jscrambler.com/implementing-jwt-using-passport/
//https://github.com/trandainhan/next.js-example-authentication-with-jwt/blob/master/utils/CookieUtils.js
//https://github.com/zeit/next.js/issues/153

router.post('/signup', authHelpers.loginRedirect, (req, res)  => {
  return authHelpers.createUser(req)
    .then((response) => {
      if (!response.error) {
        const newUser = response[0]
        return authHelpers
          .sendEmail(newUser, signupTemplates)
          .then(() => handleReduxResponse(res, 200, {
            type: C.SIGNUP_SUCCESS,
            id: newUser.user_id,
            last_name : newUser.last_name,
            first_name : newUser.first_name,
            username : newUser.username
          }))
      } else {
        return handleReduxResponse(res, 400, {type: C.SIGNUP_FAIL, error:response.error})
      }
    })
    .catch(console.error)
})

router.post('/login', authHelpers.loginRedirect, (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) { handleResponse(res, 500, 'error') }
    if (!user || user.verified === false) {
      const errMsg = !user ? 'Username / Password does not match' : `
        You can't login if your email is not verified.<br />
        <a href="/email-verification?i=${user.user_id}">Click here to verify.</a>
      `
      var errorText = new ErrorText()
      errorText.addError('form', errMsg)
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
              verified: user1.verified,
              admin: user1.admin
            })
          )
        }
      })
    }
  })(req, res, next)
})

router.post('/logout', (req, res) => {
  req.logout()
  handleReduxResponse(res, 200, {
    type: C.LOGOUT  })
})

router.post('/adminupdates', (req) => {
  adminHelpers.admin1(req.body.id)
    .then(() => console.log('complete'))
    .catch((err) => console.log(err))
})

router.post('/forgotpassword', (req, res) => {
  return authHelpers.createNewPassword(req, res)
    .then((user) => {
      if (user) {
        return authHelpers
          .sendEmail(user, forgotpasswordTemplates)
          .then(() => handleReduxResponse(res, 200, {type: C.FORGOT_PASSWORD_SUCCESS}))
      }
    })
})

router.post('/forgotusername', (req, res) => {
  const {email} = req.body
  return userHelpers.getByEmail(email)
    .then((user) => {
      if (user) {
        return authHelpers
          .sendEmail(user, forgotusernameTemplates)
          .then(() => handleReduxResponse(res, 200, {type: C.FORGOT_USERNAME_SUCCESS}))
      } else {
        var errorText = new ErrorText()
        errorText.addError('form','Email is not found.')
        return handleReduxResponse(res, 404, {type: C.FORGOT_USERNAME_FAIL, error: errorText})
      }
    })
})

router.post('/createpassword', authHelpers.loginRedirect, (req, res, next) => {
  passport.authenticate('local', (err, user) => {
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
  return userHelpers
    .resendEmail(user_id)
    .then((success) => {
      if (success === false) return res.sendStatus(400)
      else return res.sendStatus(200)
    })
})

// *** helpers *** //

function handleResponse(res, code, statusMsg) {
  res.status(code).json({status: statusMsg})
}

function handleReduxResponse(res, code, action)
{
  res.status(code).json(action)
}

module.exports = router
