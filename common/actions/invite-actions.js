import C from '../constants'

export const getInvites = () => ({
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


export const createInvite = () => ({
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


export const sendInvite = () => ({
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


export const deleteInvite = () => ({
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