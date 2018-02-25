import C from '../../constants'

export default (state = [], action={ type: null }) => {
  switch (action.type){
  case C.GET_SCHEDULE_BY_DAY:
    return action.schedule
  default:
    return state
  } 
}
