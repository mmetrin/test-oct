import { useEffect, useRef, useState } from 'react'

import lightFunnelImage from '../../assets/figma/main-enterprises/sales-funnel.png'
import updatedFunnelImage from '../../assets/enterprise-hero/sales-funnel-full.png'
import updatedFunnelBackground from '../../assets/figma/main-enterprises/funnel-bg-2x.png'
import { useRevealOnVisible } from '../../shared/lib/useRevealOnVisible'
import designBackground from '../../assets/figma/enterprise-funnel/funnel-bg.svg'
import { FunnelDesignArtwork } from './FunnelDesignArtwork'
import { FunnelCaseCards } from './FunnelCaseCards'

const stages = ['Охваты', 'Интерес', 'Продажи', 'Реактивация']

const defaultInstruments = ['Каскадная реклама', 'Telegram Ads', 'Конструктор чат-ботов']

const contentSteps = [
  {
    title: 'Строим знание о бренде',
    description:
      'Повышайте узнаваемость, растите охваты и присутствие бренда',
    instruments: ['Telegram Ads', 'Программатик-реклама', 'СМС- и ММС-рассылки', 'CPA-сеть'],
  },
  {
    title: 'Превратим внимание в спрос',
    description: 'Повышайте конверсию в обращение и увеличивайте количество запросов',
    instruments: defaultInstruments,
  },
  {
    title: 'Доведём до решения о покупке',
    description: 'Повышайте конверсию в покупку и сокращайте время закрытия сделки',
    instruments: defaultInstruments,
  },
  {
    title: 'Превратим покупку в привычку',
    description: 'Возвращайте клиентов, увеличивайте число повторных покупок и снижайте затраты на привлечение',
    instruments: defaultInstruments,
  },
]

export function FunnelStageSection({ onTransitionChange, updatedVisual = false, scrollDriven = true, showBackground = true, designLayout = false }) {
  const sectionRef = useRef(null)
  const sceneRef = useRef(null)
  const stagesRef = useRef(null)
  const transitionRef = useRef('idle')
  const { elementRef: revealRef, isVisible: isSceneVisible } = useRevealOnVisible({
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px',
  })
  const [activeStep, setActiveStep] = useState(0)
  const [displayedStep, setDisplayedStep] = useState(0)
  const [isContentLeaving, setIsContentLeaving] = useState(false)
  const [isNextPreviewVisible, setIsNextPreviewVisible] = useState(false)
  const content = contentSteps[displayedStep]

  useEffect(() => {
    if (activeStep === displayedStep) {
      setIsContentLeaving(false)
      return undefined
    }

    setIsContentLeaving(true)

    const contentTimer = window.setTimeout(() => {
      setDisplayedStep(activeStep)
      setIsContentLeaving(false)
    }, 460)

    return () => window.clearTimeout(contentTimer)
  }, [activeStep, displayedStep])

  useEffect(() => {
    if (!scrollDriven) return undefined

    let frame = 0

    function updateStep() {
      frame = 0
      const section = sectionRef.current
      const scene = sceneRef.current

      if (!section || !scene) {
        return
      }

      const scrollDistance = section.offsetHeight - scene.offsetHeight
      const sceneTop = Number.parseFloat(window.getComputedStyle(scene).top) || 0
      const sectionTop = section.getBoundingClientRect().top
      const hasStickyScrollStarted = sectionTop <= sceneTop
      const progress = Math.min(
        1,
        Math.max(0, scrollDistance > 0 ? (sceneTop - sectionTop) / scrollDistance : 0),
      )
      const nextTransition = progress >= 0.995 ? 'complete' : hasStickyScrollStarted ? 'preview' : 'idle'

      if (designLayout) {
        const stageProgress = progress * contentSteps.length
        stagesRef.current?.querySelectorAll('.funnel-stage-section__stage-underline').forEach((line, index) => {
          const fill = Math.min(1, Math.max(0, stageProgress - index))
          line.style.setProperty('--funnel-line-progress', String(Math.max(0.04, fill)))
        })
      }

      setActiveStep(Math.min(contentSteps.length - 1, Math.floor(progress * contentSteps.length)))
      setIsNextPreviewVisible(nextTransition === 'preview')

      if (transitionRef.current !== nextTransition) {
        transitionRef.current = nextTransition
        onTransitionChange?.(nextTransition)
      }
    }

    function queueUpdate() {
      if (!frame) frame = window.requestAnimationFrame(updateStep)
    }

    updateStep()

    window.addEventListener('scroll', queueUpdate, { passive: true })
    window.addEventListener('resize', queueUpdate)

    return () => {
      window.removeEventListener('scroll', queueUpdate)
      window.removeEventListener('resize', queueUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [designLayout, onTransitionChange, scrollDriven])

  return (
    <section className="funnel-stage-section" ref={sectionRef} aria-labelledby="funnel-stage-title">
      <div
        className="funnel-stage-section__scene"
        ref={(element) => {
          sceneRef.current = element
          revealRef.current = element
        }}
      >
        {!designLayout && updatedVisual && showBackground && <img className="funnel-stage-section__background" src={updatedFunnelBackground} alt="" aria-hidden="true" />}
        {!designLayout && updatedVisual && <img className="funnel-stage-section__funnel-export" src={updatedFunnelImage} alt="" aria-hidden="true" />}
        {designLayout && <div className="funnel-stage-section__design-background" aria-hidden="true"><img src={designBackground} alt="" /></div>}
        <div className={`funnel-stage-section__container funnel-stage-section__container--reveal${isSceneVisible ? ' is-visible' : ''}`}>
          <div className="funnel-stage-section__visual" aria-label="Этапы воронки">
            {designLayout && <FunnelDesignArtwork />}
            {!updatedVisual && <div className="funnel-stage-section__funnel-frame">
              <img className="funnel-stage-section__funnel" src={lightFunnelImage} alt="" />
            </div>}
            <ol className="funnel-stage-section__stages" ref={stagesRef}>
              {stages.map((stage, index) => (
                <li className={index === activeStep ? 'is-active' : ''} key={stage}>
                  <span className="funnel-stage-section__stage-label">
                    <span>{stage}</span>
                    {(designLayout || index === activeStep) && (
                      <span className="funnel-stage-section__stage-underline" aria-hidden="true">
                        {designLayout && <span className="funnel-stage-section__stage-underline-fill" />}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="funnel-stage-section__content">
            <h1 id="funnel-stage-title">
              Работаем на&nbsp;всех этапах воронки
            </h1>

            <div
              className={`funnel-stage-section__dynamic-content${isContentLeaving ? ' is-leaving' : ''}`}
              key={displayedStep}
            >
              <div className="funnel-stage-section__description">
                <h2>{content.title}</h2>
                <p>{content.description}</p>
              </div>

              <div className="funnel-stage-section__cases" aria-label="Кейсы клиентов">
                <FunnelCaseCards stage={displayedStep} designLayout={designLayout} />
              </div>

              <div className="funnel-stage-section__channels" aria-label="Инструменты рекламы">
                {content.instruments.map((instrument) => (
                  <span className="funnel-stage-section__chip" key={instrument}>{instrument}</span>
                ))}
                <span className="funnel-stage-section__channels-more">ещё {displayedStep === 0 ? '4' : '5'}</span>
              </div>
            </div>

            <button className="funnel-stage-section__button" type="button">
              <span>Обсудить рекламную кампанию</span>
            </button>
          </div>
        </div>

        {designLayout ? (
          <div className={`funnel-stage-section__big-data-preview${isNextPreviewVisible ? ' is-visible' : ''}`} aria-hidden="true">
            <span>тут биг дата</span>
          </div>
        ) : (
          <div className={`funnel-stage-section__next-preview${isNextPreviewVisible ? ' is-visible' : ''}`} aria-hidden="true">
            <span>Анализируем больше данных —</span>
            <strong>точнее находим ваших клиентов</strong>
          </div>
        )}
      </div>
    </section>
  )
}
