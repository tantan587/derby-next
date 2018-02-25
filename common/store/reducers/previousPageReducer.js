import C from '../../constants'

export default (state = '', action={ type: null }) => {
  switch (action.type){
  case C.FORCED_LOGIN:
    return action.previousPage
  default:
    return state
  } 
}
