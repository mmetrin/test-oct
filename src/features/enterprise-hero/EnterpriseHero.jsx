import { useEffect, useRef, useState } from 'react'

import familyVideo from '../../assets/enterprise-hero/family-background.mp4'
import flowerShopVideo from '../../assets/enterprise-hero/flower-shop-6858a3d3.mp4'
import leadershipVideo from '../../assets/enterprise-hero/cinematic-business-5928.mp4'
import motherChildVideo from '../../assets/enterprise-hero/cinematic-mother-child-background.mp4'
import toyImage from '../../assets/figma/enterprise-hero/toy.png'
import chevronIcon from '../../assets/figma/main-enterprises/chevron-down.svg'
import mtsLogo from '../../assets/figma/main-enterprises/logo-mts-ads.svg'
import { ActionButton } from '../../shared/ui/action-button/ActionButton'
import { FlowerShopBubbles } from './FlowerShopBubbles'
import { LeadershipMetricTexts } from './LeadershipMetricTexts'
import { MaskedHeroVideo } from './MaskedHeroVideo'
import { MotherChildMetrics } from './MotherChildMetrics'
import './EnterpriseHero.css'

const navigationItems = [
  { label: 'Решения', hasChevron: true },
  { label: 'Платформы', hasChevron: true },
  { label: 'Сертификация', href: `${import.meta.env.BASE_URL}certification/` },
  { label: 'Контакты' },
]

const flowerSlowdownSeconds = 1.5
const flowerFinalPlaybackRate = 0.55
const flowerNotificationStartSeconds = 3.9
const flowerMessageStartSeconds = 7.2
const flowerLastFrameHoldMilliseconds = 300
const videoCrossfadeSeconds = 0.45
const videoAdvanceLeadSeconds = videoCrossfadeSeconds + 0.3

function EnterpriseHeroFacts() {
  return (
    <div className="enterprise-hero__facts" aria-label="МТС ADS в цифрах">
      <div className="enterprise-hero__fact">
        <p className="enterprise-hero__number">65+ <span>млн</span></p>
        <p><span>активной аудитории</span> от самого крупного оператора страны</p>
      </div>
      <div className="enterprise-hero__fact">
        <p className="enterprise-hero__number">5 000</p>
        <p><span>параметров аудитории</span> для формирования сегмента</p>
      </div>
      <div className="enterprise-hero__fact">
        <p className="enterprise-hero__number">350</p>
        <p><span>уже готовых<br />сегментов</span></p>
      </div>
    </div>
  )
}

export function EnterpriseHero({ leadershipOnly = false, showTrustCopy = false, showHeader = true, onVideoChange }) {
  const familyVideoRef = useRef(null)
  const flowerShopVideoRef = useRef(null)
  const leadershipVideoRef = useRef(null)
  const motherChildVideoRef = useRef(null)
  const flowerPlaybackFrameRef = useRef(null)
  const flowerEndHoldTimeoutRef = useRef(null)
  const activeVideoRef = useRef('leadership')
  const isAdvancingVideoRef = useRef(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeVideo, setActiveVideo] = useState('leadership')
  const [isBloggerBubbleVisible, setIsBloggerBubbleVisible] = useState(false)
  const [isToyBubbleVisible, setIsToyBubbleVisible] = useState(false)
  const [showFlowerNotification, setShowFlowerNotification] = useState(false)
  const [showFlowerMessage, setShowFlowerMessage] = useState(false)
  const [showLeadershipGraphs, setShowLeadershipGraphs] = useState(true)
  const [hasLeadershipFrame, setHasLeadershipFrame] = useState(false)
  const [showMotherChildMetrics, setShowMotherChildMetrics] = useState(false)

  useEffect(() => () => {
    if (flowerPlaybackFrameRef.current !== null) {
      window.cancelAnimationFrame(flowerPlaybackFrameRef.current)
    }
    if (flowerEndHoldTimeoutRef.current !== null) {
      window.clearTimeout(flowerEndHoldTimeoutRef.current)
    }
  }, [])

  function advanceVideoNearEnd(event, currentName, nextVideoRef, nextName) {
    const video = event.currentTarget
    if (
      activeVideoRef.current !== currentName
      || !Number.isFinite(video.duration)
      || video.duration <= 0
    ) return

    const secondsRemaining = (video.duration - video.currentTime) / video.playbackRate
    if (secondsRemaining <= videoAdvanceLeadSeconds) {
      void playNextVideo(currentName, nextVideoRef, nextName)
    }
  }

  function handleVideoTimeUpdate(event) {
    const currentTime = event.currentTarget.currentTime
    if (currentTime >= 1) {
      setIsBloggerBubbleVisible(true)
    }
    if (currentTime >= 3) {
      setIsToyBubbleVisible(true)
    }
    advanceVideoNearEnd(event, 'family', leadershipVideoRef, 'leadership')
  }

  function handleFlowerShopTimeUpdate(event) {
    if (activeVideoRef.current !== 'flower-shop') return
    const currentTime = event.currentTarget.currentTime
    if (currentTime >= flowerNotificationStartSeconds) setShowFlowerNotification(true)
    if (currentTime >= flowerMessageStartSeconds) setShowFlowerMessage(true)
  }

  function handleFlowerShopEnded() {
    if (activeVideoRef.current !== 'flower-shop' || flowerEndHoldTimeoutRef.current !== null) return
    flowerEndHoldTimeoutRef.current = window.setTimeout(() => {
      flowerEndHoldTimeoutRef.current = null
      void playNextVideo(
        'flower-shop',
        motherChildVideoRef,
        'mother-child',
      )
    }, flowerLastFrameHoldMilliseconds)
  }

  function updateFlowerShopPlaybackRate() {
    const video = flowerShopVideoRef.current
    if (!video || video.paused || video.ended) {
      flowerPlaybackFrameRef.current = null
      return
    }

    if (Number.isFinite(video.duration)) {
      const progress = Math.min(1, Math.max(0, (video.currentTime - video.duration + flowerSlowdownSeconds) / flowerSlowdownSeconds))
      const easedProgress = progress * progress * (3 - 2 * progress)
      video.playbackRate = 1 - (1 - flowerFinalPlaybackRate) * easedProgress
    }

    flowerPlaybackFrameRef.current = window.requestAnimationFrame(updateFlowerShopPlaybackRate)
  }

  function handleFlowerShopPlay() {
    if (flowerPlaybackFrameRef.current === null) {
      updateFlowerShopPlaybackRate()
    }
  }

  async function playNextVideo(currentName, videoRef, videoName) {
    if (activeVideoRef.current !== currentName || isAdvancingVideoRef.current) return
    const video = videoRef.current
    if (!video) return
    isAdvancingVideoRef.current = true

    video.pause()
    if (video.currentTime > 0 || video.ended) video.currentTime = 0
    video.playbackRate = 1

    if (video.seeking || video.readyState < 2) {
      await new Promise((resolve) => {
        function handleFrameReady() {
          if (video.seeking || video.readyState < 2) return
          video.removeEventListener('seeked', handleFrameReady)
          video.removeEventListener('loadeddata', handleFrameReady)
          resolve()
        }

        video.addEventListener('seeked', handleFrameReady)
        video.addEventListener('loadeddata', handleFrameReady)
      })
    }

    setIsBloggerBubbleVisible(false)
    setIsToyBubbleVisible(false)
    setShowFlowerNotification(false)
    setShowFlowerMessage(false)
    setShowLeadershipGraphs(videoName === 'leadership')
    setHasLeadershipFrame(false)
    setShowMotherChildMetrics(false)
    activeVideoRef.current = videoName
    setActiveVideo(videoName)
    onVideoChange?.(videoName)
    isAdvancingVideoRef.current = false
    if (!video.closest('[data-parallax-covered]')) {
      void video.play().catch(() => undefined)
    }
  }

  function handleVideoFadeComplete(event, videoName) {
    if (event.propertyName !== 'opacity') return
    if (activeVideoRef.current !== videoName) return
    if (event.currentTarget.closest('[data-parallax-covered]')) return
    if (videoName === 'mother-child') setShowMotherChildMetrics(true)
    if (event.currentTarget.paused) void event.currentTarget.play().catch(() => undefined)
  }

  return (
    <section className="enterprise-hero" id="top" aria-labelledby="enterprise-hero-title">
      <div className={`enterprise-hero__stage${leadershipOnly ? ' enterprise-hero__stage--leadership-only' : ''}`} aria-hidden="true">
        <video
          ref={leadershipVideoRef}
          className={`enterprise-hero__video enterprise-hero__video--leadership${activeVideo === 'leadership' && hasLeadershipFrame ? ' enterprise-hero__video--active' : ''}`}
          src={leadershipVideo}
          autoPlay
          muted
          playsInline
          preload="auto"
          onTransitionEnd={(event) => handleVideoFadeComplete(event, 'leadership')}
          onTimeUpdate={(event) => advanceVideoNearEnd(event, 'leadership', flowerShopVideoRef, 'flower-shop')}
          onEnded={() => playNextVideo('leadership', flowerShopVideoRef, 'flower-shop')}
        />
        <MaskedHeroVideo
          sourceVideoRef={leadershipVideoRef}
          active={activeVideo === 'leadership'}
          visible={showLeadershipGraphs}
          graphTone="light"
          onFrameReady={setHasLeadershipFrame}
        />
        <video
          ref={flowerShopVideoRef}
          className={`enterprise-hero__video enterprise-hero__video--flower-shop${activeVideo === 'flower-shop' ? ' enterprise-hero__video--active' : ''}`}
          src={flowerShopVideo}
          muted
          playsInline
          preload="auto"
          onPlay={handleFlowerShopPlay}
          onTimeUpdate={handleFlowerShopTimeUpdate}
          onTransitionEnd={(event) => handleVideoFadeComplete(event, 'flower-shop')}
          onEnded={handleFlowerShopEnded}
        />
        <video
          ref={motherChildVideoRef}
          className={`enterprise-hero__video enterprise-hero__video--leadership enterprise-hero__video--mother-child${activeVideo === 'mother-child' ? ' enterprise-hero__video--active' : ''}`}
          src={motherChildVideo}
          muted
          playsInline
          preload="auto"
          onTransitionEnd={(event) => handleVideoFadeComplete(event, 'mother-child')}
          onTimeUpdate={(event) => advanceVideoNearEnd(event, 'mother-child', leadershipOnly ? leadershipVideoRef : familyVideoRef, leadershipOnly ? 'leadership' : 'family')}
          onEnded={() => playNextVideo('mother-child', leadershipOnly ? leadershipVideoRef : familyVideoRef, leadershipOnly ? 'leadership' : 'family')}
        />
        {!leadershipOnly && <video
          ref={familyVideoRef}
          className={`enterprise-hero__video${activeVideo === 'family' ? ' enterprise-hero__video--active' : ''}`}
          src={familyVideo}
          muted
          playsInline
          preload="auto"
          onTimeUpdate={handleVideoTimeUpdate}
          onTransitionEnd={(event) => handleVideoFadeComplete(event, 'family')}
          onEnded={() => playNextVideo('family', leadershipVideoRef, 'leadership')}
        />}
        <div className="enterprise-hero__left-overlay" />
        <div className="enterprise-hero__bottom-overlay" />
        <LeadershipMetricTexts videoRef={leadershipVideoRef} visible={activeVideo === 'leadership' && showLeadershipGraphs && hasLeadershipFrame} />
        <MotherChildMetrics
          videoRef={motherChildVideoRef}
          visible={activeVideo === 'mother-child' && showMotherChildMetrics}
        />
      </div>

      <div className="enterprise-hero__inner">
        {showHeader && <header className="enterprise-hero__header">
          <a className="enterprise-hero__logo" href={`${import.meta.env.BASE_URL}enterprise-hero/`} aria-label="МТС ADS — главная">
            <img src={mtsLogo} alt="МТС ADS" />
          </a>
          <nav className={`enterprise-hero__nav${isMenuOpen ? ' enterprise-hero__nav--open' : ''}`} id="enterprise-hero-nav" aria-label="Основная навигация">
            {navigationItems.map((item) => (
              <a href={item.href ?? '#top'} key={item.label} onClick={() => setIsMenuOpen(false)}>
                {item.label}
                {item.hasChevron && <img src={chevronIcon} alt="" />}
              </a>
            ))}
          </nav>
          <ActionButton className="enterprise-hero__header-button" size="medium">Запустить рекламу</ActionButton>
          <button
            className="enterprise-hero__menu-button"
            type="button"
            aria-controls="enterprise-hero-nav"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            onClick={() => setIsMenuOpen((open) => !open)}
          ><span /><span /></button>
        </header>}

        <div className={`enterprise-hero__copy${showTrustCopy ? ' enterprise-hero__copy--with-lead' : ''}`}>
          <h1 id="enterprise-hero-title">
            <span className="enterprise-hero__title-accent">Единое решение</span>{' '}
            <strong>для&nbsp;продвижения бизнеса</strong>{' '}
            <span className="enterprise-hero__title-dark">любого масштаба</span>
          </h1>
          {showTrustCopy && <p className="enterprise-hero__lead">
            Запускайте рекламу, привлекайте клиентов, растите продажи
          </p>}
          <ActionButton className="enterprise-hero__cta">Запустить рекламу с МТС ADS</ActionButton>
        </div>

        {!leadershipOnly && <div className={`enterprise-hero__bubble enterprise-hero__bubble--blogger${activeVideo === 'family' && isBloggerBubbleVisible ? ' enterprise-hero__bubble--visible' : ''}`} aria-hidden={activeVideo !== 'family' || !isBloggerBubbleVisible}>
          Монетизируйте свою аудиторию с Getblogger
        </div>}
        {!leadershipOnly && <div className={`enterprise-hero__bubble enterprise-hero__bubble--toy${activeVideo === 'family' && isToyBubbleVisible ? ' enterprise-hero__bubble--visible' : ''}`} aria-hidden={activeVideo !== 'family' || !isToyBubbleVisible}>
          <span>Реклама товаров<br />и услуг</span>
          <img src={toyImage} alt="" />
        </div>}

        <FlowerShopBubbles
          visible={activeVideo === 'flower-shop' && showFlowerNotification}
          messageReady={showFlowerMessage}
        />

        <EnterpriseHeroFacts />
      </div>
    </section>
  )
}
