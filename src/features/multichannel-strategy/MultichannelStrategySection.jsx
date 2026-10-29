import { useId, useRef, useState } from 'react'
import orbit from '../../assets/figma/multichannel-strategy/orbit.svg'
import arrow from '../../assets/figma/multichannel-strategy/arrow.svg'
import { strategyChannels, strategySlots } from './channels'
import { useStrategyOrbit } from './useStrategyOrbit'
import { useProductRotation } from './useProductRotation'
import { StrategyAudience } from './StrategyAudience'
import './MultichannelStrategySection.css'

export function MultichannelStrategySection() {
  const [isExpanded, setIsExpanded] = useState(false)
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const channelRefs = useRef([])
  const id = useId()
  useStrategyOrbit(sectionRef, stageRef, channelRefs, setIsExpanded)
  const rotation = useProductRotation(stageRef, isExpanded, strategyChannels.length)

  return (
    <section className="strategy-section" id="multichannel-strategy" ref={sectionRef} aria-labelledby={`${id}-title`}>
      <div className="strategy-section__viewport">
        <header className="strategy-section__heading">
          <h2 id={`${id}-title`}>Соберём мультиканальную стратегию под вашу задачу и бюджет</h2>
          <p>Наш менеджер подберёт наиболее эффективный сплит каналов под вашу нишу и бюджет</p>
        </header>
        <div className="strategy-scene" ref={stageRef}>
          <div className="strategy-scene__orbit" aria-hidden="true">
            <img src={orbit} alt="" width="1051" height="468" />
            <svg className="strategy-scene__flow" viewBox="0 0 1051 468" preserveAspectRatio="none">
              <path className="strategy-scene__arc strategy-scene__arc--glow" pathLength="100" />
              <path className="strategy-scene__arc strategy-scene__arc--pink strategy-scene__arc--glow" pathLength="100" />
              <path className="strategy-scene__arc" pathLength="100" />
              <path className="strategy-scene__arc strategy-scene__arc--pink" pathLength="100" />
            </svg>
            {['one', 'two', 'three', 'four'].map((tone) => (
              <span key={tone} className={`strategy-scene__dot strategy-scene__dot--${tone}`} />
            ))}
          </div>
          <StrategyAudience isExpanded={isExpanded} cycle={rotation.cycle} />
          {strategySlots.map((slot, index) => (
            <div key={slot.id} ref={(element) => { channelRefs.current[index] = element }}
              className={`strategy-channel${isExpanded ? ' is-open' : ''}`}>
              <span className="strategy-channel__trigger" aria-hidden="true">
                <span className="strategy-channel__image"><img src={strategyChannels[index % strategyChannels.length].image} alt="" width="1254" height="1254" /></span>
              </span>
              <article className="strategy-channel__card" id={`${id}-${slot.id}`} aria-hidden={!isExpanded} inert={!isExpanded}>
                <span className="strategy-channel__surface" aria-hidden="true" />
                <div className="strategy-channel__window" data-rotating={rotation.previous !== null}>
                  {strategyChannels.map((product, productIndex) => {
                    const current = productIndex === (index + rotation.current) % strategyChannels.length
                    const previous = rotation.previous !== null && productIndex === (index + rotation.previous) % strategyChannels.length
                    return (
                      <div key={product.id} data-product={product.id}
                        className={`strategy-channel__product${current ? ' is-current' : ''}${previous ? ' is-previous' : ''}`}
                        aria-hidden={!current} inert={!current}>
                        <div className="strategy-channel__copy">
                          <div className="strategy-channel__text">
                            <h3>{product.title}</h3>
                            <p>{product.description}</p>
                          </div>
                        </div>
                        <a className="strategy-channel__link" href={product.href} aria-label={`Подробнее: ${product.title}`}>
                          <img src={arrow} alt="" width="20" height="20" />
                        </a>
                      </div>
                    )
                  })}
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
