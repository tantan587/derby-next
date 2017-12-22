var bcrypt = require('bcrypt-nodejs')
const knex = require('../../db/connection')
const ErrorText = require('../../../common/models/ErrorText')
const C = require('../../../common/constants')
const v4 = require('uuid/v4')

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
      res.status(400).json(err);
    });
}

function loginRequired(req, res, next) {
  if (!req.user) return res.status(401).json({status: 'Please log in'});
  return next();
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
      req.logout();
  }
  return next();
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
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
  });
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

module.exports = {
  comparePass,
  createUser,
  loginRequired,
  //adminRequired,
  loginRedirect,
  getUserLeagues
}