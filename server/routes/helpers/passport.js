const passport = require('passport')
const knex = require('../../db/connection')

module.exports = () => {

  passport.serializeUser((user, done) => {
    done(null, user.user_id)
  })

  passport.deserializeUser((user_id, done) => {
    return knex.withSchema('users').table('users').where({user_id}).first()
      .then((user) => { done(null, user) })
      .catch((err) => { done(err, null) })
  })

}