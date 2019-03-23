const R = require('ramda')
const v4 = require('uuid/v4')
const express = require('express')
const router = express.Router()
const authHelpers = require('./helpers/authHelpers')
const userHelpers = require('./helpers/userHelpers')
const knex = require('../db/connection')

const INVITE_FIELDS = [
  'league_id',
  'from_id',
  'to_id',
  'status',
]

const INVITE_FRONTEND_FIEDS = [
  'invite_id',
  'league_id',
  'email',
  'status',
  'username',
]

const getInvitesById = (invite_ids) => {
  return knex
    .from('fantasy.invites as invite')
    .leftJoin('fantasy.leagues as league', 'invite.league_id', 'league.league_id')
    .leftJoin('users.users as from_user', 'invite.from_id', 'from_user.user_id')
    .leftJoin('users.users as to_user', 'invite.email', 'to_user.email')
    .select(
      'invite.invite_id',
      'invite.league_id',
      'invite.email',
      'invite.status',
      'to_user.username',
      'to_user.first_name',
      'to_user.user_id as user_id',
      'from_user.username as from_username',
      'league.league_name',
      'league.league_password'
    )
    .whereIn('invite.invite_id', invite_ids)
}

const getInviteJSON = (owner) => {
  return knex
    .from('fantasy.owners as owner')
    .innerJoin('users.users as user', 'owner.user_id', 'user.user_id')
    .select('owner.owner_id as invite_id', 'user.email', 'user.username', 'owner.status', 'owner.league_id')
    .where({owner_id: owner.owner_id})
    .first()
}

const getInviteJSONv2 = (invite) => {
  return knex
    .from('fantasy.invites as invite')
    .leftJoin('users.users as from_user', 'invite.from_id', 'from_user.user_id')
    .leftJoin('users.users as to_user', 'invite.email', 'to_user.email')
    .select('invite.invite_id', 'invite.league_id', 'invite.email', 'invite.status', 'to_user.username', 'from_user.username as from_username')
    .where({'invite.invite_id': invite.invite_id})
    .first()
}

router.get('/v2/invites/test', (req, res) => {
  return getInviteJSONv2({
    id: 3,
  }).then((invite) => {
    res.json(invite)
  })
})

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

router.get('/v2/invites/owners', authHelpers.loginRequired, (req, res) => {
  const league_id = req.query.league_id
  return knex
    .from('fantasy.owners as owner')
    .innerJoin('users.users as user', 'owner.user_id', 'user.user_id')
    .select(
      'owner.owner_id as invite_id',
      'owner.league_id',
      'user.email',
      'owner.status',
      'user.username'
    )
    .where({league_id})
    .then(res.json.bind(res))
})

router.get('/v2/invites', authHelpers.loginRequired, (req, res) => {
  const league_id = req.query.league_id
  return knex
    .from('fantasy.invites as invite')
    .leftJoin('users.users as from_user', 'invite.from_id', 'from_user.user_id')
    .leftJoin('users.users as to_user', 'invite.email', 'to_user.email')
    .select(
      'invite.invite_id',
      'invite.league_id',
      'invite.email',
      'invite.status',
      'to_user.username'
    )
    .where({'invite.league_id': league_id})
    // .then(() => res.status(400).json({code: 400, message: 'Bad Request'}))
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
        return res.status(400).json({code: 400, message: 'Bad Request'})
      }
    })
    .catch(console.error)
})

router.post('/v2/invites', (req, res) => {
  const {email, league_id} = req.body
  return userHelpers.isEmailInLeague(league_id,email)
    .then((isInLeague) => {
      console.log(isInLeague)
      if (isInLeague.length > 0)
      {
        return res.status(401).json({code: 401, message: 'Bad Request'})
      }
      else {
        return userHelpers.getByEmail(email)
          .then((user) => {
            if (user) {
              const invite_id = v4()
              const from_id = req.user.user_id
              const status = 'not_invited'
              return knex('fantasy.invites')
                .insert({
                  invite_id,
                  league_id,
                  from_id,
                  email,
                  status,
                })
                .returning('*')
                .then(([invite]) => getInviteJSONv2(invite).then(res.json.bind(res)))
                .catch((err) => {
                  console.error(err)
                  return res.status(422).json({code: 422, message: 'Unprocessable Entity'})
                })
            } else {
              return res.status(400).json({code: 400, message: 'Bad Request'})
            }
          })
          .catch((err) => {
            console.error(err)
            return res.status(500).json({code: 500, message: 'Internal Server Error'})
          })
      }
    })
})  


// Send the email invite here!
router.post('/v2/invites/signup', (req, res) => {
  const {email, league_id} = req.body
  return userHelpers.getByEmail(email)
    .then((user) => {
      if (!user) {
        const invite_id = v4()
        const from_id = req.user.user_id
        const status = 'invited_to_signup'
        return knex('fantasy.invites')
          .insert({
            invite_id,
            league_id,
            from_id,
            email,
            status,
          })
          .returning('*')
          .then(([invite]) => getInviteJSONv2(invite).then(res.json.bind(res)))
          .catch((err) => {
            console.error(err)
            return res.status(422).json({code: 422, message: 'Unprocessable Entity'})
          })
      } else {
        return res.status(400).json({code: 400, message: 'Bad Request'})
      }
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({code: 500, message: 'Internal Server Error'})
    })
})

// Send the join league invite here
// The invite should have a user associated with it
router.post('/v2/invites/:invite_id/send', async (req, res) => {
  const id = req.params.invite_id
  const inviteJSON = await getInviteJSONv2({id})
  if (inviteJSON.username) {
    return knex('fantasy.invites')
      .update({status: 'invited'})
      .andWhere({invite_id: invite_id})
      .returning('*')
      .then(([invite]) => {
        if (invite) return getInviteJSONv2(invite).then(res.json.bind(res))
        else return res.status(400).json({code: 400, message: 'Bad Request'})  
      })
      .catch((err) => {
        console.error(err)
        return res.status(500).json({code: 500, message: 'Internal Server Error'})
      })
  } else {
    return res.status(400).json({code: 400, message: 'Can\'t invite unregistered user to a league '})
  }
})

router.post('/v2/invites/bulk_send', async (req, res) => {
  const invite_ids = req.body.invite_ids
  const invites = await getInvitesById(invite_ids)
  const optimisticInvites = R.pipe(R.reject(R.propSatisfies(R.isNil, 'username')), R.map(R.assoc('status', 'invited')))(invites)
  return userHelpers.sendInviteBulk(optimisticInvites)
    .then(() => {
      return knex('fantasy.invites')
        .update({status: 'invited'})
        .whereIn('invite_id', R.map(R.prop('invite_id'), optimisticInvites))
        .then(() => res.json(optimisticInvites))
    })
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
      else return res.status(400).json({code: 400, message: 'Bad Request'})
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
      else return res.status(400).json({code: 400, message: 'Bad Request'})
    })
})

router.delete('/v2/invites/bulk', async (req, res) => {
  const {emails, invite_ids} = req.body
  
  let resp = await knex('fantasy.owners').whereIn('owner_id', invite_ids).select('commissioner')
  if (resp.some(x => x.commissioner == true))
  {
    return res.status(400).json({code: 400, message: 'Bad Request'})
  }
  return Promise.all([
    knex('fantasy.owners').whereIn('owner_id', invite_ids).del().returning('*').map(R.prop('owner_id')),
    knex('fantasy.invites').whereIn('email', emails).del().returning('*').map(R.prop('invite_id')),
  ])
    .then(([deletedOwners, deletedInvites]) => {
      return res.json([...deletedOwners, ...deletedInvites])
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({code: 500, message: 'Internal Server Error'})
    })
})

router.delete('/v2/invites/:invite_id', (req, res) => {
  const invite_id = req.params.invite_id

  return knex('fantasy.owners')
    .where({owner_id: invite_id})
    .del()
    .then((resp) => {
      console.log(resp)
      if (owner) return res.json({invite_id})
      else return res.status(400).json({code: 400, message: 'Bad Request'})
    })
})

module.exports = router