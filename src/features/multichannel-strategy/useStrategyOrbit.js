import { useLayoutEffect } from 'react'
import orbitSource from '../../assets/figma/multichannel-strategy/orbit.svg?raw'
import { createOrbitMotion } from './orbitMotion'
import { strategySlots } from './channels'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const ICON_ORBIT_DURATION = 2800
const ICON_ORBIT_SWEEP = .22
// Begin the morph during the final, slowing part of the orbit.
const REVEAL_AT = ICON_ORBIT_DURATION * .72
const DOT_ORBIT_DURATION = 32000
// Offset the signals so they do not all pass behind the four cards together.
const DOT_OFFSETS = [.625, .9375, .3125, 0]

export function useStrategyOrbit(sectionRef, stageRef, channelRefs, onReveal) {
  useLayoutEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const dots = [...stage.querySelectorAll('.strategy-scene__dot')]
    const orbitMotion = createOrbitMotion(orbitSource)
    stage.querySelectorAll('.strategy-scene__arc').forEach((arc) => arc.setAttribute('d', orbitMotion.pathData))
    const orbitStartedAt = performance.now()
    let orbitPhase = 0
    let visible = false
    let entered = false
    let entrance = 0
    let revealed = false
    let iconsSettled = false
    let previous = 0
    let frame = 0
    let width = stage.clientWidth
    let compact = window.innerWidth <= 1240
    let orbitGeometry = null

    const positionIcons = () => {
      if (!orbitGeometry) return
      const progress = reducedMotion.matches ? 1 : Math.min(1, entrance / ICON_ORBIT_DURATION)
      // A shorter arc allows slower travel in less time. Smoothstep has zero
      // velocity and acceleration at both ends, including the card reveal.
      const eased = progress ** 3 * (progress * (progress * 6 - 15) + 10)
      orbitGeometry.anchors.forEach(({ progress: start, point: origin }, index) => {
        const element = channelRefs.current[index]
        if (!element) return
        const point = orbitMotion.pointAt(start - ICON_ORBIT_SWEEP * (1 - eased))
        element.style.translate = `${(point.x - origin.x) * orbitGeometry.width}px ${(point.y - origin.y) * orbitGeometry.height}px`
      })
    }

    const layout = () => {
      const cy = compact ? 180 : 300
      const rx = compact ? Math.min(400, Math.max(86, width / 2 - 48)) : Math.min(525.5, width / 2 - 85)
      const ry = compact ? 126 : 234
      stage.style.setProperty('--orbit-width', `${rx * 2}px`)
      stage.style.setProperty('--orbit-height', `${ry * 2}px`)
      stage.style.setProperty('--orbit-scale-x', rx * 2 / 1051)
      stage.style.setProperty('--orbit-scale-y', ry * 2 / 468)
      stage.style.setProperty('--orbit-cy', `${cy}px`)
      orbitMotion.resize(rx * 2, ry * 2)
      const anchors = strategySlots.map(({ angle }) => {
        const progress = orbitMotion.progressNear((1 + Math.cos(angle)) / 2, (1 + Math.sin(angle)) / 2)
        return { progress, point: orbitMotion.pointAt(progress) }
      })
      orbitGeometry = { width: rx * 2, height: ry * 2, anchors }
      const cardWidth = compact ? Math.min(460, width - 32) : 460
      strategySlots.forEach((channel, index) => {
        const element = channelRefs.current[index]
        if (!element) return
        const angle = channel.angle
        const x = width / 2 + Math.cos(angle) * rx
        const y = cy + Math.sin(angle) * ry
        element.style.left = `${x}px`
        element.style.top = `${y}px`
        let cardX
        let cardY
        if (compact) {
          cardX = width / 2
          cardY = 470 + index * 230
        } else if (Math.abs(Math.sin(angle)) > .65) {
          cardX = clamp(x, cardWidth / 2 + 16, width - cardWidth / 2 - 16)
          cardY = Math.sin(angle) < 0 ? 90 : 510
        } else {
          cardX = Math.cos(angle) < 0
            ? Math.min(x, width / 2 - 189 - cardWidth / 2)
            : Math.max(x, width / 2 + 189 + cardWidth / 2)
          cardX = clamp(cardX, cardWidth / 2 + 16, width - cardWidth / 2 - 16)
          cardY = clamp(y, 100, 500)
        }
        element.style.setProperty('--card-width', `${cardWidth}px`)
        // Reserve enough room for any product so rotation never moves the cards.
        const cardHeight = Math.max(...[...element.querySelectorAll('.strategy-channel__copy')].map((copy) => copy.offsetHeight))
        element.style.setProperty('--card-height', `${cardHeight}px`)
        // Expand only the surface with transforms; text keeps its final layout.
        element.style.setProperty('--card-scale-x', 65 / cardWidth)
        element.style.setProperty('--card-scale-y', 65 / cardHeight)
        element.style.setProperty('--card-radius-x', `${14.896 * cardWidth / 65}px`)
        element.style.setProperty('--card-radius-y', `${14.896 * cardHeight / 65}px`)
        element.style.setProperty('--card-dx', `${cardX - x}px`)
        element.style.setProperty('--card-dy', `${cardY - y}px`)
      })
      positionIcons()
    }

    const positionDots = () => {
      dots.forEach((dot, index) => {
        const progress = DOT_OFFSETS[index] + orbitPhase
        const point = orbitMotion.pointAt(progress)
        dot.style.left = `${point.x * 100}%`
        dot.style.top = `${point.y * 100}%`
      })
    }

    const tick = (now) => {
      frame = 0
      const dt = previous ? Math.min(now - previous, 48) : 0
      previous = now
      if (visible && !document.hidden) {
        if (entered) entrance = reducedMotion.matches ? ICON_ORBIT_DURATION : Math.min(ICON_ORBIT_DURATION, entrance + dt)
        if (!iconsSettled) {
          positionIcons()
          if (entrance >= ICON_ORBIT_DURATION) iconsSettled = true
        }
        if (entrance >= REVEAL_AT && !revealed) {
          revealed = true
          onReveal(true)
        }
        // Wall-clock phase keeps the orbit continuous across scroll and tab changes.
        // Revealing the cards never changes or stops this timeline.
        if (!reducedMotion.matches) orbitPhase = ((now - orbitStartedAt) / DOT_ORBIT_DURATION) % 1
        positionDots()
      }
      if (visible && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(tick)
    }
    const start = () => {
      previous = 0
      if (!frame) frame = requestAnimationFrame(tick)
    }
    const resize = () => {
      compact = window.innerWidth <= 1240
      section.dataset.compact = String(compact)
      section.style.setProperty('--strategy-screen-width', `${window.innerWidth}px`)
      width = stage.clientWidth
      layout()
      positionDots()
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      section.dataset.motionVisible = String(visible)
      if (visible) {
        // Wait until the orbit's centre is in view, not just its top edge.
        const revealHeight = Math.min(entry.boundingClientRect.height * .55, window.innerHeight * .5)
        if (!entered && entry.intersectionRect.height >= revealHeight) {
          entered = true
          section.dataset.entered = 'true'
        }
        start()
      } else {
        cancelAnimationFrame(frame)
        frame = 0
        previous = 0
      }
    }, { threshold: Array.from({ length: 21 }, (_, index) => index / 20) })
    const onMotionChange = () => { layout(); positionDots(); start() }
    observer.observe(stage)
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(stage)
    channelRefs.current.forEach((element) => {
      element?.querySelectorAll('.strategy-channel__copy').forEach((copy) => resizeObserver.observe(copy))
    })
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', start)
    reducedMotion.addEventListener('change', onMotionChange)
    resize()
    positionDots()
    return () => {
      observer.disconnect()
      resizeObserver.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', start)
      reducedMotion.removeEventListener('change', onMotionChange)
    }
  }, [sectionRef, stageRef, channelRefs, onReveal])
}
