import C from '../../constants'


export default (state = {}, action={ type: null }) => {
  switch (action.type){
  case C.GET_TEAMS:
    return {teams:action.teams,
      updateTime:action.updateTime}
  // case C.LOGOUT:
  //   return {}
  default:
    return state
  }  
}

