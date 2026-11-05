import { useEffect, useRef, useState } from 'react'

export function useEcosystemMotion() {
  const container = useRef(null)
  const pointer = useRef({ x: 0, y: 0 })
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(true)
  const [inView, setInView] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => { setReducedMotion(query.matches); pointer.current = { x: 0, y: 0 } }
    const updateVisibility = () => setVisible(!document.hidden)
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 })
    observer.observe(container.current)
    query.addEventListener('change', updateMotion)
    document.addEventListener('visibilitychange', updateVisibility)
    updateVisibility()
    return () => {
      observer.disconnect()
      query.removeEventListener('change', updateMotion)
      document.removeEventListener('visibilitychange', updateVisibility)
    }
  }, [])
  return {
    container, pointer, paused, setPaused, reducedMotion,
    active: visible && inView,
    running: !paused && !reducedMotion && visible && inView,
    onPointerMove: (event) => {
      if (event.pointerType !== 'mouse' || reducedMotion || paused) return
      const rect = event.currentTarget.getBoundingClientRect()
      pointer.current = { x: (event.clientX - rect.left) / rect.width * 2 - 1, y: (event.clientY - rect.top) / rect.height * 2 - 1 }
    },
    onPointerLeave: () => { pointer.current = { x: 0, y: 0 } },
  }
}
