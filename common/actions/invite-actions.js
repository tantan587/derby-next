const R = require('ramda')
import C from '../constants'

export const getInvites = (league_id) => (dispatch) => {
  dispatch(getInvitesRequest())
  const fetchConfig = {credentials: 'same-origin'}
  return Promise.all([
      fetch('/api/v2/invites/owners?league_id='+league_id, fetchConfig),
      fetch('/api/v2/invites?league_id='+league_id, fetchConfig),
    ])
    .then(([res0, res1]) => Promise.all([
      res0.json().then(json => Promise[res0.ok ? 'resolve' : 'reject'](json)),
      res1.json().then(json => Promise[res1.ok ? 'resolve' : 'reject'](json))
    ]))
    .then(([invites0, invites1]) => {
      const deduped = R.pipe(R.indexBy(R.prop('email')), R.values)([
        ...invites1,
        ...invites0.map(R.assoc('status', 'confirmed')),
      ])
      dispatch(getInvitesSuccess(deduped))
    })
    .catch(error => dispatch(getInvitesFail(error)))
}

export const getInvitesRequest = () => ({
  type: C.GET_INVITES,
})

export const getInvitesSuccess = (payload) => ({
  type: C.GET_INVITES_SUCCESS,
  payload,
})

export const getInvitesFail = (error) => ({
  type: C.GET_INVITES_FAIL,
  error,
})

export const createInvite = (invite) => (dispatch) => {
  dispatch(createInviteRequest())
  return fetch('/api/v2/invites', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(invite), credentials: 'same-origin'})
    .then(res => res.json().then(json => Promise[res.ok ? 'resolve' : 'reject'](json)))
    .then(invite => dispatch(createInviteSuccess(invite)))
    .catch(error => dispatch(createInviteFail(error)))
}

export const createInviteSignup = (invite) => (dispatch) => {
  dispatch(createInviteRequest())
  return fetch('/api/v2/invites/signup', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(invite), credentials: 'same-origin'})
  .then(res => res.json().then(json => Promise[res.ok ? 'resolve' : 'reject'](json)))
  .then(invite => dispatch(createInviteSuccess(invite)))
  .catch(error => dispatch(createInviteFail(error)))
}

export const createInviteRequest = () => ({
  type: C.CREATE_INVITE,
})

export const createInviteSuccess = (payload) => ({
  type: C.CREATE_INVITE_SUCCESS,
  payload,
})

export const createInviteFail = (error) => ({
  type: C.CREATE_INVITE_FAIL,
  error,
})

export const sendInvite = (invite_id) => (dispatch) => {
  dispatch(sendInviteRequest())
  return fetch(`/api/v2/invites/${invite_id}/send`, {method: 'POST', credentials: 'same-origin'})
    .then(res => res.json().then(json => Promise[res.ok ? 'resolve' : 'reject'](json)))
    .then(invite => dispatch(sendInviteSuccess(invite)))
    .catch(error => dispatch(sendInviteFail(error)))
}

export const sendInviteBulk = (invite_ids) => (dispatch) => {
  dispatch(sendInviteRequest())
  return fetch(`/api/v2/invites/bulk_send`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    credentials: 'same-origin',
    body: JSON.stringify({invite_ids}),
  })
  .then(res => res.json().then(json => Promise[res.ok ? 'resolve' : 'reject'](json)))
  .then(invite => dispatch(sendInviteSuccess(invite)))
  .catch(error => dispatch(sendInviteFail(error)))
}

export const sendInviteRequest = () => ({
  type: C.SEND_INVITE,
})

export const sendInviteSuccess = (payload) => ({
  type: C.SEND_INVITE_SUCCESS,
  payload,
})

export const sendInviteFail = (error) => ({
  type: C.SEND_INVITE_FAIL,
  error,
})

export const deleteInvite = (invite_id) => (dispatch) => {
  dispatch(deleteInviteRequest())
  return fetch(`/api/v2/invites/${invite_id}`, {method: 'DELETE', credentials: 'same-origin'})
    .then(res => res.json().then(json => Promise[res.ok ? 'resolve' : 'reject'](json)))
    .then(invite => dispatch(deleteInviteSuccess(invite)))
    .catch(error => dispatch(deleteInviteFail(error)))
}

export const deleteInviteBulk = ({emails, invite_ids}) => (dispatch) => {
  dispatch(deleteInviteRequest())
  return fetch(`/api/v2/invites/bulk`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      credentials: 'same-origin',
      body: JSON.stringify({emails, invite_ids}),
    })
    .then(res => res.json().then(json => Promise[res.ok ? 'resolve' : 'reject'](json)))
    .then(invite => dispatch(deleteInviteSuccess(invite)))
    .catch(error => dispatch(deleteInviteFail(error)))
}

export const deleteInviteRequest = () => ({
  type: C.DELETE_INVITE,
})

export const deleteInviteSuccess = (payload) => ({
  type: C.DELETE_INVITE_SUCCESS,
  payload,
})

export const deleteInviteFail = (error) => ({
  type: C.DELETE_INVITE_FAIL,
  error,
})

export const clearInviteError = () => ({
  type: C.CLEAR_INVITE_ERROR,
})