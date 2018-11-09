const R = require('ramda')
const knex = require('../../db/connection')
const {sendEmail, sendGeneric} = require('./authHelpers')
const EMAIL_VERIFICATION = require('../../../common/constants/email_verification')
const signupTemplates = require('../../email-templates/signup')
const leagueinviteTemplates = require('../../email-templates/leagueinvite')

module.exports.getById = (user_id) => knex('users.users')
  .where('user_id', user_id)
  .first()

module.exports.getByEmail = (email) => knex('users.users')
  .where('email', email)
  .first()

module.exports.isVerified = (user_id) => knex('users.users')
  .select('expires_at', 'verified', 'number_of_tries')
  .where('user_id', user_id)
  .first()

module.exports.verify = (user_id, verification_code) => knex('users.users')
  .whereRaw("expires_at > NOW()")
  .andWhere('verified', false)
  .andWhere('user_id', user_id)
  .increment('number_of_tries', 1)
  .returning('*')
  .then(([userObj]) => {
    if (userObj) {
      if (userObj.number_of_tries > 5) return {type: EMAIL_VERIFICATION.LIMIT_EXCEEDED}
      else if (userObj.verification_code === verification_code) {
        return knex('users.users')
          .where({id: userObj.id})
          .update({verified: true, number_of_tries: 0, verification_code: ''})
          .then(() => ({type: EMAIL_VERIFICATION.CORRECT}))
      } else return {type: EMAIL_VERIFICATION.INCORRECT, number_of_tries: userObj.number_of_tries}
    } else return {type: EMAIL_VERIFICATION.NOT_FOUND}
  })

module.exports.resendEmail = (user_id) => knex('users.users')
  .where({user_id, verified: false})
  .update({
    verification_code: Math.floor(1000 + Math.random() * 9000),
    expires_at: knex.raw("now() + INTERVAL '24 hours'"),
    number_of_tries: 0,
  })
  .returning('*')
  .then(([userObj]) => {
    if (userObj) {
      return sendEmail(userObj, signupTemplates)
    }
    else return false
  })

module.exports.sendInvite = (user_id, league_id) => Promise.all([
  knex('users.users').where({user_id}).first(),
  knex('fantasy.leagues').where({league_id}).first(),
]).then(([user, league]) => {
  if (user && league) {
    return sendGeneric({user, league}, leagueinviteTemplates)
  }
  else return false
})

module.exports.sendInviteBulk = (invites) => {
  return Promise.all(invites.map(invite => {
    return sendGeneric(invite, leagueinviteTemplates)
  }))
}

module.exports.isLeagueMember = (user_id, league_id) => knex('fantasy.owners')
  .where('user_id', user_id)
  .andWhere('league_id', league_id)
  .first()
  .then(R.is(Object))

