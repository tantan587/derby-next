import C from '../../constants'

export default (state = {loaded: false}, action) => {
  switch (action.type) {
  case C.DATA_LOAD_SUCCESS:
    return {loaded: true}

  default:
    return state
  }
}