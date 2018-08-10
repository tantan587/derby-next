import C from '../../constants'

export default (state = [], action={ type: null }) => {
  switch (action.type){
  case C.GET_SPORT_SEASONS: case C.CLICKED_LEAGUE:
  {
    return [...action.seasonIds]
  }
    
  default :
    return state
  }
}
