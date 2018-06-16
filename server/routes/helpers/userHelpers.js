const R = require('ramda')
const knex = require('../../db/connection')

module.exports.getById = (user_id) => knex('users.users')
  .where('user_id', user_id)

module.exports.isVerified = (user_id) => knex('users.users')
  .select('expires_at', 'verified')
  .where('user_id', user_id)
  .first()

module.exports.verify = (user_id, verification_code) => knex('users.users')
  .whereRaw("expires_at > NOW()")
  .andWhere('user_id', user_id)
  .andWhere('verification_code', verification_code)
  .andWhere('verified', false)
  .update({verified: true, verification_code: ''})