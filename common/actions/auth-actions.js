import fetch from 'isomorphic-fetch'
import C from '../constants'

const parseResponse = response => response.json()

const logError = error => console.error(error)

const fetchThenDispatch = (dispatch, url, method, body) =>
  fetch(url, {method, body, headers: { 'Content-Type': 'application/json' }, credentials: 'include'})
    .then(parseResponse)
    .then(dispatch)
    .catch(logError)

export const loadSuccess = () => {
  return {type: C.DATA_LOAD_SUCCESS}
}

export const handledPressedLogin = () =>
  ({
    type: C.PRESSED_LOGIN
  })


export const clickedLogin = (username, password) => dispatch =>
  fetchThenDispatch(
    dispatch,
    '/api/login',
    'POST',
    JSON.stringify({username, password})
  ) 

export const clickedLogout = () => dispatch =>
  fetchThenDispatch(
    dispatch,
    '/api/logout',
    'POST',
    JSON.stringify({})
  )

export const clickedSignup = (username,first_name,last_name,email,password) => dispatch =>
  fetchThenDispatch(
    dispatch,
    '/api/signup',
    'POST',
    JSON.stringify({username,first_name,last_name,email,password})
  )

export const clickedForgotPassword = (email) => dispatch =>
  fetchThenDispatch(
    dispatch,
    '/api/forgotpassword',
    'POST',
    JSON.stringify({email})
  )

export const clickedCreatePassword = (username,password,newPassword) => dispatch =>
  fetchThenDispatch(
    dispatch,
    '/api/createpassword',
    'POST',
    JSON.stringify({username,password,newPassword})
  )

export const handleForceLogin = previousPage =>
  ({
    type: C.FORCED_LOGIN,
    previousPage : previousPage
  })

 

