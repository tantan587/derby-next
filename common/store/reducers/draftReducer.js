import C from '../../constants'

export default (state = {}, action={ type: null }) => {
  switch (action.type){
  case C.ENTERED_DRAFT:
    return {
      mode : action.mode,
      pick : action.pick,
      availableTeams: action.teams,
      allTeams:Array.from(action.teams),
      owners:action.owners
    }
  case C.UPDATE_DRAFT_MODE:
    return {
      ...state, mode : action.mode }
  case C.START_DRAFT:
  {
    const newOwners = {}
    Object.keys(state.owners).map(owner =>
      newOwners[owner] = []
    )
    return {
      ...state,
      availableTeams: Array.from(state.allTeams),
      mode : 'live',
      pick : 0,
      owners: newOwners
    }
  }
  case C.DRAFT_PICK:
  {
    const newAvailable = state.availableTeams
    if(state.data) 
    {
      const index = newAvailable.indexOf(state.data.teamId)
      console.log(index)
      newAvailable.splice(index, 1)
      console.log(newAvailable.length)
    }
      
    return {
      ...state, 
      pick : state.pick+1, 
      owners : owners(state.owners, action, state.pick),
      availableTeams :newAvailable }
  }
  case C.LOGOUT:
    return {
      mode : false,
    }
  default:
    return state
  }  
}

export const owners = (state = {}, action={ type: null }, pick) => {
  switch (action.type){
  case C.DRAFT_PICK:
  {
    if(action.data)
    {
      state[action.data.ownerId].push({pick:pick, team_id:action.data.teamId})
    }
    
    //action.draftOrder.map(order => owners.push(state.filter(owner => owner.user_id === order.id)[0]))
    return state
  }
  default:
    return state
  }  
}

