export function isMobile() {
  return typeof window !== 'undefined' && window.innerWidth <= 800 ?  true : false
}