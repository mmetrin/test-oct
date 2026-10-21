import { useRef } from 'react'

import './FunnelHeroSection.css'
import { FunnelHeroVisual } from './FunnelHeroVisual'
import { FunnelHeroBackground } from './FunnelHeroBackground'
import { usePageReady } from '../../shared/lib/usePageReady'
import { ActionButton } from '../../shared/ui/action-button/ActionButton'

const facts = [
  { detail: 'от самого крупного оператора страны', mobileText: 'активной аудитории', text: 'активной аудитории', unit: 'млн', value: '65+' },
  { detail: 'для формирования сегмента', mobileText: 'характеристик аудитории для точной сегментации', text: 'параметров ЦА', value: '5 000' },
  { detail: 'сегментов', lineBreak: true, mobileText: 'уже готовых сегментов', text: 'уже готовых', value: '350' },
]

export function FunnelHeroSection() {
  const isReady = usePageReady()
  const videoRef = useRef(null)

  return (
    <section className={`funnel-hero${isReady ? ' funnel-hero--ready' : ''}`} id="top" aria-labelledby="funnel-hero-title">
      <FunnelHeroBackground videoRef={videoRef} />
      <div className="funnel-hero__inner">
        <div className="funnel-hero__copy">
          <div>
            <h1 id="funnel-hero-title">
              Единое решение <strong>для&nbsp;продвижения бизнеса</strong> любого масштаба
            </h1>
            <p>
              Более 5 000 компаний доверяют продвижение <span>инструментам МТС ADS</span>
            </p>
            <p className="funnel-hero__mobile-lead">
              Более 5 000 компаний доверяют продвижение инструментам МТС ADS
            </p>
          </div>

          <ActionButton className="funnel-hero__cta">Запустить рекламу с МТС ADS</ActionButton>
        </div>

        <FunnelHeroVisual videoRef={videoRef} />

        <div className="funnel-hero__facts" aria-label="Преимущества MTS Ads">
          {facts.map((fact) => (
            <article className="funnel-hero__fact" key={fact.value}>
              <p className="funnel-hero__fact-value">
                {fact.value}
                {fact.unit && <span className="funnel-hero__fact-unit">{fact.unit}</span>}
              </p>
              <p className="funnel-hero__fact-text">
                <span className="funnel-hero__fact-text-accent">{fact.text}</span>
                {fact.detail && (
                  <>
                    {fact.lineBreak ? <br /> : ' '}
                    <span>{fact.detail}</span>
                  </>
                )}
              </p>
              <p className="funnel-hero__fact-mobile-text">{fact.mobileText}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
