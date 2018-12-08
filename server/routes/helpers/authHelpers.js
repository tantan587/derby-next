//const R = require('ramda')
var bcrypt = require('bcrypt-nodejs')
const mailer = require('mailgun-js')
const knex = require('../../db/connection')
const ErrorText = require('../../../common/models/ErrorText')
const C = require('../../../common/constants')
const v4 = require('uuid/v4')
const generatePassword = require('password-generator')
//const signupTemplates = require('../../email-templates/signup')
//const dev = process.env.NODE_ENV !== 'production'

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword)
}

function createUser(req) {
  return handleErrors(req)
    .then(() => {
      const salt = bcrypt.genSaltSync()
      const hash = bcrypt.hashSync(req.body.password, salt)
      return knex.withSchema('users').table('users')
        .insert({
          user_id : v4(),
          username: req.body.username,
          password: hash,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          gender: req.body.gender,
          birthday: req.body.birthday,
          terms: req.body.terms,
          admin: false,
          verified: false,
          verification_code: Math.floor(1000 + Math.random() * 9000),
        })
        .returning('*')
    })
    .catch((err) => {
      return err
    })
}

function loginRequired(req, res, next) {
  //if (!req.user) return res.status(401).json({type: C.LOGOUT})
  if (!req.user) return res.status(401).json({message:'need to be loggged in'})
  return next()
}

// function adminRequired(req, res, next) {
//   if (!req.user) res.status(401).json({status: 'Please log in'});
//   return knex('users').where({username: req.user.username}).first()
//   .then((user) => {
//     if (!user.admin) res.status(401).json({status: 'You are not authorized'});
//     return next();
//   })
//   .catch((err) => {
//     res.status(500).json({status: 'Something bad happened'});
//   });
// }

function loginRedirect(req, res, next) {
  if (req.user) 
  {
    req.logout()
  }
  return next()
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

function handleErrors(req) {
  return new Promise((resolve, reject) => {
    let errorText = new ErrorText()
    if (req.body.username.length < 6) {
      errorText.addError('signup_username','Username must be longer than six characters')
    }
    if (req.body.password.length < 6) {
      errorText.addError('signup_password','Password must be longer than six characters')
    }
    if (validateEmail(req.body.email)=== false) {
      errorText.addError('signup_email','Not proper email format')
    }
    if (errorText.foundError()) {
      reject({
        type: C.SIGNUP_FAIL,
        error: errorText
      })
    }
    else {
      var str = `select (select count(*) 
      from users.users where username = '` + req.body.username + `') 
      username, ` +
      `(select count(*) from
       users.users where email = '` + req.body.email +'\') email'
      knex.raw(str)
        .then(result =>
        {
          if (result.rows.length !== 1)
          {
            throw 'Found More than one row. ' + req.body.username + ','+req.body.email
          }
          if (result.rows[0].username == 1) 
          {
            errorText.addError('signup_username','Username already exists. Please choose a different one')
          }
          if (result.rows[0].email == 1) 
          {
            errorText.addError('signup_email','Email has already be registered. Please choose a different one')
          }
          if (errorText.foundError()) {
            reject({
              type: C.SIGNUP_FAIL,
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

const getUserLeagues = (user, cb) =>{
  
  return  knex.withSchema('fantasy').table('leagues').where('user_id',user.user_id).innerJoin('owners', 'leagues.league_id', 'owners.league_id')
    .then(result =>
    {
      let leagues = []
      result.map(league => leagues.push(
        {
          league_id:league.league_id, 
          league_name:league.league_name
        }))
      cb(user, leagues)
    }
    )
}

const createNewPassword = (req, res) => 
{
  
  return knex.withSchema('users').table('users').where('email', req.body.email)
    .then(result => 
    {
      if(result.length === 1)
      {
        const newPassword = generatePassword(12,false)
        console.log(newPassword)
        const salt = bcrypt.genSaltSync()
        const hash = bcrypt.hashSync(newPassword, salt)
        return knex.withSchema('users').table('users').update('password', hash).where('email', req.body.email)
          .then(() => 
          {
            return {email:result[0].email, username:result[0].username, first_name:result[0].first_name, password:newPassword}
          })
      }
      else{
        var errorText = new ErrorText()
        errorText.addError('forgot_password_email','Unable to find this email')
        handleReduxResponse(res, 404, {
          type: C.FORGOT_PASSWORD_FAIL,
          error: errorText
        }) 
      }
    })
}

const updatePassword = (req) => {

  return new Promise((resolve, reject) => {
    let errorText = new ErrorText()
    if (req.body.password.length < 6) {
      errorText.addError('signup_password','Password must be longer than six characters')
    }
    if (errorText.foundError()) {
      reject({
        type: C.CREATE_PASSWORD_FAIL,
        error: errorText
      })
    }
    else {
      const salt = bcrypt.genSaltSync()
      const hash = bcrypt.hashSync(req.body.newPassword, salt)
      return knex.withSchema('users').table('users').update('password', hash).where('username', req.body.username)
        .then(() => 
        {
          resolve()
        })       
    }
  })
}

const sendEmail = (user, {subject, body, inline} = {}) => {
  return knex('users.email_auth')
    .select('*')
    .where('application', 'forgotpassword')//(dev ? 'forgotpassword-dev' : 'forgotpassword'))
    .first()
    .then(({api_key: apiKey, domain, email}) => {
      const mailGun = mailer({apiKey, domain})
      const mgConfig = {
        from: email,
        to: user.email,
        subject: subject ? subject(user) : '[Derby] Test Email',
        html: body ? body(user) : '<h1>This message does not contain a body</h1>',
        inline: inline ? inline(user) : [],
      }
      return mailGun.messages().send(mgConfig)
    })
}

function handleReduxResponse(res, code, action)
{
  res.status(code).json(action)
}

module.exports = {
  comparePass,
  createUser,
  loginRequired,
  //adminRequired,
  loginRedirect,
  getUserLeagues,
  updatePassword,
  createNewPassword,
  sendEmail,
}