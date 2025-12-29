import Lenis from '@studio-freight/lenis'

let lenisInstance = null

export function initLenis() {
  if (!lenisInstance && typeof window !== 'undefined') {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      orientation: 'vertical',
      gestureOrientation: 'vertical'
    })

    const loop = (time) => {
      lenisInstance.raf(time)
      requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)
  }
  return lenisInstance
}

export function getLenis() {
  return lenisInstance
}

// Subscribe to scroll updates. Returns an unsubscribe function.
export function subscribeToScroll(handler) {
  // handler receives a single numeric argument: scrollY
  const lenis = getLenis()
  if (lenis && typeof lenis.on === 'function') {
    const cb = (e) => {
      try {
        handler(typeof e === 'object' && e !== null && 'scroll' in e ? e.scroll : window.scrollY)
      } catch (err) {
        // noop
      }
    }
    lenis.on('scroll', cb)
    return () => {
      try { lenis.off('scroll', cb) } catch (e) { /* noop */ }
    }
  }

  // Fallback to native scroll
  const wrapped = () => handler(window.scrollY)
  window.addEventListener('scroll', wrapped, { passive: true })
  return () => window.removeEventListener('scroll', wrapped)
}

export function scrollToTop(options = {}) {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(0, options)
  } else {
    window.scrollTo(0, 0)
  }
}

export default { initLenis, getLenis, scrollToTop }
