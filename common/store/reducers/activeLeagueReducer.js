import C from '../../constants'



export default (state = {}, action={ type: null }) => {
  switch (action.type){
  case C.CLICKED_LEAGUE:
  case C.CREATE_LEAGUE_SUCCESS:
  case C.JOIN_LEAGUE_SUCCESS:
  case C.UPDATE_LEAGUE_SUCCESS:
    return {
      success : true,
      league_id : action.league_id,
      league_name : action.league_name,
      total_players : action.owners.length,
      total_teams : action.total_teams,
      max_owners : action.max_owners,
      owners : action.owners,
      draftInfo : action.draftInfo,
      room_id : action.room_id,
      my_owner_id:action.my_owner_id,
      draftOrder:action.draftOrder,
      teams:action.teams,
      ownerGames:action.ownerGames,
      rules:action.rules,
      imTheCommish:action.imTheCommish,
      seasons:action.seasons,
      total_eligible_teams:action.total_eligible_teams,
      error : {}
    }

  case C.UPDATE_DRAFT_ORDER:
    return {...state, owners : owners(state.owners, action) }

  case C.SAVE_OWNER_SETTINGS_SUCCESS:
    return {...state,  owners: owners(state, action) } 
  case C.LOGOUT:
    return {
      success : false,
    }
  default:
    return state
  }  
}

export const owners = (state = [], action={ type: null }) => {
  switch (action.type){
  case C.UPDATE_DRAFT_ORDER:
  {
    //console.log(action.draftOrder, state)
    action.draftOrder.map((order,i) => state.find(owner => owner.owner_id === order).draft_position = i)
    return state
  }
  case C.SAVE_OWNER_SETTINGS_SUCCESS:
  {
    let myOwner = state.owners.filter(owner => owner.owner_id === action.owner_id)[0]
    myOwner.avatar = action.avatar
    myOwner.owner_name = action.owner_name
    return state.owners
  }
  default:
    return state
  }  
}