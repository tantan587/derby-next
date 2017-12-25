export function isMobile() {
  if(typeof window !== 'undefined' && window.innerWidth <= 800) {
    return true
  } else {
    return false
  }
}