import { useEffect, useRef, useState } from 'react'

const AUTO_ADVANCE_DELAYS = [3600, 4700, 3200, 5200, 4000]

export function useCaseCarousel(count) {
  const [position, setPosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 599px)').matches)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const viewportRef = useRef(null)
  const dragRef = useRef(null)
  const suppressClickRef = useRef(false)
  const autoAdvanceIndexRef = useRef(0)
  const hasUserInteractedRef = useRef(false)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 599px)')
    const update = () => setIsMobile(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (hasUserInteracted || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let timeout
    const scheduleNext = () => {
      const delay = AUTO_ADVANCE_DELAYS[autoAdvanceIndexRef.current % AUTO_ADVANCE_DELAYS.length]
      timeout = window.setTimeout(() => {
        if (!hasUserInteractedRef.current && document.visibilityState === 'visible') {
          autoAdvanceIndexRef.current += 1
          setPosition((current) => Math.round(current) + 1)
        }
        if (!hasUserInteractedRef.current) scheduleNext()
      }, delay)
    }

    scheduleNext()

    return () => window.clearTimeout(timeout)
  }, [hasUserInteracted])

  const activeIndex = ((Math.round(position) % count) + count) % count

  function markUserInteraction() {
    hasUserInteractedRef.current = true
    setHasUserInteracted(true)
  }

  function onPointerDown(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    markUserInteraction()
    dragRef.current = { id: event.pointerId, startX: event.clientX, startPosition: position, moved: false }
    suppressClickRef.current = false
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event) {
    const drag = dragRef.current
    if (!drag || event.pointerId !== drag.id) return
    const distance = event.clientX - drag.startX
    if (Math.abs(distance) > 8) drag.moved = true
    const pixelsPerCard = isMobile ? 150 : 205
    setPosition(drag.startPosition - distance / pixelsPerCard)
  }

  function endDrag(event) {
    const drag = dragRef.current
    if (!drag || event.pointerId !== drag.id) return
    const distance = event.clientX - drag.startX
    suppressClickRef.current = drag.moved
    const pixelsPerCard = isMobile ? 150 : 205
    const next = Math.abs(distance) < 16
      ? Math.round(drag.startPosition)
      : Math.round(drag.startPosition - distance / pixelsPerCard)
    setPosition(next)
    setIsDragging(false)
    dragRef.current = null
  }

  function onKeyDown(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      markUserInteraction()
      setPosition((current) => Math.round(current) + (event.key === 'ArrowRight' ? 1 : -1))
    }
  }

  function selectCard(index) {
    markUserInteraction()
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }
    const normalized = ((index - activeIndex + count + Math.floor(count / 2)) % count) - Math.floor(count / 2)
    setPosition((current) => Math.round(current) + normalized)
  }

  function previous() {
    markUserInteraction()
    setPosition((current) => Math.round(current) - 1)
  }

  function next() {
    markUserInteraction()
    setPosition((current) => Math.round(current) + 1)
  }

  return {
    activeIndex,
    isDragging,
    isMobile,
    next,
    onKeyDown,
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    previous,
    onPointerCancel: endDrag,
    position,
    selectCard,
    setPosition,
    viewportRef,
  }
}
