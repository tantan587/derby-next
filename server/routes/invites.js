const R = require('ramda')
const express = require('express')
const router = express.Router()

var fixtures = [
  {invitation_id: "1", league_id: 1, user_id: 1, status: 'Awaiting Reply'},
  {invitation_id: "2", league_id: 2, user_id: 2, status: 'Not Invited Yet'},
  {invitation_id: "3", league_id: 3, user_id: 3, status: 'Confirmed'},
]

router.get('/invites', (req, res) => {
  return res.json(fixtures)
})

router.post('/invites', (req, res) => {
  fixtures = fixtures.concat(req.body)
  return res.json(fixtures)
})

router.post('/invites/:invitation_id/send', (req, res) => {
  const invitation_id = req.params.invitation_id
  const index = R.findIndex(R.propEq('invitation_id', invitation_id), fixtures)
  fixtures = R.assocPath([index, 'status'], 'Confirmed', fixtures)
  return res.json(fixtures[index])
})

router.delete('/invites/:invitation_id', (req, res) => {
  const invitation_id = req.params.invitation_id

  // Get where item.invitation_id !== invitation_id
  fixtures = R.filter(
    R.complement(R.propEq('invitation_id', invitation_id)),
    fixtures,
  )

  return res.json({invitation_id})
})

module.exports = router