import C from '../constants'
import {FetchThenDispatch} from './actionHelpers'

export const clickedSaveDraft = (league_id, allTeams) => dispatch =>
  FetchThenDispatch(
    dispatch,
    '/api/savedraft',
    'POST',
    JSON.stringify({league_id, allTeams})
  )

export const getSportSeasons = (league_id) => dispatch =>
  FetchThenDispatch(
    dispatch,
    '/api/sportSeasons',
    'POST',
    JSON.stringify({league_id})
  )

export const clickedDateChange = (league_id, date) => dispatch =>
  FetchThenDispatch(
    dispatch,
    '/api/schedule',
    'POST',
    JSON.stringify({league_id, date})
  )

export const clickedOneTeam = (team_id) => dispatch =>
  FetchThenDispatch(
    dispatch,
    '/api/oneteam',
    'POST',
    JSON.stringify({team_id})
  )

export const handleTeamUpdateTime = updateTime =>
  ({
    type: C.UPDATE_TEAM_UPDATE_TIME,
    updateTime
  })

export const handleTeamUpdate = teams =>
  ({
    type: C.UPDATE_TEAMS,
    teams
  })

export const handleTeamUpdateDiff = teamsDiff =>
  ({
    type: C.UPDATE_TEAM_DIFF,
    teamsDiff
  })

export const handleGameUpdateTime = updateTime =>
  ({
    type: C.UPDATE_GAME_UPDATE_TIME,
    updateTime
  })

export const handleGameUpdate = games =>
  ({
    type: C.UPDATE_GAMES,
    games
  })

export const handleGameUpdateDiff = gamesDiff =>
  ({
    type: C.UPDATE_GAME_DIFF,
    gamesDiff
  })
