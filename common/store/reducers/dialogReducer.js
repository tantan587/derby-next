import C from '../../constants'

const initialState = {
  open: false,
}

export default (state = initialState, action = { type: null }) => {
  switch (action.type) {
  case C.OPEN_DIALOG:
    return {
      open: true
    }
  case C.CLOSE_DIALOG:
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
