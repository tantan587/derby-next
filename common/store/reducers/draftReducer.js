import C from '../../constants'

export default (state = {}, action={ type: null }) => {
  switch (action.type){
  case C.ENTERED_DRAFT:
    return {
      mode : action.mode,
      pick : action.pick,
      availableTeams: action.availableTeams,
      draftedTeams:action.draftedTeams,
      owners:action.owners,
      queue:action.queue
    }
  case C.UPDATE_DRAFT_MODE:
    return {
      ...state, mode : action.mode 
    }

  case C.UPDATE_DRAFT_QUEUE:
    return {
      ...state, queue : action.queue 
    }

  case C.START_DRAFT:
  {
    const newOwners = {}
    Object.keys(state.owners).map(owner =>
      newOwners[owner] = []
    )
    return {
      ...state,
      availableTeams: state.availableTeams.concat(state.draftedTeams),
      draftedTeams:[],
      mode : 'live',
      pick : 0,
      owners: newOwners
    }
  }
  case C.DRAFT_PICK:
  {
    const newAvailable = state.availableTeams
    const newDrafted = state.draftedTeams
    if(action.data) 
    {
      const index = newAvailable.indexOf(action.data.teamId)
      newAvailable.splice(index, 1)
      newDrafted.push(action.data.teamId)
    }    
    return {
      ...state, 
      pick : state.pick+1, 
      owners : owners(state.owners, action, state.pick),
      availableTeams :newAvailable,
      draftedTeams : newDrafted }
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
      state[action.data.ownerId].push({pick:pick, teamId:action.data.teamId})
    }
    
    //action.draftOrder.map(order => owners.push(state.filter(owner => owner.user_id === order.id)[0]))
    return state
  }
  default:
    return state
  }  
}

