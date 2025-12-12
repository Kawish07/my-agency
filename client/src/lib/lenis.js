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

export function scrollToTop(options = {}) {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(0, options)
  } else {
    window.scrollTo(0, 0)
  }
}

export default { initLenis, getLenis, scrollToTop }
