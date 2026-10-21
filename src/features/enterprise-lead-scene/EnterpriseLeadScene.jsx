import { useEffect, useRef, useState } from 'react'
import reportVideo from '../../assets/figma/enterprise-lead-scene/girl-report-final.mp4'
import reportPoster from '../../assets/figma/enterprise-lead-scene/girl-report-final-poster.jpg'
import maskGradientOverlay from '../../assets/figma/enterprise-lead-scene/mask-gradient-overlay.png'
import reportBubbleBackground from '../../assets/figma/enterprise-lead-scene/report-bubble-background.svg'
import reportIcon from '../../assets/figma/enterprise-lead-scene/report-icon.svg'
import mediascoutLogo from '../../assets/figma/enterprise-lead-scene/mediascout-logo.png'
import clatchLogo from '../../assets/figma/white-solutions-2026/clatch.svg'
import kionLogo from '../../assets/figma/white-solutions-2026/kion.svg'
import mtsMediaLogo from '../../assets/figma/white-solutions-2026/mts-media.svg'
import mtsMusicLogo from '../../assets/figma/white-solutions-2026/mts-music.svg'
import tonkostiLogo from '../../assets/figma/white-solutions-2026/tonkosti.svg'
import marquee01 from '../../assets/figma/white-solutions-2026/marquee-01.svg'
import marquee02 from '../../assets/figma/white-solutions-2026/marquee-02.svg'
import marquee03 from '../../assets/figma/white-solutions-2026/marquee-03.svg'
import marquee04 from '../../assets/figma/white-solutions-2026/marquee-04.svg'
import marquee05 from '../../assets/figma/white-solutions-2026/marquee-05.svg'
import marquee06 from '../../assets/figma/white-solutions-2026/marquee-06.svg'
import marquee07 from '../../assets/figma/white-solutions-2026/marquee-07.svg'
import marquee08 from '../../assets/figma/white-solutions-2026/marquee-08.svg'
import marquee09 from '../../assets/figma/white-solutions-2026/marquee-09.svg'
import marquee10 from '../../assets/figma/white-solutions-2026/marquee-10.svg'
import marquee11 from '../../assets/figma/white-solutions-2026/marquee-11.svg'
import marquee12 from '../../assets/figma/white-solutions-2026/marquee-12.svg'
import { LeadShowcaseForm } from '../lead-showcase'
import './EnterpriseLeadScene.css'

const publisherLogos = [
  [marquee01, 'ТАСС'], [marquee02, 'Drive2'], [marquee03, 'Hello!'],
  [marquee04, 'РБК'], [marquee05, 'Авито'], [marquee06, 'Эноб'],
  [marquee07, 'Psychologies'], [marquee08, 'МК'], [marquee09, 'Спортс'],
  [marquee10, 'Лайфхакер'], [marquee11, 'Elle'], [marquee12, 'Вокруг света'],
]

const inventoryLogos = [
  [clatchLogo, 'Clatch'], [mtsMediaLogo, 'МТС Медиа'],
  [kionLogo, 'KION'], [mtsMusicLogo, 'МТС Музыка'],
  [tonkostiLogo, 'Тонкости туризма'],
]

export function EnterpriseLeadScene() {
  const videoRef = useRef(null)
  const startedRef = useRef(false)
  const [reportVisible, setReportVisible] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || startedRef.current) return
      startedRef.current = true
      video.play().catch(() => {
        // A muted inline video normally autoplays; retry when it can play.
        startedRef.current = false
      })
      observer.disconnect()
    }, { threshold: 0.4 })

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="enterprise-lead-scene" aria-labelledby="enterprise-lead-scene-title">
      <div className="enterprise-lead-scene__solutions">
        <h2 id="enterprise-lead-scene-title">Используем белые решения</h2>
        <div className="enterprise-lead-scene__cards">
          <article className="enterprise-lead-scene__publishers enterprise-lead-scene__card">
            <h3>Размещаем рекламу на проверенных сайтах</h3>
            <div className="enterprise-lead-scene__publisher-logos" aria-label="Проверенные площадки">
              {publisherLogos.map(([src, name]) => <img src={src} alt={name} key={name} />)}
            </div>
          </article>
          <div className="enterprise-lead-scene__benefits">
            <article className="enterprise-lead-scene__card enterprise-lead-scene__benefit">
              <div>
                <h3>Свой ОРД Медиаскаут</h3>
                <p>Сами передадим и зарегистрируем вашу рекламу в ЕРИР</p>
              </div>
              <img className="enterprise-lead-scene__mediascout" src={mediascoutLogo} alt="Медиаскаут" />
            </article>
            <article className="enterprise-lead-scene__card enterprise-lead-scene__benefit">
              <div>
                <h3>Эксклюзивный инвентарь</h3>
                <p>Собственные площадки с охватом более 10 млн человек</p>
              </div>
              <div className="enterprise-lead-scene__inventory-logos" aria-label="Площадки экосистемы МТС">
                {inventoryLogos.map(([src, name]) => <img src={src} alt={name} key={name} />)}
              </div>
            </article>
          </div>
        </div>
      </div>

      <div className="enterprise-lead-scene__visual">
        <video
          className="enterprise-lead-scene__video"
          ref={videoRef}
          src={reportVideo}
          poster={reportPoster}
          muted
          playsInline
          preload="metadata"
          onTimeUpdate={(event) => {
            if (event.currentTarget.currentTime >= 1.2) setReportVisible(true)
          }}
          onEnded={(event) => {
            setReportVisible(true)
            event.currentTarget.pause()
          }}
          aria-label="Девушка получает отчёт по рекламной кампании"
        />
        <img className="enterprise-lead-scene__mask-gradient" src={maskGradientOverlay} alt="" aria-hidden="true" />
        <div className="enterprise-lead-scene__top-fade" aria-hidden="true" />
        <div className="enterprise-lead-scene__bottom-fade" aria-hidden="true" />
        <LeadShowcaseForm className="enterprise-lead-scene__form" showHeading />
        <div className={`enterprise-lead-scene__report${reportVisible ? ' is-visible' : ''}`} role="status" aria-live="polite" aria-hidden={!reportVisible}>
          <img className="enterprise-lead-scene__report-background" src={reportBubbleBackground} alt="" />
          <div className="enterprise-lead-scene__report-copy">
            <span>от эксперта МТС ADS:</span>
            <strong>Отчёт по РК готов</strong>
          </div>
          <img className="enterprise-lead-scene__report-icon" src={reportIcon} alt="" />
        </div>
      </div>
    </section>
  )
}
