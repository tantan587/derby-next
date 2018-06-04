import C from '../../constants'

export default (state = {}, action={ type: null }) => {
  switch (action.type){
  case C.GET_TEAMS:
    return {...state, teams:action.updateTime}
  // case C.LOGOUT:
  //   return {}
  default:
    return state
  }  
}