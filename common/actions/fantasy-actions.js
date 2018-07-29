import {FetchThenDispatch} from './actionHelpers'
import C from '../constants'

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

export const clickedSaveSilks = (ownerName, pattern, primary, secondary, league_id, owner_id) => dispatch =>
{
  let avatar = {primary,secondary,pattern}
  FetchThenDispatch(
    dispatch,
    '/api/saveownersettings',
    'POST',
    JSON.stringify({ownerName, avatar, league_id, owner_id}))
}

export const clickedUpdateLeague = (leagueInfo, league_id) => dispatch =>
  FetchThenDispatch(
    dispatch,
    '/api/updateleague',
    'POST',
    JSON.stringify({leagueInfo, league_id}))


export const updateError = (name, error) => ({
  type: C.UPDATE_ERROR,
  name,
  error
})

export const makeProgress = (progress) => ({
  type: C.MAKE_PROGRESS,
  progress
})
