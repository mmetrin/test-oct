import { useEffect, useState } from 'react'

import './FunnelHeroVisual.css'
import logoSet01 from '../../assets/funnel-journey/hero/logos-animated/logo-set-01.png'
import logoSet02 from '../../assets/funnel-journey/hero/logos-animated/logo-set-02.png'
import logoSet04 from '../../assets/funnel-journey/hero/logos-animated/logo-set-04.png'
import logoSet05 from '../../assets/funnel-journey/hero/logos-animated/logo-set-05.png'
import logoSet06 from '../../assets/funnel-journey/hero/logos-animated/logo-set-06.png'
import logoSet07 from '../../assets/funnel-journey/hero/logos-animated/logo-set-07.png'
import logoSet08 from '../../assets/funnel-journey/hero/logos-animated/logo-set-08.png'
import logoSet09 from '../../assets/funnel-journey/hero/logos-animated/logo-set-09.png'
import logoSet10 from '../../assets/funnel-journey/hero/logos-animated/logo-set-10.png'
import logoSet11 from '../../assets/funnel-journey/hero/logos-animated/logo-set-11.png'
import logoSet12 from '../../assets/funnel-journey/hero/logos-animated/logo-set-12.png'
import logoSet13 from '../../assets/funnel-journey/hero/logos-animated/logo-set-13.png'

const logoSets = [
  logoSet01,
  logoSet02,
  logoSet04,
  logoSet05,
  logoSet06,
  logoSet07,
  logoSet08,
  logoSet09,
  logoSet10,
  logoSet11,
  logoSet12,
  logoSet13,
]
const logoSlotNames = ['one', 'two', 'three', 'four']
const logoRiseStartSeconds = 0.45
const logoFadeAfterPeakSeconds = 1.05

function selectRandomLogos(previousLogos = []) {
  const shuffledLogos = [...logoSets].sort(() => Math.random() - 0.5)
  const freshLogos = shuffledLogos.filter((logo) => !previousLogos.includes(logo))

  return [...freshLogos, ...shuffledLogos.filter((logo) => previousLogos.includes(logo))].slice(0, 4)
}

export function FunnelHeroVisual({ videoRef }) {
  const [visibleLogos, setVisibleLogos] = useState(selectRandomLogos)
  const [isActive, setIsActive] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const video = videoRef.current
    if (!video) {
      return undefined
    }

    let wasActive = false
    const syncPlayback = () => setIsPlaying(!video.paused)
    const syncWithVideo = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        return
      }

      const forwardDuration = video.duration / 2
      const shouldBeActive = video.currentTime >= logoRiseStartSeconds
        && video.currentTime < forwardDuration + logoFadeAfterPeakSeconds

      if (shouldBeActive === wasActive) {
        return
      }

      wasActive = shouldBeActive
      if (shouldBeActive) {
        setVisibleLogos((currentLogos) => selectRandomLogos(currentLogos))
      }
      setIsActive(shouldBeActive)
    }

    video.addEventListener('timeupdate', syncWithVideo)
    video.addEventListener('loadedmetadata', syncWithVideo)
    video.addEventListener('seeked', syncWithVideo)
    video.addEventListener('playing', syncWithVideo)
    video.addEventListener('playing', syncPlayback)
    video.addEventListener('pause', syncPlayback)
    syncWithVideo()
    syncPlayback()

    return () => {
      video.removeEventListener('timeupdate', syncWithVideo)
      video.removeEventListener('loadedmetadata', syncWithVideo)
      video.removeEventListener('seeked', syncWithVideo)
      video.removeEventListener('playing', syncWithVideo)
      video.removeEventListener('playing', syncPlayback)
      video.removeEventListener('pause', syncPlayback)
    }
  }, [videoRef])

  return (
    <div className={`funnel-hero-visual${isActive ? ' funnel-hero-visual--active' : ''}${isPlaying ? '' : ' funnel-hero-visual--paused'}`} aria-hidden="true">
      {visibleLogos.map((logo, index) => (
        <img
          className={`funnel-hero-visual__logo funnel-hero-visual__logo--${logoSlotNames[index]} funnel-hero-visual__logo--animated`}
          key={`${logo}-${index}`}
          src={logo}
          alt=""
        />
      ))}
    </div>
  )
}
