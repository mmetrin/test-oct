import { useEffect, useRef, useState } from 'react'

export function useCoreMotion() {
  const container = useRef(null)
  const pointer = useRef({ x: 0, y: 0 })
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(() => !document.hidden)
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [compact, setCompact] = useState(() => matchMedia('(max-width: 800px)').matches)
  const [desktop, setDesktop] = useState(() => matchMedia('(min-width: 1151px)').matches)

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const size = matchMedia('(max-width: 800px)')
    const wide = matchMedia('(min-width: 1151px)')
    const updateMotion = () => { setReduced(motion.matches); pointer.current = { x: 0, y: 0 } }
    const updateSize = () => setCompact(size.matches)
    const updateDesktop = () => setDesktop(wide.matches)
    let inView = true
    const updateVisibility = () => setVisible(inView && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; updateVisibility() }, { threshold: 0.01 })
    observer.observe(container.current)
    motion.addEventListener('change', updateMotion)
    size.addEventListener('change', updateSize)
    wide.addEventListener('change', updateDesktop)
    document.addEventListener('visibilitychange', updateVisibility)
    return () => {
      observer.disconnect()
      motion.removeEventListener('change', updateMotion)
      size.removeEventListener('change', updateSize)
      wide.removeEventListener('change', updateDesktop)
      document.removeEventListener('visibilitychange', updateVisibility)
    }
  }, [])

  const onPointerMove = (event) => {
    if (reduced || paused || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width * 2 - 1
    const y = (event.clientY - rect.top) / rect.height * 2 - 1
    pointer.current.x = desktop ? Math.max(-1, Math.min(1, x)) : x
    pointer.current.y = desktop ? Math.max(-1, Math.min(1, y)) : y
  }
  const onPointerLeave = () => { pointer.current = { x: 0, y: 0 } }

  return { container, pointer, paused, setPaused, reduced, compact, desktop, visible, running: visible && !paused && !reduced, onPointerMove, onPointerLeave }
}
