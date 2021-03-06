import C from '../constants'

export const showMobileNav = () => ({
  type: C.SHOW_MOBILE_NAV,
})

export const hideMobileNav = () => ({
  type: C.HIDE_MOBILE_NAV,
})

export const toggleMobileNav = (variant) => () => ({
  type: C.TOGGLE_MOBILE_NAV,
  payload: variant,
})

export const setMobileNavVariant = (variant) => ({
  type: C.SET_MOBILE_NAV_VARIANT,
  payload: variant,
})