import { createStore } from 'redux'
import reducers from './reducers/index'

export default (initialState) => {
  return createStore(reducers, initialState)
}