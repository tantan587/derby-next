import C from '../../constants'


export default (state = {}, action={ type: null }) => {
  switch (action.type){
  case C.GET_ONE_TEAM:
    return action.oneTeam
  case C.LOGOUT:
    return {}
  default:
    return state
  }  
}
