import { useLayoutEffect, useRef, useState } from 'react'
import playIcon from '../../assets/platform-core/videos/play.svg'
import { platformInterfaceSlides as slides } from './platformInterfaceSlides'
import './PlatformInterfaceSection.css'

export function PlatformInterfaceSection() {
  const tabsRef = useRef(null)
  const videoRef = useRef(null)
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [indicator, setIndicator] = useState({ left: 4, width: 0 })
  const slide = slides[active]

  useLayoutEffect(() => {
    const tabs = tabsRef.current
    const updateIndicator = () => {
      const tab = tabs.querySelector('[aria-selected="true"]')
      if (tab) setIndicator({ left: tab.offsetLeft, width: tab.offsetWidth })
    }
    updateIndicator()
    const observer = new ResizeObserver(updateIndicator)
    observer.observe(tabs)
    return () => observer.disconnect()
  }, [active])

  const selectTab = (index) => {
    if (index === active) return
    videoRef.current?.pause()
    setPlaying(false)
    setActive(index)
  }

  const handleTabKey = (event) => {
    let next
    if (event.key === 'ArrowRight') next = (active + 1) % slides.length
    if (event.key === 'ArrowLeft') next = (active - 1 + slides.length) % slides.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = slides.length - 1
    if (next === undefined) return
    event.preventDefault()
    selectTab(next)
    tabsRef.current.querySelectorAll('[role="tab"]')[next].focus()
  }

  const startVideo = () => {
    const video = videoRef.current
    if (!video) return
    setPlaying(true)
    video.play().catch(() => setPlaying(false))
  }

  const resetVideo = () => {
    if (videoRef.current) videoRef.current.currentTime = 0
    setPlaying(false)
  }

  return <section className="platform-interface" id="interface" aria-labelledby="platform-interface-title">
    <div className="platform-sections__heading">
      <h2 id="platform-interface-title">Бесшовное управление<br />и умный пульт запусков кампании</h2>
    </div>
    <div className="platform-interface__carousel">
      <div className="platform-interface__tabs" role="tablist" aria-label="Возможности интерфейса" ref={tabsRef}>
        <span className="platform-interface__indicator" style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }} aria-hidden="true" />
        {slides.map((item, index) => <button type="button" key={item.id} role="tab" id={`platform-tab-${item.id}`}
          aria-controls="platform-interface-panel" aria-selected={active === index} tabIndex={active === index ? 0 : -1}
          onClick={() => selectTab(index)} onKeyDown={handleTabKey}>{item.label}</button>)}
      </div>
      <div className="platform-interface__stage" id="platform-interface-panel" role="tabpanel" aria-labelledby={`platform-tab-${slide.id}`}>
        <div className={`platform-interface__screen${playing ? ' is-playing' : ''}`}>
          <video key={slide.id} ref={videoRef} src={slide.video} controls={playing} playsInline preload="metadata"
            aria-label={`Видео: ${slide.label}`} onEnded={resetVideo} />
          {!playing && <>
            <img className="platform-interface__poster" src={slide.cover} alt="" />
            <button className="platform-interface__playback" type="button" onClick={startVideo}
              aria-label={`Воспроизвести видео «${slide.label}»`}>
              <img src={playIcon} alt="" width="30" height="30" />
            </button>
          </>}
        </div>
        <article className="platform-interface__card">
          <h3 aria-label={slide.title}>{slide.titleLines[0]}<br />{slide.titleLines[1]}</h3>
          <p>{slide.description}</p>
        </article>
      </div>
    </div>
  </section>
}
