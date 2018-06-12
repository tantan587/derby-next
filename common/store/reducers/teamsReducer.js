import C from '../../constants'


export default (state = {}, action={ type: null }) => {
  switch (action.type){
  case C.GET_TEAMS: case C.UPDATE_TEAM:
    return action.teams
  case C.UPDATE_TEAM_DIFF:
  {
    Object.keys(action.teamsDiff).forEach(teamId =>
    {
      state[teamId] = action.teamsDiff[teamId]
    })
    return state
  }
  // case C.LOGOUT:
  //   return {}
  default:
    return state
  }  
}

