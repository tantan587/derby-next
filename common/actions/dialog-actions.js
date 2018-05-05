import C from '../constants'

export const handleOpenDialog = (payload) => ({
  type: C.OPEN_DIALOG,
  payload,
})

export const handleCloseDialog = (payload) => ({
  type: C.CLOSE_DIALOG,
  payload,
})
