import { useEffect, useRef, useState } from 'react'
import audienceLeft from '../../assets/figma/multichannel-strategy/audience-left.png'
import audienceRight from '../../assets/figma/multichannel-strategy/audience-right.png'
import audienceCenter from '../../assets/figma/multichannel-strategy/audience-center.png'
import portrait01 from '../../assets/enterprise-big-data/portraits/portrait-01.jpg'
import portrait02 from '../../assets/enterprise-big-data/portraits/portrait-02.jpg'
import portrait05 from '../../assets/enterprise-big-data/portraits/portrait-05.jpg'
import portrait09 from '../../assets/enterprise-big-data/portraits/portrait-09.jpg'
import portrait10 from '../../assets/enterprise-big-data/portraits/portrait-10.jpg'
import portrait12 from '../../assets/enterprise-big-data/portraits-white/portrait-12.jpg'
import portrait21 from '../../assets/enterprise-big-data/portraits-warm-pink/portrait-21.jpg'
import portrait22 from '../../assets/enterprise-big-data/portraits-warm-pink/portrait-22.jpg'
import portrait25 from '../../assets/enterprise-big-data/portraits-warm-pink/portrait-25.jpg'
import './StrategyAudience.css'

const portraits = [
  { position: 'right', sources: [audienceRight, portrait05, portrait12, portrait25] },
  { position: 'left', sources: [audienceLeft, portrait02, portrait10, portrait22] },
  { position: 'center', sources: [audienceCenter, portrait01, portrait09, portrait21] },
]

export function StrategyAudience({ isExpanded, cycle }) {
  const audienceRef = useRef(null)
  const [availableFrames, setAvailableFrames] = useState([0])

  useEffect(() => {
    if (!isExpanded) return
    const images = [...audienceRef.current.querySelectorAll('img')]
    let cancelled = false
    // The parent supplies a single cycle for both products and portraits.
    // Decode ahead of that cycle and skip any incomplete image sets.
    Promise.allSettled(images.map((image) => image.decode())).then(() => {
      if (cancelled) return
      const loaded = [0, 1, 2, 3].filter((index) => images
        .filter((image) => Number(image.dataset.frame) === index)
        .every((image) => image.naturalWidth > 0))
      if (loaded.length) setAvailableFrames(loaded)
    })
    return () => { cancelled = true }
  }, [isExpanded])

  const frame = {
    current: availableFrames[cycle % availableFrames.length],
    previous: cycle > 0 && availableFrames.length > 1
      ? availableFrames[(cycle - 1) % availableFrames.length]
      : null,
  }

  return (
    <div className="strategy-audience" ref={audienceRef} data-cycling={frame.previous !== null}>
      {portraits.map(({ position, sources }) => (
        <div key={position} className={`strategy-audience__portrait strategy-audience__portrait--${position}`}>
          <div className="strategy-audience__clip">
            {sources.map((source, index) => (
              <span key={source} className={`strategy-audience__frame${index === frame.current ? ' is-current' : ''}${index === frame.previous ? ' is-previous' : ''}`}>
                <img src={source} alt="" decoding="async" data-frame={index}
                  width={index === 0 ? (position === 'center' ? 928 : 1254) : 256}
                  height={index === 0 ? (position === 'center' ? 1232 : 1254) : 256}
                  className={`strategy-audience__photo${index === 0 ? ' is-original' : ''}`} />
              </span>
            ))}
          </div>
        </div>
      ))}
      <p>Ваша аудитория</p>
    </div>
  )
}
