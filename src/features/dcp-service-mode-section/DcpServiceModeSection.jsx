import { useEffect, useRef, useState } from 'react'

import expertChatImage from '../../assets/figma/dcp/service-mode/expert-chat.png'
import fullServiceVideo from '../../assets/figma/dcp/service-mode/full.mov?url'
import fullServiceImage from '../../assets/figma/dcp/service-mode/full.png'
import selfServiceVideo from '../../assets/figma/dcp/service-mode/self.mov?url'
import selfServiceImage from '../../assets/figma/dcp/service-mode/self.png'
import { ActionButton } from '../../shared/ui/action-button/ActionButton'
import './DcpServiceModeSection.css'

const FULL_SERVICE_PLAYBACK_RATE = 0.95

const serviceModes = [
  {
    id: 'full',
    label: 'Full-service',
    title: 'Доверьте запуски нашей команде экспертов',
    description: 'Настроим размещение, запустим, проконтролируем и доведем до результата.',
    price: 'От 300 000 ₽',
    cta: 'Получить консультацию',
    video: fullServiceVideo,
    image: fullServiceImage,
  },
  {
    id: 'self',
    label: 'Self-service',
    title: 'Управляйте кампаниями самостоятельно',
    description: 'Личный кабинет, аналитика и управление кампаниями в одном месте',
    cta: 'Получить доступ',
    video: selfServiceVideo,
    image: selfServiceImage,
  },
]

export function DcpServiceModeSection() {
  const sectionRef = useRef(null)
  const fullVideoRef = useRef(null)
  const selfVideoRef = useRef(null)
  const [activeModeIndex, setActiveModeIndex] = useState(0)
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false)
  const [isSequenceComplete, setIsSequenceComplete] = useState(false)
  const activeMode = serviceModes[activeModeIndex]

  useEffect(() => {
    const section = sectionRef.current

    if (!section) {
      return undefined
    }

    if (!('IntersectionObserver' in window)) {
      setHasEnteredViewport(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return
        }

        setHasEnteredViewport(true)
        observer.disconnect()
      },
      { threshold: 0.3 },
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!hasEnteredViewport || isSequenceComplete) {
      return undefined
    }

    const activeVideo = activeModeIndex === 0 ? fullVideoRef.current : selfVideoRef.current
    const inactiveVideo = activeModeIndex === 0 ? selfVideoRef.current : fullVideoRef.current

    inactiveVideo?.pause()
    if (activeVideo) {
      activeVideo.playbackRate = activeModeIndex === 0 ? FULL_SERVICE_PLAYBACK_RATE : 1
    }
    activeVideo?.play().catch(() => {})

    return undefined
  }, [activeModeIndex, hasEnteredViewport, isSequenceComplete])

  useEffect(
    () => () => {
      fullVideoRef.current?.pause()
      selfVideoRef.current?.pause()
    },
    [],
  )

  function handleVideoEnded(modeId) {
    if (isSequenceComplete || modeId !== activeMode.id) {
      return
    }

    if (modeId === 'full') {
      setActiveModeIndex(1)
      return
    }

    setActiveModeIndex(0)
    setIsSequenceComplete(true)
  }

  function handleModeChange(index) {
    if (index === activeModeIndex) {
      return
    }

    if (!isSequenceComplete) {
      const selectedVideo = index === 0 ? fullVideoRef.current : selfVideoRef.current
      if (selectedVideo) {
        selectedVideo.currentTime = 0
      }
    }

    setActiveModeIndex(index)
  }

  return (
    <section
      className={`dcp-service-mode${isSequenceComplete ? ' is-sequence-complete' : ''}`}
      ref={sectionRef}
      aria-labelledby="dcp-service-mode-title"
    >
      <h2 className="dcp-service-mode__title" id="dcp-service-mode-title">
        Управляйте сами или <span>доверьте нам</span>
      </h2>

      <div className={`dcp-service-mode__card is-${activeMode.id}`}>
        <div className="dcp-service-mode__video-layer" aria-hidden="true">
          {serviceModes.map((mode) => (
            <div key={mode.id}>
              <video
                className={`dcp-service-mode__video dcp-service-mode__video--${mode.id}${
                  !isSequenceComplete && mode.id === activeMode.id ? ' is-active' : ''
                }`}
                src={mode.video}
                poster={mode.image}
                ref={mode.id === 'full' ? fullVideoRef : selfVideoRef}
                muted
                playsInline
                preload="none"
                onEnded={() => handleVideoEnded(mode.id)}
              />
              <img
                className={`dcp-service-mode__static-image dcp-service-mode__static-image--${mode.id}${
                  isSequenceComplete && mode.id === activeMode.id ? ' is-active' : ''
                }`}
                src={mode.image}
                alt=""
              />
            </div>
          ))}
        </div>

        <div className="dcp-service-mode__shade" />

        <div className="dcp-service-mode__content">
          <div className="dcp-service-mode__segments" role="tablist" aria-label="Формат управления">
            {serviceModes.map((mode, index) => {
              const isActive = index === activeModeIndex

              return (
                <button
                  className={`dcp-service-mode__segment${isActive ? ' is-active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  key={mode.id}
                  onClick={() => handleModeChange(index)}
                >
                  {mode.label}
                </button>
              )
            })}
          </div>

          <div className="dcp-service-mode__copy" role="tabpanel" key={activeMode.id}>
            <div className="dcp-service-mode__text">
              <h3>{activeMode.title}</h3>
              <p>
                {activeMode.description}
                {activeMode.price && <strong> {activeMode.price}</strong>}
              </p>
            </div>

            <ActionButton className="dcp-service-mode__button">{activeMode.cta}</ActionButton>
          </div>
        </div>

        <img
          className={`dcp-service-mode__expert-chat${activeMode.id === 'full' ? ' is-active' : ''}`}
          src={expertChatImage}
          alt=""
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
