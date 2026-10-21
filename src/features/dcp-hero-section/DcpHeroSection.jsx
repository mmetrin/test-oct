import { useEffect, useState } from 'react'

import chevronDown from '../../assets/figma/dcp/chevron-down.svg'
import analyticsFrame0 from '../../assets/figma/dcp/hero-slider/analytics/img-0.png'
import analyticsFrame1 from '../../assets/figma/dcp/hero-slider/analytics/img-1.png'
import analyticsFrame2 from '../../assets/figma/dcp/hero-slider/analytics/img-2.png'
import heroBackgroundVideo from '../../assets/figma/dcp/hero-background.mp4'
import formatsFrame0 from '../../assets/figma/dcp/hero-slider/formats/img-0.png'
import formatsFrame1 from '../../assets/figma/dcp/hero-slider/formats/img-1.png'
import formatsFrame2 from '../../assets/figma/dcp/hero-slider/formats/img-2.png'
import mtsLogo from '../../../logos/main-mts.svg'
import optimizationFrame0 from '../../assets/figma/dcp/hero-slider/optimization/img-0.png'
import optimizationFrame1 from '../../assets/figma/dcp/hero-slider/optimization/img-1.png'
import optimizationFrame2 from '../../assets/figma/dcp/hero-slider/optimization/img-2.png'
import { ActionButton } from '../../shared/ui/action-button/ActionButton'
import './DcpHeroSection.css'

const navigationItems = ['Решения', 'Платформы', 'Медиа', 'Контакты']
const SLIDE_INTERVAL_MS = 3200
const FRAME_STEP_DELAY_MS = 500
const FRAME_TRANSITION_MS = 800
const INTERMEDIATE_FRAME_TRANSITION_MS = 380

const heroSlides = [
  {
    id: 'optimization',
    title: 'Гибкие стратегии оптимизации под\u00a0ваши\u00a0KPI',
    frames: [optimizationFrame0, optimizationFrame1, optimizationFrame2],
  },
  {
    id: 'analytics',
    title: 'Прозрачная аналитика и гибкие модели закупки',
    frames: [analyticsFrame0, analyticsFrame1, analyticsFrame2],
  },
  {
    id: 'formats',
    title: 'Широкий выбор форматов и рекламных площадок',
    frames: [formatsFrame0, formatsFrame1, formatsFrame2],
  },
]

function DcpLogo() {
  return (
    <a className="dcp-hero__logo" href={`${import.meta.env.BASE_URL}enterprise-hero/`} aria-label="МТС Ads — главная">
      <img src={mtsLogo} alt="МТС Ads" />
    </a>
  )
}

function DcpHeader() {
  return (
    <header className="dcp-hero__header">
      <DcpLogo />

      <nav className="dcp-hero__navigation" aria-label="Основная навигация">
        {navigationItems.map((item) => (
          <a className="dcp-hero__navigation-link" href="#top" key={item}>
            {item}
            {item === 'Решения' && <img src={chevronDown} alt="" />}
          </a>
        ))}
      </nav>

          <ActionButton className="dcp-hero__header-button" size="medium">
        Запустить рекламу
      </ActionButton>
    </header>
  )
}

export function DcpHeroSection({ showHeader = true }) {
  const [visibleSlideIndex, setVisibleSlideIndex] = useState(0)
  const [visibleFrameIndex, setVisibleFrameIndex] = useState(0)
  const [incomingFrame, setIncomingFrame] = useState(null)
  const [isIncomingVisible, setIsIncomingVisible] = useState(false)
  const visibleSlide = heroSlides[visibleSlideIndex]
  const titleSlideIndex = incomingFrame?.slideIndex ?? visibleSlideIndex
  const activeSlide = heroSlides[titleSlideIndex]

  useEffect(() => {
    heroSlides.flatMap((slide) => slide.frames).forEach((frameSource) => {
      const image = new Image()
      image.src = frameSource
    })
  }, [])

  useEffect(() => {
    if (incomingFrame) {
      return undefined
    }

    const isFinalFrame = visibleFrameIndex === visibleSlide.frames.length - 1
    const timeoutId = window.setTimeout(() => {
      const nextSlideIndex = isFinalFrame ? (visibleSlideIndex + 1) % heroSlides.length : visibleSlideIndex
      const nextFrameIndex = isFinalFrame ? 0 : visibleFrameIndex + 1

      setIncomingFrame({ slideIndex: nextSlideIndex, frameIndex: nextFrameIndex })
    }, isFinalFrame ? SLIDE_INTERVAL_MS : FRAME_STEP_DELAY_MS)

    return () => window.clearTimeout(timeoutId)
  }, [incomingFrame, visibleFrameIndex, visibleSlide, visibleSlideIndex])

  useEffect(() => {
    if (!incomingFrame) {
      return undefined
    }

    let secondAnimationFrameId
    let transitionTimeoutId
    const isIntermediateFrame = incomingFrame.frameIndex === 1
    const transitionDuration = isIntermediateFrame
      ? INTERMEDIATE_FRAME_TRANSITION_MS
      : FRAME_TRANSITION_MS
    const animationFrameId = window.requestAnimationFrame(() => {
      secondAnimationFrameId = window.requestAnimationFrame(() => {
        setIsIncomingVisible(true)
        transitionTimeoutId = window.setTimeout(() => {
          setVisibleSlideIndex(incomingFrame.slideIndex)
          setVisibleFrameIndex(incomingFrame.frameIndex)
          setIncomingFrame(null)
          setIsIncomingVisible(false)
        }, transitionDuration)
      })
    })

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      if (secondAnimationFrameId) {
        window.cancelAnimationFrame(secondAnimationFrameId)
      }
      if (transitionTimeoutId) {
        window.clearTimeout(transitionTimeoutId)
      }
    }
  }, [incomingFrame])

  return (
    <section
      className="dcp-hero"
      id="top"
      aria-labelledby={`dcp-hero-title-${activeSlide.id}`}
    >
      <div className="dcp-hero__video-stage" aria-hidden="true">
        <div className="dcp-hero__video-canvas">
          <div className="dcp-hero__video-align">
            <video
              className="dcp-hero__background-video"
              src={heroBackgroundVideo}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
          </div>
          <div className="dcp-hero__video-fade dcp-hero__video-fade--side" />
          <div className="dcp-hero__video-fade dcp-hero__video-fade--bottom" />
        </div>
      </div>

      <div className="dcp-hero__inner">
        {showHeader && <DcpHeader />}

        <div className="dcp-hero__copy">
          <div className="dcp-hero__heading">
            <div className="dcp-hero__eyebrow">
              <p>МТС DSP</p>
              <p>Programmatic-платформа для рекламодателей и агентств</p>
            </div>
            <div className="dcp-hero__title-stage">
              {heroSlides.map((slide, index) => {
                const isActive = index === titleSlideIndex

                return (
                  <h1
                    className={`dcp-hero__slide-title${index === titleSlideIndex ? ' is-active' : ''}`}
                    id={`dcp-hero-title-${slide.id}`}
                    key={slide.id}
                    aria-hidden={!isActive}
                  >
                    {slide.title}
                  </h1>
                )
              })}
            </div>
          </div>

          <ActionButton className="dcp-hero__cta">Обсудить рекламную кампанию</ActionButton>
        </div>

        <div className="dcp-hero__visual-stage">
          <img
            className={`dcp-hero__frame-image${incomingFrame && isIncomingVisible ? ' is-exiting' : ''}`}
            src={visibleSlide.frames[visibleFrameIndex]}
            alt=""
            aria-hidden="true"
          />
          {incomingFrame && (
            <img
              className={`dcp-hero__frame-image dcp-hero__frame-image--incoming${
                isIncomingVisible ? ' is-visible' : ''
              }${incomingFrame.frameIndex === 1 ? ' is-intermediate' : ''}`}
              src={heroSlides[incomingFrame.slideIndex].frames[incomingFrame.frameIndex]}
              alt=""
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </section>
  )
}
