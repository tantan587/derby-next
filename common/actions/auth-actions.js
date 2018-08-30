import C from '../constants'
import {FetchThenDispatch, Fetcher} from './actionHelpers'

export const loadSuccess = () => {
  return {type: C.DATA_LOAD_SUCCESS}
}

export const handledPressedLogin = () =>
  ({
    type: C.PRESSED_LOGIN
  })


export const clickedLogin = (username, password) => dispatch =>
{ username = username.trim()
  return FetchThenDispatch(
    dispatch,
    '/api/login',
    'POST',
    JSON.stringify({username, password})
  )} 

export const clickedLogout = () => dispatch =>
  FetchThenDispatch(
    dispatch,
    '/api/logout',
    'POST',
    JSON.stringify({})
  )

export const clickedSignup = (username,first_name,last_name,email,password,gender,birthday,terms) => dispatch =>
{ username = username.trim()
  return FetchThenDispatch(
    dispatch,
    '/api/signup',
    'POST',
    JSON.stringify({username,first_name,last_name,email,password,gender,birthday,terms})
  )}

export const clickedForgotPassword = (email) => dispatch =>
  FetchThenDispatch(
    dispatch,
    '/api/forgotpassword',
    'POST',
    JSON.stringify({email})
  )

export const clickedForgotUsername = (email) => dispatch =>
  FetchThenDispatch(
    dispatch,
    '/api/forgotusername',
    'POST',
    JSON.stringify({email})
  )  

export const clickedCreatePassword = (username,password,newPassword) => dispatch =>
  FetchThenDispatch(
    dispatch,
    '/api/createpassword',
    'POST',
    JSON.stringify({username,password,newPassword})
  )

export const clickedAdminUpdates = (id) => dispatch =>
{
  FetchThenDispatch(
    dispatch,
    '/api/adminupdates',
    'POST',
    JSON.stringify({id})
  )
}

export const handleForceLogin = previousPage =>
  ({
    type: C.FORCED_LOGIN,
    previousPage : previousPage
  })

export const isVerified = (user_id) => () => Fetcher(`/api/verify-email?i=${user_id}`)

export const doVerify = (user_id, verification_code) => () => Fetcher(
  '/api/verify-email',
  { method: 'POST', body: JSON.stringify({i:user_id, c:verification_code})}
)

export const doResend = (user_id) => () => Fetcher(`/api/verify-email/resend?i=${user_id}`)