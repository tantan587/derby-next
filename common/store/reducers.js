import C from '../constants'
import ErrorText from '../models/ErrorText'


export const user = (state = {}, action={ type: null }) => {
  switch(action.type)
  {
  case C.LOGIN_SUCCESS:
  case C.SIGNUP_SUCCESS:
    return {
      id: action.id,
      first_name: action.first_name,
      last_name: action.last_name,
      username: action.username,
      loggedIn: true,
      error: new ErrorText()
    }
  case C.SIGNUP_FAIL:
  case C.LOGIN_FAIL:
  case C.FORGOT_PASSWORD_FAIL:
  case C.CREATE_PASSWORD_FAIL:
    return {
      id: '',
      first_name: '',
      last_name: '',
      username: '',
      loggedIn: false,
      error: action.error
    }
  case C.LOGOUT:
    return {
      id: '',
      first_name: '',
      last_name: '',
      username: '',
      loggedIn: false,
      error: new ErrorText()
    
    }
  case C.CREATE_LEAGUE_FAIL:
  case C.JOIN_LEAGUE_FAIL:
    return {
      ...state,
      error : action.error
    }

  case C.CREATE_LEAGUE_SUCCESS:
  case C.JOIN_LEAGUE_SUCCESS:
  case C.FORGOT_PASSWORD_SUCCESS:
  {
    let errorText = new ErrorText()
    errorText.addError('success',true)
    return {
      ...state,
      error : errorText
    }
  }

  case C.CREATE_PASSWORD_SUCCESS:
  {
    let errorText = new ErrorText()
    errorText.addError('success1',true)
    return {
      ...state,
      error : errorText
    }
  }
  default :
    return state    
  }

  
}

export const leagues = (state = [], action={ type: null }) => {
  switch (action.type){
  case C.CREATE_LEAGUE_SUCCESS:
  case C.JOIN_LEAGUE_SUCCESS:
    return [
      ...state,
      simpleLeague(action)
    ]
  case C.LOGIN_SUCCESS:
    return action.leagues
  case C.LOGOUT:
    return []
  default :
    return state
  }
}

export const simpleLeague = (action) => {
  return {
    league_id : action.league_id,
    league_name : action.league_name
  }
}

export const activeLeague = (state = {}, action={ type: null }) => {
  switch (action.type){
  case C.CLICKED_LEAGUE:
    return {
      success : true,
      league_id : action.league_id,
      league_name : action.league_name,
      total_players : action.owners.length,
      max_owners : action.max_owners,
      owners : action.owners
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
    action.draftOrder.map((order,i) => state.filter(owner => owner.user_id === order.id)[0].draft_positon = i)
    //action.draftOrder.map(order => owners.push(state.filter(owner => owner.user_id === order.id)[0]))
    return state
  }
  default:
    return state
  }  
}

export const teams = (state = [], action={ type: null }) => {
  switch (action.type){
  case C.GET_TEAMS:
    return action.teams
  case C.LOGOUT:
    return []
  default:
    return state
  }  
}

export const sportLeagues = (state = [], action={ type: null }) => {
  switch (action.type){
  case C.GET_TEAMS:
    return calculateCheckboxes(action.teams, 'sport')
  case C.LOGOUT:
    return []
  default:
    return state
  }  
}

const calculateCheckboxes = (rows, checkboxColumn) =>
{
  const uniqueRows = []
  rows.map(row => {
    if(!uniqueRows.includes(row[checkboxColumn]))
      uniqueRows.push(row[checkboxColumn])
  })
  return uniqueRows
}