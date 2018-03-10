import {FetchThenDispatch} from './actionHelpers'

export const clickedCreateLeague = (leagueInfo) => dispatch =>
  FetchThenDispatch(
    dispatch,
    '/api/createleague',
    'POST',
    JSON.stringify({leagueInfo}))

export const clickedJoinLeague = (league_name, league_password, owner_name) => dispatch =>
  FetchThenDispatch(
    dispatch,
    '/api/joinleague',
    'POST',
    JSON.stringify({league_name, league_password, owner_name}))

export const clickedLeague = (league_id, user_id) => dispatch =>
  FetchThenDispatch(
    dispatch,
    '/api/clickleague',
    'POST',
    JSON.stringify({league_id, user_id}))

