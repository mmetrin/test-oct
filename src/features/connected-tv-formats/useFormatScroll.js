import { useLayoutEffect, useState } from 'react'

const clamp = (value) => Math.min(1, Math.max(0, value))
const smooth = (value) => {
  const t = clamp(value)
  return t * t * (3 - 2 * t)
}

export function useFormatScroll(sectionRef) {
  const [activeFormat, setActiveFormat] = useState(0)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const panels = [...section.querySelectorAll('[data-format-panel]')]
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let current = 0
    let start = 0
    let travel = 1
    let lastProgress = -1
    let disposed = false

    const update = () => {
      frame = 0
      const progress = clamp((window.scrollY - start) / travel)
      if (progress === lastProgress) return
      lastProgress = progress
      const first = smooth((progress - 0.12) / 0.24)
      const second = smooth((progress - 0.56) / 0.24)
      const weights = [1 - first, first * (1 - second), second]
      const next = weights.indexOf(Math.max(...weights))
      panels.forEach((panel, index) => {
        const incoming = index === 0 ? 1 : index === 1 ? first : second
        const outgoing = index === 0 ? first : index === 1 ? second : 0
        const opacity = String(weights[index])
        if (panel.style.opacity === opacity) return
        panel.style.opacity = opacity
        panel.style.visibility = weights[index] === 0 ? 'hidden' : 'visible'
        panel.style.transform = preference.matches ? 'none'
          : `translate3d(0, ${(1 - incoming) * 45 - outgoing * 30}px, 0)`
      })
      if (next !== current) {
        current = next
        panels.forEach((panel, index) => panel.setAttribute('aria-hidden', String(index !== next)))
        setActiveFormat(next)
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    // Layout dimensions are measured only when the layout changes, never per frame.
    const measure = () => {
      if (disposed) return
      const bounds = section.getBoundingClientRect()
      const scale = bounds.width / 1440
      const stageHeight = (window.innerHeight - 110) / scale
      start = bounds.top + window.scrollY - 90
      travel = window.innerHeight * 1.8
      section.style.setProperty('--format-sticky-top', `${90 / scale}px`)
      section.style.setProperty('--format-stage-height', `${stageHeight}px`)
      section.style.setProperty('--format-scroll-height', `${stageHeight + travel / scale}px`)
      section.style.setProperty('--format-scene-scale', String(Math.min(1, Math.max(0.2, (stageHeight - 90) / 650))))
      lastProgress = -1
      schedule()
    }
    const observer = new ResizeObserver(measure)
    observer.observe(section)
    observer.observe(section.parentElement)
    panels.forEach((panel, index) => panel.setAttribute('aria-hidden', String(index !== 0)))
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure)
    preference.addEventListener('change', measure)
    document.fonts?.ready.then(measure)
    measure()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
      preference.removeEventListener('change', measure)
    }
  }, [sectionRef])

  return activeFormat
}
