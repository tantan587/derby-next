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
      room_id : action.room_id

    }
  case C.UPDATE_DRAFT_ORDER:
    return {...state, owners : owners(state.owners, action) }
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
    //let owners = []
    action.draftOrder.map((order,i) => state.filter(owner => owner.user_id === order.id)[0].draft_position = i)
    //action.draftOrder.map(order => owners.push(state.filter(owner => owner.user_id === order.id)[0]))
    return state
  }
  default:
    return state
  }  
}