import C from '../../constants'

export default (state = {loaded: false, showMobileNav: false}, action) => {
  switch (action.type) {
  case C.DATA_LOAD_SUCCESS:
    return {...state, loaded: true}
  case C.SHOW_MOBILE_NAV:
    return {...state, showMobileNav: true}
  case C.HIDE_MOBILE_NAV:
    return {...state, showMobileNav: false}
  case C.TOGGLE_MOBILE_NAV:
    return {...state, showMobileNav: !state.showMobileNav}
  default:
    return state
  }
}