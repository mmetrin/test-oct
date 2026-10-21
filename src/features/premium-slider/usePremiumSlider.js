import { useEffect, useRef, useState } from 'react'
import {
  sliderMiddleStart,
  sliderProgressDuration,
  sliderSnapDuration,
  sliderStep,
} from './sliderConfig'
import { getLoopedSliderOffset, getMiddleTrackSlide, getSlideFromOffset } from './sliderMath'

export function usePremiumSlider() {
  const [activeSlide, setActiveSlide] = useState(sliderMiddleStart)
  const [autoProgress, setAutoProgress] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isSnapping, setIsSnapping] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const animationFrameRef = useRef(null)
  const activeSlideRef = useRef(activeSlide)
  const autoProgressRef = useRef(autoProgress)
  const isHoveringRef = useRef(isHovering)
  const isDraggingRef = useRef(isDragging)
  const isSnappingRef = useRef(isSnapping)
  const dragOffsetRef = useRef(dragOffset)
  const dragStartRef = useRef({ x: 0, offset: 0 })
  const snapTimerRef = useRef(null)

  const updateActiveSlide = (nextSlide) => {
    activeSlideRef.current =
      typeof nextSlide === 'function' ? nextSlide(activeSlideRef.current) : nextSlide
    setActiveSlide(activeSlideRef.current)
  }

  const updateAutoProgress = (nextProgress) => {
    autoProgressRef.current = nextProgress
    setAutoProgress(nextProgress)
  }

  const updateIsHovering = (nextIsHovering) => {
    isHoveringRef.current = nextIsHovering
    setIsHovering(nextIsHovering)
  }

  const updateIsDragging = (nextIsDragging) => {
    isDraggingRef.current = nextIsDragging
    setIsDragging(nextIsDragging)
  }

  const updateIsSnapping = (nextIsSnapping) => {
    isSnappingRef.current = nextIsSnapping
    setIsSnapping(nextIsSnapping)
  }

  const updateDragOffset = (nextOffset) => {
    dragOffsetRef.current = nextOffset
    setDragOffset(nextOffset)
  }

  useEffect(() => {
    activeSlideRef.current = activeSlide
  }, [activeSlide])

  useEffect(() => {
    autoProgressRef.current = autoProgress
  }, [autoProgress])

  useEffect(() => {
    isHoveringRef.current = isHovering
  }, [isHovering])

  useEffect(() => {
    isDraggingRef.current = isDragging
  }, [isDragging])

  useEffect(() => {
    isSnappingRef.current = isSnapping
  }, [isSnapping])

  useEffect(() => {
    dragOffsetRef.current = dragOffset
  }, [dragOffset])

  useEffect(() => {
    let previousFrameTime = 0

    const tick = (timestamp) => {
      if (!previousFrameTime) {
        previousFrameTime = timestamp
      }

      const shouldAutoplay =
        !isHoveringRef.current && !isDraggingRef.current && !isSnappingRef.current
      const frameDelta = timestamp - previousFrameTime
      previousFrameTime = timestamp

      if (shouldAutoplay) {
        const nextProgress = autoProgressRef.current + frameDelta / sliderProgressDuration

        if (nextProgress >= 1) {
          updateAutoProgress(0)
          updateIsSnapping(true)
          updateActiveSlide((currentSlide) => currentSlide + 1)

          window.clearTimeout(snapTimerRef.current)
          snapTimerRef.current = window.setTimeout(() => {
            updateIsSnapping(false)
            updateActiveSlide((currentSlide) => getMiddleTrackSlide(currentSlide))
          }, sliderSnapDuration)
        } else {
          updateAutoProgress(nextProgress)
        }
      }

      animationFrameRef.current = window.requestAnimationFrame(tick)
    }

    animationFrameRef.current = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(animationFrameRef.current)
      window.clearTimeout(snapTimerRef.current)
    }
  }, [])

  const snapToMiddleCopy = () => {
    window.clearTimeout(snapTimerRef.current)
    snapTimerRef.current = window.setTimeout(() => {
      updateIsSnapping(false)
      updateActiveSlide((currentSlide) => getMiddleTrackSlide(currentSlide))
    }, sliderSnapDuration)
  }

  const handlePointerDown = (event) => {
    if (event.button !== 0) {
      return
    }

    const currentOffset = activeSlideRef.current * sliderStep

    event.currentTarget.setPointerCapture(event.pointerId)
    window.clearTimeout(snapTimerRef.current)
    updateIsSnapping(false)
    updateIsDragging(true)
    updateAutoProgress(0)
    updateDragOffset(currentOffset)
    dragStartRef.current = {
      x: event.clientX,
      offset: currentOffset,
    }
  }

  const handlePointerMove = (event) => {
    if (!isDraggingRef.current) {
      return
    }

    const rawOffset = dragStartRef.current.offset - (event.clientX - dragStartRef.current.x)
    const nextOffset = getLoopedSliderOffset(rawOffset)
    const nextSlide = getSlideFromOffset(nextOffset)

    dragStartRef.current.offset += nextOffset - rawOffset
    updateDragOffset(nextOffset)
    updateActiveSlide(nextSlide)
  }

  const handlePointerUp = (event) => {
    if (!isDraggingRef.current) {
      return
    }

    const nextSlide = getSlideFromOffset(dragOffsetRef.current)

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    updateIsDragging(false)
    updateIsSnapping(true)
    updateAutoProgress(0)
    updateActiveSlide(nextSlide)
    snapToMiddleCopy()
  }

  const trackOffset = isDragging
    ? dragOffset
    : activeSlide * sliderStep

  return {
    isDragging,
    isSnapping,
    trackOffset,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    setIsHovering: updateIsHovering,
  }
}
