import { useEffect, useRef } from 'react'

import bigDataVideo from '../../assets/funnel-journey/big-data/big-data-ping-pong.mp4'
import bigDataPoster from '../../assets/funnel-journey/big-data/big-data-poster.jpg'
import fadeBottom from '../../assets/figma/big-data-stage/fade-bottom.png'
import logoDixy from '../../assets/figma/big-data-stage/logo-dixy.png'
import logoEmblem from '../../assets/figma/big-data-stage/logo-emblem.png'
import logoMagnit from '../../assets/figma/big-data-stage/logo-magnit.png'
import logoMvideo from '../../assets/figma/big-data-stage/logo-mvideo.png'
import logoPlatforma from '../../assets/figma/big-data-stage/logo-platforma.png'
import logoX5Group from '../../assets/figma/big-data-stage/logo-x5-group.png'

const logos = [
  { image: logoDixy, position: 'one', alt: '' },
  { image: logoX5Group, position: 'two', alt: '' },
  { image: logoMvideo, position: 'three', alt: '' },
  { image: logoPlatforma, position: 'four', alt: '' },
  { image: logoEmblem, position: 'five', alt: '' },
  { image: logoMagnit, position: 'six', alt: '' },
]

export function AudienceDataVideo() {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current

    if (!video) {
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.preload = 'auto'
        void video.play().catch(() => undefined)
      } else {
        video.pause()
      }
    }, { rootMargin: '240px 0px' })

    observer.observe(video)

    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [])

  return (
    <div className="audience-segment-section__video-scene" aria-hidden="true">
      <video ref={videoRef} className="audience-segment-section__video" loop muted playsInline preload="none" poster={bigDataPoster}>
        <source src={bigDataVideo} type="video/mp4" />
      </video>
      <span className="audience-segment-section__video-blur-left" />
      <span className="audience-segment-section__fade audience-segment-section__fade--top" />
      <img className="audience-segment-section__fade audience-segment-section__fade--bottom" src={fadeBottom} alt="" />
      {logos.map(({ image, position, alt }) => (
        <img key={position} className={`audience-segment-section__logo-trail audience-segment-section__logo-trail--${position}`} src={image} alt={alt} />
      ))}
    </div>
  )
}
