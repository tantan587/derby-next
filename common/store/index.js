import createStoreFromServer from './serverStore'
import createStoreFromClient from './clientStore'
import ErrorText from '../models/ErrorText'

const _initialState = {
  user: { loggedIn : false, error : new ErrorText()},
  leagues : []
}

export default (initialState = _initialState, props) => {
  if(typeof document === 'undefined') {
    return createStoreFromServer(initialState)
  } else {
    return createStoreFromClient(initialState, props)
  }
}