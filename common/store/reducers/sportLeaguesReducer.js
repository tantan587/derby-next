import C from '../../constants'


export default (state = [], action={ type: null }) => {
  switch (action.type){
  case C.GET_SPORT_LEAGUES:
    return action.sportLeagues
  case C.LOGOUT:
    return []
  default:
    return state
  } 
}
