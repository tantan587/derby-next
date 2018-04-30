import C from '../../constants'

const initialState = {
  open: false,
  currTeam: 'null',
}

export default (state = initialState, action = { type: null }) => {
  switch (action.type) {
  case C.OPEN_DIALOG:
    console.log('YOU DID OPEN_DIALOG', state)
    return { open: true }
  case C.CLOSE_DIALOG:
    console.log('YOU DID CLOSE_DIALOG', state)
    return { open: false }
  default:
    return state
  }
}
