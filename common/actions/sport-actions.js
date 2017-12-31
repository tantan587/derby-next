import fetch from 'isomorphic-fetch'
import C from '../constants'

const parseResponse = response => response.json()

const logError = error => console.error(error)
  
const fetchThenDispatch = (dispatch, url, method, body) =>
  fetch(url, {method, body, headers: { 'Content-Type': 'application/json' }, credentials: 'include'})
    .then(parseResponse)
    .then(dispatch)
    .catch(logError)

export const clickedStandings = (league_id) => dispatch =>
  fetchThenDispatch(
    dispatch,
    '/api/standings',
    'POST',
    JSON.stringify({league_id})
  )
  
export const handleUpdateDraftOrder = draftOrder =>
  ({
    type: C.UPDATE_DRAFT_ORDER,
    draftOrder
  })
