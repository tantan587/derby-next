import C from '../../constants'

const initialState = {
  open: false,
  currTeam: 'null',
}

export default (state = initialState, action = { type: null }) => {
  switch (action.type) {
  case C.OPEN_DIALOG:
    return {
      open: true,
      currTeam: action.payload,
    }
  case C.CLOSE_DIALOG:
    return {
      open: false,
      // currTeam: action.payload,
    }
  default:
    return state
  }
}
