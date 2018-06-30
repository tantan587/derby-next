import fetch from 'isomorphic-fetch'

const defaultOptions = {
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
}

const parseResponse = response => response.json()

const logError = error => console.error(error)
  
export const FetchThenDispatch = (dispatch, url, method, body) =>
  fetch(url, {method, body, ...defaultOptions})
    .then(parseResponse)
    .then(dispatch)
    .catch(logError)

export const Fetcher = (url, options) => fetch(url, {...defaultOptions, ...options})