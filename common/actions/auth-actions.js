import fetch from 'isomorphic-fetch'

const parseResponse = response => response.json()

const logError = error => console.error(error)

const fetchThenDispatch = (dispatch, url, method, body) =>
  fetch(url, {method, body, headers: { 'Content-Type': 'application/json' }, credentials: 'include'})
    .then(parseResponse)
    .then(dispatch)
    .catch(logError)

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

 

