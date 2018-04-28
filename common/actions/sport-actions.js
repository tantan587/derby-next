import C from '../constants'
import {FetchThenDispatch} from './actionHelpers'

export const clickedStandings = (league_id) => dispatch =>
  FetchThenDispatch(
    dispatch,
    '/api/standings',
    'POST',
    JSON.stringify({league_id})
  )

export const clickedSportLeagues = (league_id) => dispatch =>
  FetchThenDispatch(
    dispatch,
    '/api/sportleagues',
    'POST',
    JSON.stringify({league_id})
  )

export const clickedSaveDraft = (league_id, allTeams) => dispatch =>
  FetchThenDispatch(
    dispatch,
    '/api/savedraft',
    'POST',
    JSON.stringify({league_id, allTeams})
  )

export const clickedDateChange = (league_id, date) => dispatch =>
  FetchThenDispatch(
    dispatch,
    '/api/schedule',
    'POST',
    JSON.stringify({league_id, date})
  )

export const clickedOneTeam = (team_id, league_id) => dispatch =>
  FetchThenDispatch(
    dispatch,
    '/api/oneteam',
    'POST',
    JSON.stringify({team_id,league_id})
  )
  
export const handleUpdateDraftOrder = draftOrder =>
  ({
    type: C.UPDATE_DRAFT_ORDER,
    draftOrder
  })
