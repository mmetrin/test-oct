import { useEffect, useRef } from 'react'

import { typographText } from '../../shared/lib/typographText'
import { formatStateFrames, formatTabs } from './formatSliderData'
import { useFormatSlider } from './useFormatSlider'

const FORMAT_TAB_ACTIVE_WIDTH = 356
const FORMAT_VIDEO_PLAYBACK_RATE = 0.85
const formatVisualFrames = formatStateFrames.filter(
  (stateFrame, index, frames) =>
    frames.findIndex((frame) => frame.tab === stateFrame.tab) === index,
)

function FormatTabs({
  activeTab,
  activeWidth,
  fillTab,
  isAutoplayPaused,
  onPauseAutoplay,
  onResumeAutoplay,
  onSelect,
}) {
  const activeTabConfig = formatTabs.find((tab) => tab.id === activeTab)

  return (
    <div
      className={`format-slider-section__tabs${isAutoplayPaused ? ' is-paused' : ''}`}
      role="tablist"
      aria-label="Форматы рекламы"
      onPointerEnter={onPauseAutoplay}
      onPointerLeave={onResumeAutoplay}
    >
      {formatTabs.map((tab) => (
        <button
          className={`format-slider-section__tab${tab.id === activeTab ? ' is-active' : ''}`}
          type="button"
          role="tab"
          aria-selected={tab.id === activeTab}
          onClick={() => onSelect(tab.id)}
          key={tab.id}
        >
          {tab.id === activeTab && (
            <span
              className={`format-slider-section__tab-active${fillTab ? ' is-filling' : ''}`}
              style={{
                '--format-tab-active-left': `${activeTabConfig?.activeLeft ?? 0}px`,
                '--format-tab-active-scale': activeWidth / FORMAT_TAB_ACTIVE_WIDTH,
              }}
              aria-hidden="true"
            />
          )}
          <span className="format-slider-section__tab-label">{typographText(tab.label)}</span>
        </button>
      ))}
    </div>
  )
}

function FormatDetails({ stateFrame }) {
  const descriptionParagraphs = Array.isArray(stateFrame.description)
    ? stateFrame.description
    : [stateFrame.description]

  return (
    <div className="format-slider-section__details">
      <div className="format-slider-section__eyebrow">
        {stateFrame.eyebrow.map((item) => (
          <span key={item}>{typographText(item)}</span>
        ))}
      </div>
      <div className="format-slider-section__copy">
        <h2>{typographText(stateFrame.title)}</h2>
        {descriptionParagraphs.map((paragraph) => (
          <p key={paragraph}>{typographText(paragraph)}</p>
        ))}
      </div>
      <ul className="format-slider-section__features">
        {stateFrame.bullets.map((bullet) => (
          <li key={bullet}>{typographText(bullet)}</li>
        ))}
      </ul>
    </div>
  )
}

function FormatVisual({ isActive, stateFrame }) {
  const videoRef = useRef(null)
  const reverseAnimationRef = useRef(null)
  const reverseStartedAtRef = useRef(null)

  useEffect(() => {
    if (!stateFrame.videoSrc) {
      return
    }

    if (reverseAnimationRef.current) {
      window.cancelAnimationFrame(reverseAnimationRef.current)
      reverseAnimationRef.current = null
    }

    reverseStartedAtRef.current = null

    const video = videoRef.current

    if (!video) {
      return
    }

    if (!isActive) {
      video.pause()
      video.currentTime = 0
      return
    }

    video.playbackRate = FORMAT_VIDEO_PLAYBACK_RATE
    video.currentTime = 0
    const playPromise = video.play()

    if (playPromise) {
      playPromise.catch(() => {})
    }

    return () => {
      if (reverseAnimationRef.current) {
        window.cancelAnimationFrame(reverseAnimationRef.current)
      }
    }
  }, [isActive, stateFrame.videoSrc])

  function playForwardFromStart(video) {
    reverseAnimationRef.current = null
    reverseStartedAtRef.current = null
    video.playbackRate = FORMAT_VIDEO_PLAYBACK_RATE
    video.currentTime = 0

    const playPromise = video.play()

    if (playPromise) {
      playPromise.catch(() => {})
    }
  }

  function playReverseFrame(timestamp) {
    const video = videoRef.current

    if (!video) {
      return
    }

    if (!reverseStartedAtRef.current) {
      reverseStartedAtRef.current = timestamp
    }

    const duration = video.duration
    const elapsedSeconds =
      ((timestamp - reverseStartedAtRef.current) / 1000) * FORMAT_VIDEO_PLAYBACK_RATE
    const nextTime = Math.max(duration - elapsedSeconds, 0)

    video.currentTime = nextTime

    if (nextTime <= 0) {
      playForwardFromStart(video)
      return
    }

    reverseAnimationRef.current = window.requestAnimationFrame(playReverseFrame)
  }

  function handleVideoEnded() {
    const video = videoRef.current

    if (!video || !isActive) {
      return
    }

    const duration = video.duration

    if (!Number.isFinite(duration) || duration <= 0) {
      playForwardFromStart(video)
      return
    }

    video.pause()
    video.currentTime = duration
    reverseStartedAtRef.current = null
    reverseAnimationRef.current = window.requestAnimationFrame(playReverseFrame)
  }

  if (!stateFrame.videoSrc) {
    return (
      <div
        className="format-slider-section__row-placeholder"
        style={{ '--format-placeholder-color': stateFrame.placeholderColor }}
        aria-label={stateFrame.label}
      />
    )
  }

  return (
    <div
      className={`format-slider-section__visual format-slider-section__visual--${stateFrame.tab}`}
      aria-label={stateFrame.label}
    >
      <video
        className="format-slider-section__visual-video"
        src={stateFrame.videoSrc}
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnded}
        ref={videoRef}
        aria-hidden="true"
      />
      <img
        className="format-slider-section__visual-overlay"
        src={stateFrame.overlaySrc}
        alt=""
        aria-hidden="true"
      />
    </div>
  )
}

export function FormatSliderSection() {
  const {
    activeState,
    contentTransitionDuration,
    currentTransition,
    handleTabSelect,
    isAutoplayPaused,
    pauseAutoplay,
    resumeAutoplay,
    sectionRef,
    selectedTab,
  } = useFormatSlider()
  const activeStateFrame = formatStateFrames[activeState]
  const transitionStyles = {
    '--format-transition-duration': `${currentTransition?.duration ?? 0}ms`,
    '--format-content-transition-duration': `${contentTransitionDuration}ms`,
    '--format-content-transition-easing': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    '--format-transition-easing': currentTransition?.easing ?? 'ease',
    '--format-tab-transition-duration': `${currentTransition?.duration ?? 0}ms`,
  }

  return (
    <section
      id="formats"
      className="format-slider-section scroll-reveal"
      aria-label="Форматы видеорекламы MTS Ads"
      ref={sectionRef}
    >
      <div className="format-slider-section__stage">
        <div className="format-slider-section__layout">
          <div className="format-slider-section__header">
            <h1 className="format-slider-section__title">
              {typographText('Ваша реклама с МТС ADS — больше, чем обычный видеоролик')}
            </h1>
            <a className="premium-video-button format-slider-section__button" href="#lead-form">
              Подобрать формат
            </a>
          </div>
          <div className="format-slider-section__content" style={transitionStyles}>
          <FormatTabs
            activeTab={selectedTab}
            activeWidth={
              activeStateFrame.tab === selectedTab
                ? activeStateFrame.activeWidth
                : FORMAT_TAB_ACTIVE_WIDTH
            }
            fillTab={
              activeStateFrame.tab === selectedTab ? activeStateFrame.fillTab : false
            }
            isAutoplayPaused={isAutoplayPaused}
            onPauseAutoplay={pauseAutoplay}
            onResumeAutoplay={resumeAutoplay}
            onSelect={handleTabSelect}
          />
          <div className="format-slider-section__slides">
            <div className="format-slider-section__visual-stack">
              {formatVisualFrames.map((stateFrame) => (
                <div
                  className={`format-slider-section__visual-state${
                    stateFrame.tab === activeStateFrame.tab ? ' is-active' : ''
                  }`}
                  aria-hidden={stateFrame.tab !== activeStateFrame.tab}
                  key={`${stateFrame.id}-visual`}
                >
                  <FormatVisual
                    isActive={stateFrame.tab === activeStateFrame.tab}
                    stateFrame={stateFrame}
                  />
                </div>
              ))}
            </div>
            <div className="format-slider-section__details-stack">
              {formatStateFrames.map((stateFrame, index) => (
                <article
                  className={`format-slider-section__details-state${
                    index === activeState ? ' is-active' : ''
                  }`}
                  aria-hidden={index !== activeState}
                  inert={index !== activeState ? true : undefined}
                  key={`${stateFrame.id}-details`}
                >
                  <FormatDetails stateFrame={stateFrame} />
                </article>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}
