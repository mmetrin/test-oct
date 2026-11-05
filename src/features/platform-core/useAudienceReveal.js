import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { createStableIdMotion, createSmartTargetMotion } from './audienceTechnologyMotion'

export function useAudienceReveal(sectionRef, ambientMotionRef) {
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || !('IntersectionObserver' in window)) return undefined

    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      ambientMotionRef.current = false
      section.dataset.audienceRevealed = 'false'
      const select = gsap.utils.selector(section)
      const intro = select('.platform-audience__intro')
      const data = select('.platform-audience__data')
      const stable = select('[data-audience-stage="stable"]')
      const smart = select('[data-audience-stage="smart"]')
      const launch = select('.platform-audience__launch')
      const launchTitle = select('.platform-audience__launch h3')
      const channels = select('.platform-audience__channels')
      const optimization = select('.platform-audience__optimization')
      const lineee = select('.platform-audience__lineee')
      const lineeeMarker = select('.platform-audience__lineee-marker')
      const lineeeStroke = select('.platform-audience__lineee > img')
      const result = select('.platform-audience__result')
      const marker = select('.platform-audience__line-marker')
      const arrow = select('.platform-audience__arrow-trace')
      const trace = (name) => select(`.platform-audience__${name}-line .platform-audience__line-trace`)
      const zones = [...intro, ...data, ...stable, ...smart, ...channels, ...optimization, ...result]

      gsap.set(zones, { autoAlpha: 0, y: 6 })
      gsap.set(launchTitle, { autoAlpha: 0 })
      gsap.set(lineeeMarker, { autoAlpha: 0 })
      gsap.set(lineeeStroke, { scaleX: 0, transformOrigin: 'left center' })
      select('.platform-audience__line-trace, .platform-audience__arrow-trace').forEach((path) => {
        // Use measured SVG distances so the tip follows every straight and curved segment.
        const length = path.getTotalLength()
        gsap.set(path, { strokeDasharray: `${length} ${length}`, strokeDashoffset: length, opacity: 0, autoRound: false })
      })
      gsap.set(marker, { opacity: 0 })

      const reveal = { autoAlpha: 1, y: 0, duration: 1.1, ease: 'sine.inOut' }
      const line = { strokeDashoffset: 0, ease: 'sine.inOut', autoRound: false }
      const loop = trace('loop')[0]
      const loopLength = loop.getTotalLength()
      const loopEndX = loop.getPointAtLength(loopLength).x
      const loopBounds = loop.ownerSVGElement.getBoundingClientRect()
      const loopWidth = loop.ownerSVGElement.viewBox.baseVal.width
      const loopDuration = 3.6
      const launchAnimation = gsap.timeline({ paused: true })
        .set(loop, { opacity: 1 })
        .to(loop, { ...line, duration: loopDuration })

      channels.forEach((channel) => {
        // Reveal the exported Figma group as the bottom connector reaches it.
        const bounds = channel.getBoundingClientRect()
        const x = (bounds.left + bounds.width / 2 - loopBounds.left) * loopWidth / loopBounds.width
        const progress = gsap.utils.clamp(0, 1, 1 - (x - loopEndX) / loopLength)
        const arrivalTime = Math.acos(1 - 2 * progress) / Math.PI * loopDuration
        launchAnimation.to(channel, { ...reveal, duration: 0.85 }, arrivalTime)
      })
      launchAnimation.to(launchTitle, { autoAlpha: 1, duration: 1.1, ease: 'sine.inOut' }, loopDuration - 0.1)
      const stableGraphic = createStableIdMotion(stable[0])
      const smartGraphic = createSmartTargetMotion(smart[0])
      const resultTrace = trace('result')[0]
      const resultLength = resultTrace.getTotalLength()
      const resultBounds = resultTrace.ownerSVGElement.getBoundingClientRect()
      const markerBounds = lineee[0].getBoundingClientRect()
      const markerY = (markerBounds.top + markerBounds.height / 2 - resultBounds.top)
        * resultTrace.ownerSVGElement.viewBox.baseVal.height / resultBounds.height
      let beforeMarker = 0
      let afterMarker = resultLength
      for (let i = 0; i < 16; i += 1) {
        const midpoint = (beforeMarker + afterMarker) / 2
        if (resultTrace.getPointAtLength(midpoint).y < markerY) beforeMarker = midpoint
        else afterMarker = midpoint
      }
      const markerProgress = (beforeMarker + afterMarker) / (2 * resultLength)
      const markerArrival = Math.acos(1 - 2 * markerProgress) / Math.PI * 1.5

      const phases = [
        {
          trigger: intro[0],
          animation: gsap.timeline({ paused: true })
            .to([...intro, ...data], { ...reveal, duration: 1.4 }),
        },
        {
          trigger: stable[0],
          animation: gsap.timeline({ paused: true })
            .to(marker, { opacity: 1, duration: 0.4, ease: 'sine.inOut' })
            .set(trace('input'), { opacity: 1 })
            .to(trace('input'), { ...line, duration: 1 })
            .to(stable, reveal, '-=0.25')
            .add(stableGraphic, '<+=0.25'),
        },
        {
          trigger: smart[0],
          animation: gsap.timeline({ paused: true })
            .set(trace('stable'), { opacity: 1 })
            .to(trace('stable'), { ...line, duration: 1.3 })
            .to(smart, reveal, '-=0.25')
            .add(smartGraphic, '<+=0.25'),
        },
        {
          trigger: launch[0],
          animation: launchAnimation,
        },
        {
          trigger: optimization[0],
          animation: gsap.timeline({ paused: true })
            .to(optimization, reveal),
        },
        {
          trigger: result[0],
          animation: gsap.timeline({ paused: true })
            .set(resultTrace, { opacity: 1 })
            .to(resultTrace, { ...line, duration: 1.5 })
            .set(arrow, { opacity: 1 })
            .to(arrow, { ...line, duration: 0.35 })
            .to(result, { ...reveal, duration: 1.2 }, '-=0.3')
            .to(lineeeMarker, { autoAlpha: 1, duration: 0.2, ease: 'sine.out' }, markerArrival)
            .to(lineeeStroke, { scaleX: 1, duration: 0.4, ease: 'sine.inOut' }, markerArrival + 0.05),
        },
      ]

      let nextPhase = 0
      let playing = false
      const reached = new Set()
      const playNext = () => {
        const phase = phases[nextPhase]
        if (playing || !phase || !reached.has(phase.trigger)) return
        playing = true
        phase.animation.play()
      }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting, boundingClientRect, rootBounds }) => {
          // Also handle a reload or a fast scroll that has already passed an earlier zone.
          if (isIntersecting || boundingClientRect.bottom <= (rootBounds?.top ?? 0)) reached.add(target)
        })
        playNext()
      }, { threshold: 0.15, rootMargin: '0px 0px -48px 0px' })

      phases.forEach(({ trigger, animation }, index) => {
        // Bring in the intro and Stable ID sooner, including its nested graphic.
        animation.timeScale(index < 2 ? 3.2 : 2.5)
        animation.eventCallback('onComplete', () => {
          observer.unobserve(trigger)
          reached.delete(trigger)
          playing = false
          nextPhase += 1
          if (nextPhase === phases.length) {
            ambientMotionRef.current = true
            section.dataset.audienceRevealed = 'true'
          }
          playNext()
        })
        observer.observe(trigger)
      })

      return () => {
        observer.disconnect()
        ambientMotionRef.current = false
        delete section.dataset.audienceRevealed
      }
    }, section)

    return () => media.revert()
  }, [sectionRef, ambientMotionRef])
}
