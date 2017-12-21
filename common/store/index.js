import { createStore, combineReducers, applyMiddleware } from 'redux'
import {  user} from './reducers'
import thunk from 'redux-thunk'

const initialState = {
  user: { loggedIn : false}
}

const clientLogger = store => next => action => {
  if (action.type) {
    let result
    console.groupCollapsed('dispatching', action.type)
    console.log('prev state', store.getState())
    console.log('action', action)
    result = next(action)
    console.log('next state', store.getState())
    console.groupEnd()
    return result
  } else {
    return next(action)
  }
}

const serverLogger = store => next => action => {
    console.log('\n  dispatching server action\n')
    console.log(action)
    console.log('\n')
    //console.log('next state', store.getState())
    return next(action)
}

const middleware = server => [
    (server) ? serverLogger : clientLogger,
    thunk
]

const storeFactory = (server = false, injectedState = initialState) =>
    {
        return applyMiddleware(...middleware(server))(createStore)(
        combineReducers({user}),
        injectedState
        )
    }

export default storeFactory