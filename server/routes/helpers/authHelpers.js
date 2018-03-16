var bcrypt = require('bcrypt-nodejs')
const knex = require('../../db/connection')
const ErrorText = require('../../../common/models/ErrorText')
const C = require('../../../common/constants')
const v4 = require('uuid/v4')
const generatePassword = require('password-generator')

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword)
}

function createUser(req, res) {
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
          admin: false
        })
        .returning('*')
    })
    .catch((err) => {
      res.status(400).json(err)
    })
}

function loginRequired(req, res, next) {
  if (!req.user) return res.status(401).json({type: C.LOGOUT})
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
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email)
}

function handleErrors(req) {
  return new Promise((resolve, reject) => {
    let foundError = false;
    let errorText = new ErrorText();
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
      });
    }
     else {
      var str = "select (select count(*) from users.users where username = '" + req.body.username + "') username, " +
      "(select count(*) from users.users where email = '" + req.body.email +"') email"
      knex.raw(str)
      .then(result =>
        {
          if (result.rows.length !== 1)
          {
            throw err
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
              error: errorText});
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

const sendForgotPasswordEmail = (user, res) =>
{
  return knex.withSchema('users').table('email_auth').where('application', 'forgotpassword')
    .then(result => 
    {
      const mailgun = require('mailgun-js')({apiKey: result[0].api_key, domain: result[0].domain})
      const style = 'background-color:rgb(255, 255, 255); color:rgb(34, 34, 34); font-family:arial,sans-serif; font-size:12.8px'
      console.log(user.email)
      const data = {
        from: result[0].email,
        to: user.email,
        subject: 'Reset Password',
        html: `<html>
        <head>
          <title></title>
        </head>
        <body><span style={`+style+'}>Dear '+ user.first_name +`,</span><br />
          <br />
          <span style={`+style+'}>You have requested to reset your Derby password and your temporary password is: <strong>'+user.password+`</strong></span><br />
          <br />
          <span style={`+style+`}>To change your password, please follow these steps:</span>
          <ol>
            <li><span style={`+style+`}>Go to this <a href="http://www.derby-fwl.com/createpassword">link</a></span></li>
            <li><span style={`+style+`}>Enter your username.</span></li>
            <li><span style={`+style+`}>Enter your temporary password. Hint: Copy and paste the password in order to enter it.</span></li>
            <li><span style={`+style+`}>Create your new password.&nbsp;</span></li>
            <li><span style={`+style+`}>Hit the SUMBIT&nbsp;button.&nbsp;</span></li>
          </ol>
          <span style={`+style+`}>Enjoy The Derby!</span><br />
          &nbsp;
          <div>&nbsp;</div>
          
          <div>&nbsp;</div>
        </body>
      </html>`
      
      }
      //https://www.aceware.com/htmlemail.html
      
      mailgun.messages().send(data, function (error, body) {
        console.log(body)
        handleReduxResponse(res, 200, {
          type: C.FORGOT_PASSWORD_SUCCESS})
      })
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
  sendForgotPasswordEmail
}