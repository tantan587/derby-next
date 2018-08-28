import C from '../../constants'


export default (state = {}, action={ type: null }) => {
  switch (action.type){
  case C.CLEAR_FILTERS: 
  {
    delete state[action.page]
    return {...state}
  }

  case C.UPDATE_FILTER: 
  {
    if (!state[action.page])
    {
      state[action.page] = {}
    }
    state[action.page][action.filterId] = action.filter
    return {...state}
  }

  case C.REMOVE_FILTER: 
  {
    delete state[action.page][action.filterId]
    return {...state}
  }
    
  case C.LOGOUT:
    return {}
  default:
    return state
  }  
}