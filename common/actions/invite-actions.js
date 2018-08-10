import C from '../constants'

export const getInvites = () => (dispatch) => {
  dispatch(getInvitesRequest())
  return fetch('/api/invites')
  .then(res => res.json())
  .then(invites => dispatch(getInvitesSuccess(invites)))
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
  return fetch('/api/invites', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(invite)})
  .then(res => res.json())
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
  dispatch(createInviteRequest())
  return fetch(`/api/invites/${invite_id}/send`, {method: 'POST'})
  .then(res => res.json())
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
  dispatch(createInviteRequest())
  return fetch(`/api/invites/${invite_id}`, {method: 'DELETE'})
  .then(res => res.json())
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