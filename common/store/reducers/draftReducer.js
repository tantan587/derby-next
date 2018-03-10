import C from '../../constants'

export default (state = {}, action={ type: null }) => {
  switch (action.type){
  case C.ENTERED_DRAFT:
    return {
      mode : action.mode,
      pick : action.pick
    }
  case C.UPDATE_DRAFT_MODE:
    return {
      ...state, mode : action.mode }
  case C.START_DRAFT:
    return {
      mode : 'live',
      pick : 0
    }
  case C.DRAFT_PICK:
    return {
      ...state, pick : state.pick+1 }
  case C.LOGOUT:
    return {
      mode : false,
    }
  default:
    return state
  }  
}

