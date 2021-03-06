import { createStore, applyMiddleware  } from 'redux'
import reducers from './reducers/index'
import storage from 'localforage'
import {persistStore, persistReducer} from 'redux-persist'
import {loadSuccess} from '../actions/auth-actions'
import thunk from 'redux-thunk'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

const persistConfig = {
  key: 'root',
  storage: storage,
  blacklist: ['status'],
  stateReconciler: autoMergeLevel2
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

const middleware = () => [
  clientLogger,
  thunk
]


const persistedReducer = persistReducer(persistConfig, reducers)

export default (initialState) => {
  const store = applyMiddleware(...middleware())(createStore)(persistedReducer, initialState)

  setTimeout(() => {
    persistStore(store, null, () => {
      store.dispatch(loadSuccess())
    })

    persistStore(store)

  }, 10)

  return store
}