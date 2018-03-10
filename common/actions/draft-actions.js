import C from '../constants'
import {FetchThenDispatch} from './actionHelpers'

export const clickedEnterDraft = (room_id) => dispatch =>
  FetchThenDispatch(
    dispatch,
    '/api/enterdraft',
    'POST',
    JSON.stringify({room_id})
  )
  
export const handleStartDraft = () =>
  ({
    type: C.START_DRAFT
  })

export const handleSetDraftMode = (mode) =>
  ({
    type: C.UPDATE_DRAFT_MODE,
    mode
  })

export const handleDraftPick = () =>
  ({
    type: C.DRAFT_PICK
  })

