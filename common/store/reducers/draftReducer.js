import C from '../../constants'

export default (state = {}, action={ type: null }) => {
  switch (action.type){
  case C.ENTERED_DRAFT:
    return {
      mode : action.mode,
      pick : action.pick,
      allTeams:action.allTeams,
      availableTeams: action.availableTeams,
      draftedTeams:action.draftedTeams,
      owners:action.owners,
      queue:action.queue,
      rules:action.rules,
      messages:action.messages,
      filterInfo:{},
      eligibleTeams:action.eligibleTeams,
      autoDraftOwnersMap:action.autoDraftOwnersMap
    }
  case C.UPDATE_DRAFT_MODE:
    return {
      ...state, mode : action.mode 
    }

  case C.UPDATE_DRAFT_QUEUE:
    return {
      ...state, queue : action.queue 
    }

  case C.FILTER_TAB:
    return {
      ...state, filterInfo : action.filterInfo 
    }

  case C.RECIEVED_DRAFT_MESSAGE:
    return {
      ...state, messages : state.messages.concat(action.message) 
    }

  case C.START_DRAFT:
  {
    const newOwners = {}
    Object.keys(state.owners).map(owner =>
      newOwners[owner] = []
    )
    return {
      ...state,
      availableTeams: [].concat(state.allTeams),
      draftedTeams:[],
      eligibleTeams:[].concat(state.allTeams),
      mode : 'live',
      pick : 0,
      owners: newOwners,
      messages:[]
    }
  }
  case C.TOGGLE_AUTO_DRAFT:
  {
    state.autoDraftOwnersMap[action.ownerId] = action.value
    return {...state, autoDraftOwnersMap:state.autoDraftOwnersMap}
  }

  case C.DRAFT_PICK_ROLLBACK:
  {
    const newAvailable = state.availableTeams
    const newDrafted = state.draftedTeams
    let eligibleTeams = state.eligibleTeams
    if(action.data) 
    {
      const index = newDrafted.indexOf(action.data.teamId)
      newDrafted.splice(index, 1)
      newAvailable.push(action.data.teamId)
      if(action.data.thisIsMe)
      {
        eligibleTeams = action.data.eligibleTeams
      }
    }    
    return {
      ...state, 
      pick : state.pick-1, 
      owners : owners(state.owners, action, state.pick),
      availableTeams :newAvailable,
      draftedTeams : newDrafted,
      eligibleTeams : eligibleTeams }
  }

  case C.DRAFT_PICK:
  {
    const newAvailable = state.availableTeams
    const newDrafted = state.draftedTeams
    let newQueue = state.queue
    let eligibleTeams = state.eligibleTeams
    if(action.data) 
    {
      const index = newAvailable.indexOf(action.data.teamId)
      newAvailable.splice(index, 1)
      newDrafted.push(action.data.teamId)
      if(action.data.thisIsMe)
      {
        newQueue = action.data.queue
        eligibleTeams = action.data.eligibleTeams
      }
    }    
    return {
      ...state, 
      pick : state.pick+1, 
      owners : owners(state.owners, action, state.pick),
      availableTeams :newAvailable,
      draftedTeams : newDrafted,
      queue : newQueue,
      eligibleTeams : eligibleTeams }
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
    return state
  }
  case C.DRAFT_PICK_ROLLBACK:
  {
    if(action.data)
    {
      state[action.data.ownerId].splice(-1,1)
    }
  
    return state
  }
  default:
    return state
  }  
}

