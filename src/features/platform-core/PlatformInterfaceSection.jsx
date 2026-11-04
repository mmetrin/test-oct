import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { platformInterfaceSlides as slides } from './platformInterfaceSlides'
import './PlatformInterfaceSection.css'

const SLIDE_DURATION = 6500

export function PlatformInterfaceSection() {
  const sectionRef = useRef(null)
  const tabsRef = useRef(null)
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [paused, setPaused] = useState(false)
  const [interacting, setInteracting] = useState(false)
  const [focused, setFocused] = useState(false)
  const [indicator, setIndicator] = useState({ left: 4, width: 0 })
  const playing = inView && pageVisible && !reducedMotion && !paused && !interacting && !focused

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReducedMotion(motionQuery.matches)
    const updateVisibility = () => setPageVisible(!document.hidden)
    // Measure the rendered viewport coordinates, including the desktop canvas's CSS zoom.
    let visibilityFrame = null
    const updateInView = () => {
      visibilityFrame = null
      const rect = sectionRef.current.getBoundingClientRect()
      const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 80)
      setInView(visibleHeight > Math.min(rect.height, window.innerHeight) * 0.3)
    }
    const queueVisibilityCheck = () => {
      if (visibilityFrame === null) visibilityFrame = window.requestAnimationFrame(updateInView)
    }
    updateInView()
    updateMotion()
    updateVisibility()
    window.addEventListener('scroll', queueVisibilityCheck, { passive: true })
    window.addEventListener('resize', queueVisibilityCheck)
    motionQuery.addEventListener('change', updateMotion)
    document.addEventListener('visibilitychange', updateVisibility)
    return () => {
      window.cancelAnimationFrame(visibilityFrame)
      window.removeEventListener('scroll', queueVisibilityCheck)
      window.removeEventListener('resize', queueVisibilityCheck)
      motionQuery.removeEventListener('change', updateMotion)
      document.removeEventListener('visibilitychange', updateVisibility)
    }
  }, [])

  useEffect(() => {
    if (!playing) return
    const timeout = window.setTimeout(() => setActive((index) => (index + 1) % slides.length), SLIDE_DURATION)
    return () => window.clearTimeout(timeout)
  }, [active, playing])

  useLayoutEffect(() => {
    const tabs = tabsRef.current
    const updateIndicator = () => {
      const tab = tabs.querySelector('[aria-selected="true"]')
      setIndicator({ left: tab.offsetLeft, width: tab.offsetWidth })
    }
    updateIndicator()
    const observer = new ResizeObserver(updateIndicator)
    observer.observe(tabs)
    return () => observer.disconnect()
  }, [active])

  const handleTabKey = (event) => {
    let next
    if (event.key === 'ArrowRight') next = (active + 1) % slides.length
    if (event.key === 'ArrowLeft') next = (active - 1 + slides.length) % slides.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = slides.length - 1
    if (next === undefined) return
    event.preventDefault()
    setActive(next)
    tabsRef.current.querySelectorAll('[role="tab"]')[next].focus()
  }

  return <section className="platform-interface" id="interface" aria-labelledby="platform-interface-title" ref={sectionRef}
    data-autoplay={playing ? 'playing' : reducedMotion ? 'reduced-motion' : paused ? 'paused' : !inView ? 'out-of-view' : !pageVisible ? 'hidden' : interacting ? 'hover' : 'focus'}>
    <div className="platform-sections__heading">
      <h2 id="platform-interface-title">Бесшовное управление<br />и умный пульт запусков РК</h2>
    </div>
    <div className="platform-interface__carousel" onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}>
      <div className="platform-interface__tabs" role="tablist" aria-label="Возможности интерфейса" ref={tabsRef}
        onFocus={() => setFocused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
        <span className="platform-interface__indicator" style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }} aria-hidden="true" />
        {slides.map((slide, index) => <button type="button" key={slide.id} role="tab" id={`platform-tab-${slide.id}`}
          aria-controls={`platform-panel-${slide.id}`} aria-selected={active === index} tabIndex={active === index ? 0 : -1}
          onClick={() => setActive(index)} onKeyDown={handleTabKey}>{slide.label}</button>)}
      </div>
      <div className="platform-interface__stage" aria-live={playing ? 'off' : 'polite'}>
        {slides.map((slide, index) => <div key={slide.id} className={`platform-interface__slide${active === index ? ' is-active' : ''}`}
          id={`platform-panel-${slide.id}`} role="tabpanel" aria-labelledby={`platform-tab-${slide.id}`} aria-hidden={active !== index} inert={active !== index}>
          <div className={`platform-interface__screen platform-interface__screen--${slide.id}`}>
            <img src={slide.screen} alt={`Интерфейс МТС Маркетолог: ${slide.label.toLowerCase()}`} decoding="async" loading="lazy" />
          </div>
          <article className="platform-interface__card">
            <img src={slide.illustration} alt="" width="480" height="170" loading="lazy" decoding="async" />
            <div className="platform-interface__copy"><h3>{slide.title}</h3><p>{slide.description}</p></div>
          </article>
        </div>)}
        {!reducedMotion && <button className="platform-interface__playback" type="button" onClick={() => setPaused((value) => !value)}
          aria-label={paused ? 'Продолжить смену слайдов' : 'Приостановить смену слайдов'} aria-pressed={paused}>
          <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
            {paused ? <path d="M7 5.5c0-1 1-1.5 1.8-1l11 6.3c.9.5.9 1.9 0 2.4l-11 6.3c-.8.5-1.8 0-1.8-1Z" fill="currentColor" /> : <><rect x="6" y="5" width="4" height="14" rx="1.5" fill="currentColor" /><rect x="14" y="5" width="4" height="14" rx="1.5" fill="currentColor" /></>}
          </svg>
        </button>}
      </div>
    </div>
  </section>
}
