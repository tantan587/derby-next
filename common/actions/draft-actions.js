import C from '../constants'
import {FetchThenDispatch} from './actionHelpers'

export const clickedEnterDraft = (room_id, owner_id) => dispatch =>
  FetchThenDispatch(
    dispatch,
    '/api/enterdraft',
    'POST',
    JSON.stringify({room_id, owner_id})
  )
  
export const handleStartDraft = () =>
  ({
    type: C.START_DRAFT
  })

export const handleUpdateQueue = (queue) =>
  ({
    type: C.UPDATE_DRAFT_QUEUE,
    queue
  })

export const handleSetDraftMode = (mode) =>
  ({
    type: C.UPDATE_DRAFT_MODE,
    mode
  })
export const handleDraftPick = (data) =>
  ({
    type: C.DRAFT_PICK,
    data
  })

