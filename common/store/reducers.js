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
  {
    let errorText = new ErrorText();
    errorText.addError('success',true)
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