import C from '../../constants'


export default (state = {}, action={ type: null }) => {
  switch (action.type){
  case C.GET_TEAMS:
    return action.teams
  case C.LOGOUT:
    return {}
  default:
    return state
  }  
}

