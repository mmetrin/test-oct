import { useEffect, useRef, useState } from 'react'
import { SiteCases, SiteFooter, SitePlatforms } from '../../shared/ui/site-sections'
import introPanels from '../../assets/figma/bloggers/intro-panels.png'
import growthPanels from '../../assets/figma/bloggers/growth-panels.png'
import workFormat from '../../assets/figma/bloggers/work-format.png'
import appQr from '../../assets/figma/bloggers/app-qr.png'
import backgroundGlow from '../../assets/figma/bloggers/background-glow.png'
import phoneFrame from '../../assets/figma/bloggers/phone-frame.png'
import leftPoster from '../../assets/figma/bloggers/hero-video-left-poster.png'
import rightPoster from '../../assets/figma/bloggers/hero-video-right-poster.png'
import leftVideo from '../../assets/figma/bloggers/tiktok-final-1.mp4'
import rightVideo from '../../assets/figma/bloggers/tiktok-final-2.mp4'
import './BloggersContent.css'

const caseImages = import.meta.glob('../../assets/figma/bloggers/case-*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

function PhoneVideo({ className, src, poster, label, videoRef, isSynced }) {
  return (
    <div className={`bloggers-hero__phone ${className}`}>
      <img className="bloggers-hero__phone-frame" src={phoneFrame} alt="" aria-hidden="true" />
      <img className="bloggers-hero__phone-video" src={poster} alt="" aria-hidden="true" />
      <video
        ref={videoRef}
        className={`bloggers-hero__phone-video bloggers-hero__phone-video--motion${isSynced ? ' is-synced' : ''}`}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="auto"
        aria-label={label}
      />
      <span className="bloggers-hero__phone-camera" aria-hidden="true" />
    </div>
  )
}

function BloggersHero() {
  const leftVideoRef = useRef(null)
  const rightVideoRef = useRef(null)
  const [isSynced, setIsSynced] = useState(false)

  useEffect(() => {
    const videos = [leftVideoRef.current, rightVideoRef.current]
    let startFrame = null
    let started = false
    let cancelled = false

    const startTogether = () => {
      if (started || videos.some((video) => video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA)) return
      started = true
      startFrame = requestAnimationFrame(() => {
        videos.forEach((video) => { video.currentTime = 0 })
        Promise.all(videos.map((video) => video.play()))
          .then(() => {
            if (!cancelled) setIsSynced(true)
          })
          .catch(() => {
            if (cancelled) return
            videos.forEach((video) => video.pause())
            started = false
          })
      })
    }

    videos.forEach((video) => video.addEventListener('loadeddata', startTogether))
    startTogether()

    return () => {
      cancelled = true
      if (startFrame !== null) cancelAnimationFrame(startFrame)
      videos.forEach((video) => {
        video.removeEventListener('loadeddata', startTogether)
        video.pause()
      })
    }
  }, [])

  return (
    <section className="bloggers-hero" aria-labelledby="bloggers-title">
      <div className="bloggers-hero__glow" aria-hidden="true" />
      <div className="bloggers-hero__brand-names" aria-hidden="true">
        <span>Befree</span><span>МИРАТОРГ</span><span>GRASS</span><span>Плати по миру</span>
        <span>SYNERGETIC</span><span>КАССИР</span><span>Bombbar</span><span>Я.Маркет</span>
      </div>
      <img className="bloggers-hero__poster bloggers-hero__poster--left" src={leftPoster} alt="" />
      <img className="bloggers-hero__poster bloggers-hero__poster--right" src={rightPoster} alt="" />
      <PhoneVideo className="bloggers-hero__phone--left" src={rightVideo} poster={leftPoster} label="Видео блогера в левой карточке" videoRef={leftVideoRef} isSynced={isSynced} />
      <PhoneVideo className="bloggers-hero__phone--right" src={leftVideo} poster={rightPoster} label="Видео блогера в правой карточке" videoRef={rightVideoRef} isSynced={isSynced} />
      <div className="bloggers-hero__content">
        <h1 id="bloggers-title">Зарабатывайте на своём блоге <span>уже при 1000 подписчиков</span></h1>
        <p>Платформа с рекламными проектами для блогеров и UGC-креаторов</p>
        <div className="bloggers-hero__stats" aria-label="Getblogger в цифрах">
          <div><strong>300+</strong><span>ведущих рекламодателей России</span></div>
          <div><strong>10 <small>лет</small></strong><span>на рынке</span></div>
          <div><strong>150+ <small>тыс.</small></strong><span>блогеров уже вместе с нами</span></div>
        </div>
        <a className="bloggers-hero__join" href="#download-app">Присоединиться к Getblogger</a>
      </div>
    </section>
  )
}

function ImageSection({ className, id, src, alt, width, height }) {
  return (
    <section className={`bloggers-page__image-section ${className}`} id={id} aria-label={alt}>
      <img src={src} alt={alt} width={width} height={height} loading="lazy" />
    </section>
  )
}

function BloggerCases() {
  return (
    <section className="bloggers-cases" aria-labelledby="bloggers-cases-title">
      <h2 id="bloggers-cases-title">Ваш контент <span>может приносить доход</span></h2>
      <p>Посмотрите, какие видео создают блогеры для крупных брендов в Getblogger</p>
      <div className="bloggers-cases__scroll" role="region" aria-label="Примеры видео блогеров" tabIndex={0}>
        <div className="bloggers-cases__strip">
          {Array.from({ length: 8 }, (_, index) => {
            const file = `case-${String(index + 1).padStart(2, '0')}.png`
            return <img key={file} src={caseImages[`../../assets/figma/bloggers/${file}`]} alt={`Пример видео блогера ${index + 1}`} width={index === 0 || index === 7 ? 92 : 280} height="500" loading="lazy" />
          })}
        </div>
      </div>
    </section>
  )
}

export function BloggersContent() {
  return (
    <div className="bloggers-page" id="bloggers-content">
      <div className="bloggers-page__mask-group" aria-hidden="true">
        <div className="bloggers-page__mask-canvas">
          <img src={backgroundGlow} alt="" draggable={false} />
        </div>
      </div>
      <BloggersHero />
      <ImageSection className="bloggers-page__intro" src={introPanels} alt="От идеи до выплаты: известные бренды, оплата за видео и официальные выплаты" width="1440" height="646" />
      <section className="bloggers-page__image-section bloggers-page__growth" aria-label="Возможности для вашего роста">
        <img src={growthPanels} alt="Возможности для вашего роста: идеи, поддержка, инструменты и выплаты блогерам" width="1440" height="793" loading="lazy" />
      </section>
      <ImageSection className="bloggers-page__format" src={workFormat} alt="Формат работы: CPA, UGC-креаторы и фабрика контента" width="1440" height="642" />
      <BloggerCases />
      <ImageSection className="bloggers-page__app" id="download-app" src={appQr} alt="Скачайте приложение Getblogger" width="842" height="517" />
      <SiteCases />
      <SitePlatforms id="platforms" />
      <SiteFooter />
    </div>
  )
}
