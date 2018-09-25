import fetch from 'isomorphic-fetch'
import C from '../constants'

const defaultOptions = {
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
}

const parseResponse = response => {
  if(response.status === 401)
  {
    return {
      type: C.STATUS_401}
  }
  return response.json()
}

const logError = error => console.error(error, 1)
  
export const FetchThenDispatch = (dispatch, url, method, body) =>
  fetch(url, {method, body, ...defaultOptions})
    .then(parseResponse)
    .then(dispatch)
    .catch(logError)

export const Fetcher = (url, options) => fetch(url, {...defaultOptions, ...options})