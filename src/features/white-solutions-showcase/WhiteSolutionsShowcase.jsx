import { useEffect, useRef } from 'react'
import background from '../../assets/figma/white-solutions-2026/background.png'
import illustration from '../../assets/figma/white-solutions-2026/illustration.png'
import mediascoutLogo from '../../assets/figma/white-solutions-2026/mediascout-logo.svg'
import clatchLogo from '../../assets/figma/white-solutions-2026/clatch.svg'
import mtsMediaLogo from '../../assets/figma/white-solutions-2026/mts-media.svg'
import kionLogo from '../../assets/figma/white-solutions-2026/kion.svg'
import mtsMusicLogo from '../../assets/figma/white-solutions-2026/mts-music.svg'
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
import marquee13 from '../../assets/figma/white-solutions-2026/marquee-13.svg'
import './WhiteSolutionsShowcase.css'

const partnerLogos = [
  { src: marquee01, name: 'ТАСС', width: 120.75 },
  { src: marquee02, name: 'Drive2', width: 164.5 },
  { src: marquee03, name: 'Hello!', width: 124.25 },
  { src: marquee04, name: 'РБК', width: 129.5 },
  { src: marquee05, name: 'Авито', width: 150.5 },
  { src: marquee06, name: 'Эноб', width: 133 },
  { src: marquee07, name: 'Psychologies', width: 196 },
  { src: marquee08, name: 'МК', width: 141.75 },
  { src: marquee09, name: 'Спортс', width: 199.5 },
  { src: marquee10, name: 'Лента', width: 243.25 },
  { src: marquee11, name: 'Elle', width: 122.5 },
  { src: marquee12, name: 'Вокруг света', width: 168 },
  { src: marquee13, name: 'Woman.ru', width: 168 },
]

const inventoryLogos = [
  { src: clatchLogo, name: 'Clatch', width: 180.25 },
  { src: mtsMediaLogo, name: 'МТС Медиа', width: 175 },
  { src: kionLogo, name: 'KION', width: 148.75 },
  { src: mtsMusicLogo, name: 'МТС Музыка', width: 199.5 },
]

export function WhiteSolutionsShowcase() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let maxShift = 0
    let travel = 1
    let previousShift = null

    const measure = () => {
      maxShift = Math.max(0, track.scrollWidth - section.clientWidth)
      travel = Math.max(1, section.offsetHeight - window.innerHeight * 0.2)
      queueUpdate()
    }
    const updateTrack = () => {
      frame = 0
      const sectionTop = section.getBoundingClientRect().top
      const progress = Math.min(1, Math.max(0, -sectionTop / travel))
      const shift = reduceMotion.matches ? 0 : Math.round(-maxShift * progress)
      if (shift === previousShift) return
      previousShift = shift
      track.style.setProperty('--logo-shift', `${shift}px`)
    }
    const queueUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateTrack)
    }

    measure()
    window.addEventListener('scroll', queueUpdate, { passive: true })
    window.addEventListener('resize', measure)
    reduceMotion.addEventListener('change', queueUpdate)

    return () => {
      window.removeEventListener('scroll', queueUpdate)
      window.removeEventListener('resize', measure)
      reduceMotion.removeEventListener('change', queueUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section
      className="white-solutions-showcase"
      aria-labelledby="white-solutions-showcase-title"
      ref={sectionRef}
    >
      <img className="white-solutions-showcase__background" src={background} alt="" decoding="sync" />
      <img className="white-solutions-showcase__illustration" src={illustration} alt="" decoding="sync" />

      <div className="white-solutions-showcase__container">
        <div className="white-solutions-showcase__intro">
          <h2 id="white-solutions-showcase-title">Используем белые&nbsp;решения</h2>
          <div className="white-solutions-showcase__logo-window" aria-label="Площадки для размещения рекламы">
            <div className="white-solutions-showcase__logo-track" ref={trackRef}>
              {partnerLogos.map(({ src, name, width }) => (
                <span className="white-solutions-showcase__partner-logo" style={{ width }} key={name}>
                  <img src={src} alt={name} draggable="false" />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="white-solutions-showcase__benefits">
          <article className="white-solutions-showcase__benefit">
            <div className="white-solutions-showcase__copy">
              <h3>Свой ОРД Медиаскаут</h3>
              <p>Сами передадим и зарегистрируем вашу рекламу в ЕРИР</p>
            </div>
            <img className="white-solutions-showcase__mediascout" src={mediascoutLogo} alt="Медиаскаут" />
          </article>

          <article className="white-solutions-showcase__benefit">
            <div className="white-solutions-showcase__copy">
              <h3>Эксклюзивный<br />инвентарь</h3>
              <p>Собственные площадки с охватом более 10 млн человек</p>
            </div>
            <div className="white-solutions-showcase__inventory-logos" aria-label="Площадки экосистемы МТС">
              {inventoryLogos.map(({ src, name, width }) => (
                <span className="white-solutions-showcase__inventory-logo" style={{ width }} key={name}>
                  <img src={src} alt={name} draggable="false" />
                </span>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
