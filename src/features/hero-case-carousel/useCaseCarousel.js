import { useEffect, useRef, useState } from 'react'

const AUTO_ADVANCE_DELAY = 8000
const INTRO_ADVANCE_DELAYS = [700, 800, 800]

export function useCaseCarousel(count, initialIndex = 0, introReady = true) {
  const [position, setPosition] = useState(initialIndex)
  const [isDragging, setIsDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 599px)').matches)
  const [introStep, setIntroStep] = useState(0)
  const [isIntroComplete, setIsIntroComplete] = useState(false)
  const viewportRef = useRef(null)
  const dragRef = useRef(null)
  const suppressClickRef = useRef(false)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 599px)')
    const update = () => setIsMobile(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!introReady || isIntroComplete) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsIntroComplete(true)
      return undefined
    }

    let timeout
    const scheduleNext = () => {
      window.clearTimeout(timeout)
      if (document.visibilityState !== 'visible') return
      timeout = window.setTimeout(() => {
        setPosition((current) => Math.round(current) + 1)
        if (introStep === INTRO_ADVANCE_DELAYS.length - 1) {
          setIsIntroComplete(true)
        } else {
          setIntroStep(introStep + 1)
        }
      }, INTRO_ADVANCE_DELAYS[introStep])
    }

    document.addEventListener('visibilitychange', scheduleNext)
    scheduleNext()

    return () => {
      window.clearTimeout(timeout)
      document.removeEventListener('visibilitychange', scheduleNext)
    }
  }, [introReady, introStep, isIntroComplete])

  useEffect(() => {
    if (!introReady || !isIntroComplete || isDragging || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let timeout
    const scheduleNext = () => {
      window.clearTimeout(timeout)
      if (document.visibilityState !== 'visible') return
      timeout = window.setTimeout(() => {
        setPosition((current) => Math.round(current) + 1)
      }, AUTO_ADVANCE_DELAY)
    }

    document.addEventListener('visibilitychange', scheduleNext)
    scheduleNext()

    return () => {
      window.clearTimeout(timeout)
      document.removeEventListener('visibilitychange', scheduleNext)
    }
  }, [introReady, isIntroComplete, isDragging, position])

  const activeIndex = ((Math.round(position) % count) + count) % count

  function stopIntro() {
    setIsIntroComplete(true)
  }

  function onPointerDown(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    stopIntro()
    dragRef.current = { id: event.pointerId, startX: event.clientX, startPosition: position, moved: false }
    suppressClickRef.current = false
  }

  function onPointerMove(event) {
    const drag = dragRef.current
    if (!drag || event.pointerId !== drag.id) return
    const distance = event.clientX - drag.startX
    if (Math.abs(distance) > 8 && !drag.moved) {
      drag.moved = true
      setIsDragging(true)
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    if (!drag.moved) return
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
    window.setTimeout(() => { suppressClickRef.current = false }, 0)
  }

  function onKeyDown(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      stopIntro()
      setPosition((current) => Math.round(current) + (event.key === 'ArrowRight' ? 1 : -1))
    }
  }

  function selectCard(index) {
    stopIntro()
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }
    const normalized = ((index - activeIndex + count + Math.floor(count / 2)) % count) - Math.floor(count / 2)
    setPosition((current) => Math.round(current) + normalized)
  }

  function previous() {
    stopIntro()
    setPosition((current) => Math.round(current) - 1)
  }

  function next() {
    stopIntro()
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
