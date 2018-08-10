const R = require('ramda')
import C from '../../constants'

const INDEX_KEY = 'invite_id'

const dataReducer = (state=initialState.data, action) => {
  const indexById = R.indexBy(R.prop(INDEX_KEY))
  switch(action.type) {
    case C.GET_INVITES_SUCCESS:
      return R.merge(state, indexById(action.payload))
    case C.CREATE_INVITE_SUCCESS:
    case C.SEND_INVITE_SUCCESS:
      return R.merge(state, indexById([action.payload]))
    case C.DELETE_INVITE_SUCCESS:
      return R.dissoc(action.payload)
  }
}

const initialState = {
  data: {},
  isLoading: false,
  error: null,
}

export default (state=initialState, action) => {
  switch(action.type) {
    case C.GET_INVITES:
    case C.CREATE_INVITE:
    case C.SEND_INVITE:
    case C.DELETE_INVITE:
      return {...state, isLoading: true}

    case C.GET_INVITES_SUCCESS:
    case C.CREATE_INVITE_SUCCESS:
    case C.SEND_INVITE_SUCCESS:
    case C.DELETE_INVITE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: dataReducer(state.data, action),
      }

    case C.GET_INVITES_FAIL:
    case C.CREATE_INVITE_FAIL:
    case C.SEND_INVITE_FAIL:
    case C.DELETE_INVITE_FAIL:
      return {...state, isLoading: false, error: action.error}
      
    default: return state
  }
}