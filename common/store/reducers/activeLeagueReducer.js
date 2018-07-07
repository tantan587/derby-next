import C from '../../constants'



export default (state = {}, action={ type: null }) => {
  switch (action.type){
  case C.CLICKED_LEAGUE:
    return {
      success : true,
      league_id : action.league_id,
      league_name : action.league_name,
      total_players : action.owners.length,
      total_teams : action.total_teams,
      max_owners : action.max_owners,
      owners : action.owners,
      draft_start_time : action.draft_start_time,
      room_id : action.room_id,
      my_owner_id:action.my_owner_id,
      draftOrder:action.draftOrder,
      teams:action.teams,
      ownerGames:action.ownerGames,
      rules:action.rules,
      error : {}
    }

  case C.UPDATE_DRAFT_ORDER:
    return {...state, owners : owners(state.owners, action) }

  case C.SAVE_OWNER_SETTINGS_FAIL:
    return {...state, error : action.error } 
  case C.SAVE_OWNER_SETTINGS_SUCCESS:
    return {...state, error : {}, owners: owners(state, action) } 
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
    action.draftOrder.map((order,i) => state.filter(owner => owner.user_id === order.id)[0].draft_position = i)
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