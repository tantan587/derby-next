import fetch from 'isomorphic-fetch'

const parseResponse = response => response.json()

const logError = error => console.error(error)

const fetchThenDispatch = (dispatch, url, method, body) =>
fetch(url, {method, body, headers: { 'Content-Type': 'application/json' }, credentials: 'include'})
        .then(parseResponse)
        .then(dispatch)
        .catch(logError)

export const clickedCreateLeague = (leagueInfo) => dispatch =>
    fetchThenDispatch(
        dispatch,
        '/api/createleague',
        'POST',
        JSON.stringify({leagueInfo})
    )

export const clickedJoinLeague = (league_name, league_password, owner_name) => dispatch =>
    fetchThenDispatch(
        dispatch,
        '/api/joinleague',
        'POST',
        JSON.stringify({league_name, league_password, owner_name})
)

export const clickedLeague = (league_id) => dispatch =>
fetchThenDispatch(
    dispatch,
    '/api/clickleague',
    'POST',
    JSON.stringify({league_id})
)

