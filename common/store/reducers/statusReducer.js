import C from '../../constants'

export default (state = {loaded: false, showMobileNav: false}, action) => {
  switch (action.type) {
  case C.DATA_LOAD_SUCCESS:
    return {...state, loaded: true}
  case C.SHOW_MOBILE_NAV:
    return {...state, showMobileNav: true, variant: action.payload}
  case C.HIDE_MOBILE_NAV:
    return {...state, showMobileNav: false}
  case C.TOGGLE_MOBILE_NAV:
    return {...state, showMobileNav: !state.showMobileNav, variant: action.payload}
  case C.SET_MOBILE_NAV_VARIANT:
    return {...state, variant: action.payload}
  default:
    return state
  }
}