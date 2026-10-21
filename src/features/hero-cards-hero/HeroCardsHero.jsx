import { useLayoutEffect, useRef, useState } from 'react'
import '../funnel-hero-section/FunnelHeroSection.css'
import './HeroCardsHero.css'
import chevronIcon from '../../assets/figma/main-enterprises/chevron-down.svg'
import mtsLogo from '../../assets/figma/main-enterprises/logo-mts-ads.svg'
import ambientBg from '../../assets/figma/hero-cards-design/bg.png'
import lightTop from '../../assets/figma/hero-cards-design/light-top.png'
import { usePageReady } from '../../shared/lib/usePageReady'
import { ActionButton } from '../../shared/ui/action-button/ActionButton'
import { HeroCaseCarousel } from '../hero-case-carousel/HeroCaseCarousel'

const navigationItems = [
  { label: 'Решения', hasChevron: true },
  { label: 'Платформы', hasChevron: true },
  { label: 'Медиа', hasChevron: false },
  { label: 'Сертификация', hasChevron: false, href: `${import.meta.env.BASE_URL}certification/` },
  { label: 'Контакты', hasChevron: false },
]

const facts = [
  { detail: 'от самого крупного оператора страны', mobileText: 'активной аудитории', text: 'активной аудитории', unit: 'млн', value: '65+' },
  { detail: 'сегментов', lineBreak: true, mobileText: 'уже готовых сегментов', text: 'уже готовых', value: '350' },
  { detail: 'для формирования сегмента', mobileText: 'параметров аудитории', text: 'параметров аудитории', lineBreak: true, value: '5 000' },
]

export function HeroCardsHero({ showHeader = true }) {
  const isReady = usePageReady()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const heroRef = useRef(null)

  useLayoutEffect(() => {
    const hero = heroRef.current
    const copy = hero.querySelector('.funnel-hero__copy')
    const lead = copy.querySelector('p')

    const positionCarousel = () => {
      const leadBottom = lead.getBoundingClientRect().bottom
      const heroTop = hero.getBoundingClientRect().top
      hero.style.setProperty('--hero-carousel-top', `${leadBottom - heroTop + 64}px`)
    }

    const observer = new ResizeObserver(positionCarousel)
    observer.observe(hero)
    observer.observe(copy)
    observer.observe(lead)
    window.addEventListener('resize', positionCarousel)
    positionCarousel()

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', positionCarousel)
    }
  }, [])

  return (
    <section className={`funnel-hero hero-cards-hero${isReady ? ' funnel-hero--ready' : ''}`} id="top" aria-labelledby="funnel-hero-title" ref={heroRef}>
      <div className="hero-cards-hero__lighting" aria-hidden="true">
        <img className="hero-cards-hero__ambient" src={ambientBg} alt="" />
        <img className="hero-cards-hero__light hero-cards-hero__light--top" src={lightTop} alt="" />
      </div>
      <div className="funnel-hero__inner">
        {showHeader && <header className="funnel-hero__header">
          <a className="funnel-hero__logo" href={`${import.meta.env.BASE_URL}enterprise-hero/`} aria-label="МТС Ads — главная"><img src={mtsLogo} alt="МТС Ads" /></a>
          <nav className={`funnel-hero__navigation${isMenuOpen ? ' funnel-hero__navigation--open' : ''}`} id="funnel-hero-navigation" aria-label="Основная навигация">
            {navigationItems.map((item) => (
              <a className="funnel-hero__navigation-link" href={item.href ?? '#top'} key={item.label} onClick={() => setIsMenuOpen(false)}>
                {item.label}{item.hasChevron && <img src={chevronIcon} alt="" />}
              </a>
            ))}
          </nav>
          <ActionButton className="funnel-hero__header-button" size="medium">Запустить рекламу</ActionButton>
          <button className="funnel-hero__menu-button" type="button" aria-controls="funnel-hero-navigation" aria-expanded={isMenuOpen} aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'} onClick={() => setIsMenuOpen((open) => !open)}><span /><span /></button>
        </header>}

        <div className="funnel-hero__copy">
          <div>
            <h1 id="funnel-hero-title">Единое решение <strong>для продвижения бизнеса</strong> любого масштаба</h1>
            <p>Более 5 000 компаний доверяют продвижение <span>инструментам МТС ADS</span></p>
          </div>
        </div>

        <HeroCaseCarousel isReady={isReady} />
        <div className="hero-cards-hero__light hero-cards-hero__light--bottom" aria-hidden="true" />

        <div className="hero-cards-hero__footer">
          <ActionButton className="funnel-hero__cta">Запустить рекламу</ActionButton>
          <div className="funnel-hero__facts" aria-label="Преимущества MTS Ads">
            {facts.map((fact) => (
              <article className="funnel-hero__fact" key={fact.value}>
                <p className="funnel-hero__fact-value">{fact.value}{fact.unit && <span className="funnel-hero__fact-unit">{fact.unit}</span>}</p>
                <p className="funnel-hero__fact-text"><span className="funnel-hero__fact-text-accent">{fact.text}</span>{fact.detail && <>{fact.lineBreak ? <br /> : ' '}<span>{fact.detail}</span></>}</p>
                <p className="funnel-hero__fact-mobile-text">{fact.mobileText}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
