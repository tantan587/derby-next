import C from '../../constants'

const initialState = {
  open: true,
}

export default (state = initialState, action = { type: null }) => {
  switch (action.type) {
  case C.OPEN_DRAFT_REF:
    return {
      open: true
    }
  case C.CLOSE_DRAFT_REF:
    return {
      open: false,
    }
  case C.LOGOUT:
    return {
      open: false,
    }
  default:
    return state
  }
}
