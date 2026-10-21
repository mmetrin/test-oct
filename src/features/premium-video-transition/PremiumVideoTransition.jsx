import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { PremiumSliderSection } from '../premium-slider'
import { VideoFormatsSurface } from '../video-formats-surface'

gsap.registerPlugin(ScrollTrigger)

const SURFACE_RELEASE_DISTANCE = 220

export function PremiumVideoTransition() {
  const transitionRef = useRef(null)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const transition = transitionRef.current
    const slider = transition?.querySelector('.slider-section')

    if (!transition || !slider) {
      return undefined
    }

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: transition,
        start: 'top top',
        end: () => `+=${window.innerHeight + SURFACE_RELEASE_DISTANCE}`,
        pin: slider,
        pinSpacing: false,
        invalidateOnRefresh: true,
      })
    }, transition)

    return () => context.revert()
  }, [])

  return (
    <div className="premium-video-transition" ref={transitionRef}>
      <PremiumSliderSection />
      <VideoFormatsSurface />
    </div>
  )
}
