import { useEffect, useRef, useState } from 'react'

import './MotherChildMetrics.css'
import { useMotherChildCardMask } from './useMotherChildCardMask'

const numberFormatter = new Intl.NumberFormat('ru-RU')
const counterStepSeconds = 0.16
const metrics = [
  { id: 'views', label: 'Просмотры', initial: 128400, perSecond: 10, revealDelay: 0 },
  { id: 'clicks', label: 'Переходы по рекламе', initial: 4860, perSecond: 1.5, revealDelay: 760 },
  { id: 'purchases', label: 'Покупки', initial: 312, perSecond: 2, revealDelay: 1520 },
]

export function MotherChildMetrics({ videoRef, visible }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(() => metrics.map(() => 0))
  const viewsCardRef = useRef(null)
  const clicksCardRef = useRef(null)
  useMotherChildCardMask(viewsCardRef, videoRef, visible)
  useMotherChildCardMask(clicksCardRef, videoRef, visible)

  useEffect(() => {
    if (!visible) return undefined

    let frame = null
    let lastTime = null
    let sceneSeconds = 0
    let displayedSceneSeconds = 0

    function update(time) {
      const delta = lastTime === null ? 0 : Math.min(.05, (time - lastTime) / 1000)
      lastTime = time
      const video = videoRef.current
      if (!document.hidden && video && !video.paused && !video.ended && delta > 0) {
        sceneSeconds += delta
        if (sceneSeconds - displayedSceneSeconds >= counterStepSeconds) {
          // Update the visible numbers at a measured pace while keeping their
          // accumulated time through video loops, pauses, and hidden tabs.
          const increments = metrics.map(({ revealDelay }) => {
            const start = revealDelay / 1000 + .3
            return Math.max(0, sceneSeconds - start) - Math.max(0, displayedSceneSeconds - start)
          })
          displayedSceneSeconds = sceneSeconds
          if (increments.some((increment) => increment > 0)) {
            setElapsedSeconds((current) => current.map((seconds, index) => seconds + increments[index]))
          }
        }
      }
      frame = window.requestAnimationFrame(update)
    }

    frame = window.requestAnimationFrame(update)
    return () => window.cancelAnimationFrame(frame)
  }, [videoRef, visible])

  return (
    <div className={`mother-child-metrics${visible ? ' mother-child-metrics--visible' : ''}`} aria-hidden="true">
      {metrics.map(({ id, label, initial, perSecond, revealDelay }, index) => (
        <div className={`mother-child-metrics__placement mother-child-metrics__card--${id}`} key={id} ref={id === 'views' ? viewsCardRef : id === 'clicks' ? clicksCardRef : undefined} style={{ '--metric-delay': `${revealDelay}ms` }}>
          <div className="mother-child-metrics__card">
            <span className="mother-child-metrics__label">{label}</span>
            <span className="mother-child-metrics__value">{numberFormatter.format(initial + Math.floor(elapsedSeconds[index] * perSecond))}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
