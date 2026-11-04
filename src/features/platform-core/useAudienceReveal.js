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
      const channels = ['avito', 'vk', 'telegram'].map((name) => select(`[data-audience-channel="${name}"]`)[0])
      const optimization = select('.platform-audience__optimization')
      const result = select('.platform-audience__result')
      const marker = select('.platform-audience__line-marker')
      const arrow = select('.platform-audience__arrow-trace')
      const trace = (name) => select(`.platform-audience__${name}-line .platform-audience__line-trace`)
      const zones = [...intro, ...data, ...stable, ...smart, ...channels, ...optimization, ...result]

      gsap.set(zones, { autoAlpha: 0, y: 6 })
      gsap.set(launchTitle, { autoAlpha: 0 })
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
      const loopBounds = loop.ownerSVGElement.getBoundingClientRect()
      const loopWidth = loop.ownerSVGElement.viewBox.baseVal.width
      const loopDuration = 3.6
      const launchAnimation = gsap.timeline({ paused: true })
        .set(loop, { opacity: 1 })
        .to(loop, { ...line, duration: loopDuration })

      channels.forEach((channel) => {
        // The bottom segment runs right to left. Reveal each logo as the pencil reaches its center.
        const bounds = channel.getBoundingClientRect()
        const x = (bounds.left + bounds.width / 2 - loopBounds.left) * loopWidth / loopBounds.width
        const progress = gsap.utils.clamp(0, 1, (loopLength - x) / loopLength)
        const arrivalTime = Math.acos(1 - 2 * progress) / Math.PI * loopDuration
        launchAnimation.to(channel, { ...reveal, duration: 0.85 }, arrivalTime)
      })
      launchAnimation.to(launchTitle, { autoAlpha: 1, duration: 1.1, ease: 'sine.inOut' }, loopDuration - 0.1)
      const stableGraphic = createStableIdMotion(stable[0])
      const smartGraphic = createSmartTargetMotion(smart[0])

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
            .set(trace('result'), { opacity: 1 })
            .to(trace('result'), { ...line, duration: 1.5 })
            .set(arrow, { opacity: 1 })
            .to(arrow, { ...line, duration: 0.35 })
            .to(result, { ...reveal, duration: 1.2 }, '-=0.3'),
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
        animation.timeScale(index < 2 ? 2.7 : 1.8)
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
