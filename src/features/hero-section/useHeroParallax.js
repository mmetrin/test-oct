import { useEffect, useRef } from 'react'

export function useHeroParallax() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current

    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    let frameId = 0
    const updateParallax = () => {
      window.cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(() => {
        const { top, height } = section.getBoundingClientRect()
        const progress = Math.min(1, Math.max(0, -top / height))

        section.style.setProperty('--hero-parallax-progress', progress)
      })
    }

    updateParallax()
    window.addEventListener('scroll', updateParallax, { passive: true })
    window.addEventListener('resize', updateParallax)

    return () => {
      window.removeEventListener('scroll', updateParallax)
      window.removeEventListener('resize', updateParallax)
      window.cancelAnimationFrame(frameId)
    }
  }, [])

  return sectionRef
}
