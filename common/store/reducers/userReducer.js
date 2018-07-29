import C from '../../constants'
import ErrorText from '../../models/ErrorText'

export default (state = {}, action={ type: null }) => {
  switch(action.type)
  {
  case C.LOGIN_SUCCESS:
    return {
      ...state,
      id: action.id,
      first_name: action.first_name,
      last_name: action.last_name,
      username: action.username,
      loggedIn: true,
      progress:null,
      error: new ErrorText()
    }
  case C.SIGNUP_SUCCESS:
    return {
      ...state,
      id: action.id,
      first_name: action.first_name,
      last_name: action.last_name,
      username: action.username,
      error: new ErrorText()
    }
  case C.SIGNUP_FAIL:
  case C.LOGIN_FAIL:
  case C.FORGOT_PASSWORD_FAIL:
  case C.FORGOT_USERNAME_FAIL:
  case C.CREATE_PASSWORD_FAIL:
    return {
      id: '',
      first_name: '',
      last_name: '',
      username: '',
      loggedIn: false,
      error: action.error
    }
  case C.PRESSED_LOGIN:
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
  case C.SAVE_OWNER_SETTINGS_FAIL:
    return {
      ...state,
      error : action.error
    }
  
  case C.UPDATE_ERROR:
  {
    let errorText = new ErrorText()
    errorText.addError(action.name,action.error)
    return {
      ...state,
      error : errorText
    }
  }  

  case C.CREATE_LEAGUE_SUCCESS:
  case C.JOIN_LEAGUE_SUCCESS:
  case C.FORGOT_PASSWORD_SUCCESS:
  case C.FORGOT_USERNAME_SUCCESS:
  case C.SAVE_OWNER_SETTINGS_SUCCESS:
  {
    let errorText = new ErrorText()
    errorText.addError('success',true)
    return {
      ...state,
      error : errorText
    }
  }

  case C.MAKE_PROGRESS:
  {
    return {...state, progress:action.progress}
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
