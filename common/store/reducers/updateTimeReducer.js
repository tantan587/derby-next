import C from '../../constants'


export default (state = {}, action={ type: null }) => {
  switch (action.type){
  case C.GET_TEAMS: case C.UPDATE_TEAM_UPDATE_TIME:
    return {...state, teams:action.updateTime}
  case C.UPDATE_GAME_UPDATE_TIME:
    return {...state, games:action.updateTime}


  // case C.LOGOUT:
  //   return {}
  default:
    return state
  }  
}