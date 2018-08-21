const R = require('ramda')
const v4 = require('uuid/v4')
const express = require('express')
const router = express.Router()
const authHelpers = require('./helpers/authHelpers')
const userHelpers = require('./helpers/userHelpers')
const knex = require('../db/connection')

var fixtures = [
  {invite_id: "1", 'email': '1@url.com', league_id: "06ccb52f-08b6-4da1-9b4f-cd59cb16ae49", user_id: 1, status: 'Awaiting Reply'},
  {invite_id: "2", 'email': '2@url.com', league_id: "06ccb52f-08b6-4da1-9b4f-cd59cb16ae49", user_id: 2, status: 'Not Invited Yet'},
  {invite_id: "3", 'email': '3@url.com', league_id: "06ccb52f-08b6-4da1-9b4f-cd59cb16ae48", user_id: 3, status: 'Confirmed'},
]

const getInviteJSON = (owner) => {
  return knex
  .from('fantasy.owners as owner')
  .innerJoin('users.users as user', 'owner.user_id', 'user.user_id')
  .select('owner.owner_id as invite_id', 'user.email', 'user.username', 'owner.status', 'owner.league_id')
  .where({owner_id: owner.owner_id})
  .first()
}

router.get('/invites', authHelpers.loginRequired, (req, res) => {
  const league_id = req.query.league_id
  // if no league_id error
  return knex
  .from('fantasy.owners as owner')
  .innerJoin('users.users as user', 'owner.user_id', 'user.user_id')
  .select('owner.owner_id as invite_id', 'user.email', 'user.username', 'owner.status', 'owner.league_id')
  .where({league_id})
  .then(res.json.bind(res))
})

router.post('/invites', (req, res) => {
  const {
    email,
    league_id,
  } = req.body

  return userHelpers.getByEmail(email)
  .then((user) => {
    if (user) {
      const user_id = user.user_id
      const owner_id = v4()
      return knex('fantasy.owners')
      .insert({
        user_id,
        league_id,
        owner_id,
        owner_name: '',
        commissioner: false,
      })
      .returning('*')
      .then(([owner]) => {
        return getInviteJSON(owner)
        .then(res.json.bind(res))
      })
    } else {
      return res.sendStatus(400)
    }
  })
  .catch(console.error)
})

router.post('/invites/:invite_id/send', (req, res) => {
  const invite_id = req.params.invite_id
  return knex('fantasy.owners')
  .update({status: 'pending'})
  .whereNot({status: 'confirmed'})
  .andWhere({owner_id: invite_id})
  .returning('*')
  .then(([owner]) => {
    if (owner) return userHelpers
      .sendInvite(owner.user_id, owner.league_id)
      .then(() => getInviteJSON(owner))
      .then(res.json.bind(res))
    else return res.sendStatus(400)
  })
})

router.delete('/invites/:invite_id', (req, res) => {
  const invite_id = req.params.invite_id

  return knex('fantasy.owners')
  .update({status: 'inactive'})
  .where({owner_id: invite_id})
  .returning('*')
  .then(([owner]) => {
    if (owner) return getInviteJSON(owner).then(res.json.bind(res))
    else return res.sendStatus(400)
  })
})

module.exports = router