import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

// Keep one indicator and glide it between tabs, including when clicks arrive mid-flight.
export function useRubberIndicator(trackRef, indicatorRef, value, enabled) {
  const positionRef = useRef(null)
  const tweenRef = useRef(null)
  const previousValueRef = useRef(value)

  useLayoutEffect(() => {
    if (!enabled) return undefined
    const track = trackRef.current
    const indicator = indicatorRef.current
    if (!track || !indicator) return undefined
    let mounted = true

    const update = (animate) => {
      const active = track.querySelector('[aria-selected="true"]')
      if (!active) return
      const target = { left: active.offsetLeft, width: active.offsetWidth }
      const position = positionRef.current
      tweenRef.current?.kill()
      indicator.style.top = `${active.offsetTop}px`
      indicator.style.height = `${active.offsetHeight}px`
      const draw = () => {
        indicator.style.left = `${positionRef.current.left}px`
        indicator.style.width = `${positionRef.current.width}px`
      }
      if (!animate || !position || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        positionRef.current = target
        draw()
        return
      }
      tweenRef.current = gsap.to(position, {
        ...target,
        duration: 0.52,
        ease: 'power3.out',
        onUpdate: draw,
      })
    }

    update(previousValueRef.current !== value)
    previousValueRef.current = value
    // ResizeObserver's initial notification must not cancel a fresh transition.
    let width = track.offsetWidth
    const observer = new ResizeObserver(() => {
      if (track.offsetWidth !== width) {
        width = track.offsetWidth
        update(false)
      }
    })
    observer.observe(track)
    const fontsLoaded = () => { if (mounted) update(false) }
    if (document.fonts.status !== 'loaded') document.fonts.ready.then(fontsLoaded)
    return () => {
      mounted = false
      observer.disconnect()
      tweenRef.current?.kill()
    }
  }, [enabled, value, trackRef, indicatorRef])
}
