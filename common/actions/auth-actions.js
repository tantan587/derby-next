import C from '../constants'
import {FetchThenDispatch} from './actionHelpers'

export const loadSuccess = () => {
  return {type: C.DATA_LOAD_SUCCESS}
}

export const handledPressedLogin = () =>
  ({
    type: C.PRESSED_LOGIN
  })


export const clickedLogin = (username, password) => dispatch =>
  FetchThenDispatch(
    dispatch,
    '/api/login',
    'POST',
    JSON.stringify({username, password})
  ) 

export const clickedLogout = () => dispatch =>
  FetchThenDispatch(
    dispatch,
    '/api/logout',
    'POST',
    JSON.stringify({})
  )

export const clickedSignup = (username,first_name,last_name,email,password) => dispatch =>
  FetchThenDispatch(
    dispatch,
    '/api/signup',
    'POST',
    JSON.stringify({username,first_name,last_name,email,password})
  )

export const clickedForgotPassword = (email) => dispatch =>
  FetchThenDispatch(
    dispatch,
    '/api/forgotpassword',
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

export const clickedAdminUpdates = () => dispatch =>
{
  FetchThenDispatch(
    dispatch,
    '/api/adminupdates',
    'POST',
    JSON.stringify()
  )
}

export const handleForceLogin = previousPage =>
  ({
    type: C.FORCED_LOGIN,
    previousPage : previousPage
  })

 

