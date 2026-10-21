import { useEffect, useRef, useState } from 'react'
import { useRevealOnVisible } from '../../shared/lib/useRevealOnVisible'
import { formatStateFrames, formatStateTransitions } from './formatSliderData'

export function useFormatSlider() {
  const [activeState, setActiveState] = useState(0)
  const [activeTransitionIndex, setActiveTransitionIndex] = useState(0)
  const [selectedTabOverride, setSelectedTabOverride] = useState(null)
  const [restartToken, setRestartToken] = useState(0)
  const [contentTransitionDuration, setContentTransitionDuration] = useState(0)
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false)
  const { elementRef, isVisible } = useRevealOnVisible()
  const currentTransition = formatStateTransitions[activeTransitionIndex]
  const isAutoplayPausedRef = useRef(false)
  const remainingTransitionMsRef = useRef(null)

  useEffect(() => {
    if (!isVisible) {
      return undefined
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      const firstCompleteState = formatStateFrames.findIndex(
        (stateFrame) => stateFrame.activeWidth !== 1,
      )

      setActiveState(firstCompleteState === -1 ? 0 : firstCompleteState)
      return undefined
    }

    if (!currentTransition) {
      return undefined
    }

    if (isAutoplayPaused) {
      return undefined
    }

    const transitionDuration =
      remainingTransitionMsRef.current ?? currentTransition.delay + currentTransition.duration
    const transitionStartedAt = window.performance.now()

    const stateTimer = window.setTimeout(() => {
      remainingTransitionMsRef.current = null
      const currentFormat = formatStateFrames[activeState].tab
      const nextFormat = formatStateFrames[currentTransition.nextState].tab

      setContentTransitionDuration(
        currentFormat === nextFormat ? 0 : 850,
      )
      setSelectedTabOverride(null)
      setActiveState(currentTransition.nextState)
    }, transitionDuration)
    const transitionTimer = window.setTimeout(() => {
      remainingTransitionMsRef.current = null
      setActiveTransitionIndex((transitionIndex) =>
        currentTransition.nextState === 0 ? 0 : transitionIndex + 1,
      )
    }, transitionDuration)

    return () => {
      window.clearTimeout(stateTimer)
      window.clearTimeout(transitionTimer)

      if (isAutoplayPausedRef.current) {
        const elapsedMs = window.performance.now() - transitionStartedAt
        remainingTransitionMsRef.current = Math.max(0, transitionDuration - elapsedMs)
      }
    }
  }, [activeState, currentTransition, isAutoplayPaused, isVisible, restartToken])

  const selectedTab =
    selectedTabOverride ?? formatStateFrames[activeState].tab

  function handleTabSelect(tabId) {
    remainingTransitionMsRef.current = null
    setSelectedTabOverride(tabId)

    const startState = formatStateFrames.findIndex(
      (stateFrame) => stateFrame.tab === tabId && stateFrame.activeWidth === 1,
    )

    if (startState !== -1) {
      setActiveState(startState)
      setActiveTransitionIndex(startState)
      setContentTransitionDuration(980)
      setRestartToken((token) => token + 1)
    }
  }

  function pauseAutoplay() {
    isAutoplayPausedRef.current = true
    setIsAutoplayPaused(true)
  }

  function resumeAutoplay() {
    isAutoplayPausedRef.current = false
    setIsAutoplayPaused(false)
  }

  return {
    activeState,
    contentTransitionDuration,
    currentTransition,
    handleTabSelect,
    isAutoplayPaused,
    pauseAutoplay,
    resumeAutoplay,
    sectionRef: elementRef,
    selectedTab,
  }
}
