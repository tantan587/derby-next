const R = require('ramda')
const knex = require('../../db/connection')
const {sendEmail} = require('./authHelpers')
const EMAIL_VERIFICATION = require('../../../common/constants/email_verification')

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
      expires_at: knex.raw("now() + INTERVAL '15 minutes'"),
      number_of_tries: 0,
    })
    .returning('*')
    .then(([userObj]) => {
      if (userObj) {
        return sendSignupEmail(userObj)
      }
      else return false
    })
