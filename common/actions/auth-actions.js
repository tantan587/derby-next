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

export const addColor = (title, color) => dispatch =>
  fetchThenDispatch(
    dispatch,
    '/api/colors',
    'POST',
    JSON.stringify({title, color})
  )

export const removeColor = id => dispatch =>
  fetchThenDispatch(
    dispatch,
    `/api/color/${id}`,
    'DELETE'
  )

export const rateColor = (id, rating) => dispatch =>
  fetchThenDispatch(
    dispatch,
    `/api/color/${id}`,
    'PUT',
    JSON.stringify({rating})
  )