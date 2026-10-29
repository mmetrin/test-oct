import { useEffect, useRef } from 'react'
import videoTv from '../../assets/figma/connected-tv/format-video-tv.png'
import interactiveTv from '../../assets/figma/connected-tv/format-interactive-tv.png'
import interactiveOverlay from '../../assets/figma/connected-tv/format-interactive-overlay.png'
import specialComposition from '../../assets/connected-tv/format-special-composition.png'
import video from '../../assets/connected-tv/format-video-web.mp4'
import interactiveVideo from '../../assets/connected-tv/format-interactive-web.mp4'
import { useFormatScroll } from './useFormatScroll'
import './ConnectedTvFormats.css'

function FormatTv({ image, src, overlay, label, active = true }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const element = videoRef.current
    if (!element) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && active) void element.play().catch(() => undefined)
      else element.pause()
    }, { threshold: 0.15 })
    observer.observe(element)
    return () => {
      observer.disconnect()
      element.pause()
    }
  }, [active])

  return (
    <div className="ctv-format-tv" role="img" aria-label={label}>
      <img className="ctv-format-tv__image" src={image} width="1024" height="550" loading="lazy" alt="" />
      {src && <div className="ctv-format-tv__screen">
        <video ref={videoRef} src={src} muted loop playsInline preload="metadata" aria-hidden="true" />
        {overlay && <img className="ctv-format-tv__overlay" src={overlay} width="898" height="478" loading="lazy" alt="" />}
      </div>}
    </div>
  )
}

export function ConnectedTvFormats() {
  const sectionRef = useRef(null)
  const activeFormat = useFormatScroll(sectionRef)
  return (
    <section ref={sectionRef} className="connected-tv-formats connected-tv-formats--scroll" id="connected-tv-formats" aria-labelledby="connected-tv-formats-title">
      <div className="connected-tv-formats__stage">
      <h2 id="connected-tv-formats-title">Подберите формат для рекламного контакта</h2>
      <div className="connected-tv-formats__scene">
      <div className="connected-tv-formats__rows">
        <article className="connected-tv-formats__row" data-format-panel>
          <div className="connected-tv-formats__copy">
            <h3>Видеоролик</h3>
            <p>Длительность ролика — от 15 секунд. Транслируется до, во время или после просмотра контента</p>
          </div>
          <FormatTv image={videoTv} src={video} active={activeFormat === null || activeFormat === 0} label="Пример видеорекламы: автомобиль на горной дороге" />
        </article>
        <article className="connected-tv-formats__row connected-tv-formats__row--interactive" data-format-panel>
          <FormatTv image={interactiveTv} src={interactiveVideo} overlay={interactiveOverlay} active={activeFormat === null || activeFormat === 1} label="Пример интерактивной рекламы: автомобиль, выбор цвета и QR-код" />
          <div className="connected-tv-formats__copy">
            <h3>Интерактивный ролик</h3>
            <p>Вовлекайте зрителя во взаимодействие с рекламой и увеличивайте время контакта. Также направляйте пользователей на сторонний сайт с помощью QR-кода</p>
          </div>
        </article>
        <article className="connected-tv-formats__special" data-format-panel>
          <img className="connected-tv-formats__special-image" src={specialComposition} width="3588" height="2088" loading="lazy" alt="Спецпроекты. Брендированная коллекция фильмов, показ рекламы на конкретных тайтлах или в определённых сценах. Два примера оформления онлайн-кинотеатра." />
        </article>
      </div>
      </div>
      </div>
    </section>
  )
}
