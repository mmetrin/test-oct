import { useEffect, useState } from 'react'

import { getConversionValue } from './drawInfoGraph'
import './LeadershipMetricTexts.css'

const numberFormatter = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const counterStepSeconds = 0.16

export function LeadershipMetricTexts({ videoRef, visible }) {
  const [conversion, setConversion] = useState(0)

  useEffect(() => {
    if (!visible) return undefined

    const video = videoRef.current
    if (!video) return undefined

    let frameId
    function update() {
      const frameTime = Math.floor(video.currentTime / counterStepSeconds) * counterStepSeconds
      const nextValue = getConversionValue(frameTime)
      setConversion((current) => current === nextValue ? current : nextValue)
      frameId = window.requestAnimationFrame(update)
    }

    update()
    return () => window.cancelAnimationFrame(frameId)
  }, [videoRef, visible])

  return (
    <div className={`leadership-metric-texts${visible ? ' leadership-metric-texts--visible' : ''}`} aria-hidden="true">
      <span className="leadership-metric-texts__label leadership-metric-texts__label--dynamics">Показы</span>
      <div className="leadership-metric-texts__ctr">
        <span className="leadership-metric-texts__value">{numberFormatter.format(conversion)}%</span>
        <span className="leadership-metric-texts__ctr-label">CTR</span>
      </div>
    </div>
  )
}
