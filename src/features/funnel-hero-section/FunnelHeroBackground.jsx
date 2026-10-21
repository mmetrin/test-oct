import { useEffect } from 'react'

import heroOverlayBottom from '../../assets/figma/main-enterprises/hero-overlay-bottom.png'
import heroVideo from '../../assets/funnel-journey/hero/hero-53e10b0e-ping-pong.mp4'
import heroPoster from '../../assets/funnel-journey/hero/hero-53e10b0e-poster.jpg'

export function FunnelHeroBackground({ videoRef }) {
  useEffect(() => {
    const video = videoRef.current

    if (!video) {
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        void video.play().catch(() => undefined)
      } else {
        video.pause()
      }
    })

    observer.observe(video)

    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [videoRef])

  return (
    <div className="funnel-hero__backdrop" aria-hidden="true">
      <div className="funnel-hero__backdrop-stage">
        <video ref={videoRef} className="funnel-hero__video" loop muted playsInline preload="metadata" poster={heroPoster}>
          <source src={heroVideo} type="video/mp4" />
        </video>
        <span className="funnel-hero__gradient-blur" />
        <span className="funnel-hero__video-fade-top" />
        <span className="funnel-hero__text-veil" />
        <img className="funnel-hero__overlay-bottom" src={heroOverlayBottom} alt="" />
      </div>
    </div>
  )
}
