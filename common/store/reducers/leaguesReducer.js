import C from '../../constants'

export default (state = [], action={ type: null }) => {
  switch (action.type){
  case C.CREATE_LEAGUE_SUCCESS:
  case C.JOIN_LEAGUE_SUCCESS:
    return [
      ...state,
      simpleLeague(action)
    ]
  case C.LOGIN_SUCCESS:
    return action.leagues
  case C.LOGOUT:
    return []
  default :
    return state
  }
}

export const simpleLeague = (action) => {
  return {
    league_id : action.league_id,
    league_name : action.league_name
  }
}