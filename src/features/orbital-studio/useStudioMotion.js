import { useEffect, useRef, useState } from 'react'

export function useStudioMotion() {
  const container = useRef(null)
  const pointer = useRef({ x: 0, y: 0 })
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(!document.hidden)
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => {
      setReducedMotion(preference.matches)
      pointer.current = { x: 0, y: 0 }
    }
    let inView = true
    const updateVisibility = () => setVisible(inView && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      updateVisibility()
    }, { threshold: 0.01 })
    observer.observe(container.current)
    preference.addEventListener('change', updatePreference)
    document.addEventListener('visibilitychange', updateVisibility)
    return () => {
      observer.disconnect()
      preference.removeEventListener('change', updatePreference)
      document.removeEventListener('visibilitychange', updateVisibility)
    }
  }, [])

  const onPointerMove = (event) => {
    if (reducedMotion || paused || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    pointer.current.x = (event.clientX - rect.left) / rect.width * 2 - 1
    pointer.current.y = (event.clientY - rect.top) / rect.height * 2 - 1
  }
  const onPointerLeave = () => { pointer.current = { x: 0, y: 0 } }

  return { container, pointer, paused, setPaused, reducedMotion, running: visible && !paused && !reducedMotion, onPointerMove, onPointerLeave }
}
