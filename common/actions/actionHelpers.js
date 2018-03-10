import fetch from 'isomorphic-fetch'

const parseResponse = response => response.json()

const logError = error => console.error(error)
  
export const FetchThenDispatch = (dispatch, url, method, body) =>
  fetch(url, {method, body, headers: { 'Content-Type': 'application/json' }, credentials: 'include'})
    .then(parseResponse)
    .then(dispatch)
    .catch(logError)