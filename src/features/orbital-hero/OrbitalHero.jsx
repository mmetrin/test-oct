import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import { orbitalConfig } from './orbitalConfig'
import { OrbitalHeroFacts } from './OrbitalHeroFacts'
import '../../shared/ui/action-button/ActionButton.css'
import './OrbitalHero.css'

const OrbitalScene = lazy(() => import('./OrbitalScene').then((module) => ({ default: module.OrbitalScene })))

function SceneFallback({ loading = false }) {
  return <div className="orbital-hero__fallback" role="status">
    {loading ? 'Загрузка 3D-композиции…' : 'Для просмотра 3D-композиции включите WebGL в браузере.'}
  </div>
}

class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <SceneFallback /> : this.props.children }
}

export function OrbitalHero() {
  const heroRef = useRef(null)
  const pointer = useRef({ x: 0, y: 0 })
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReducedMotion(query.matches)
    query.addEventListener('change', updateMotion)
    let inViewport = true
    const updateVisibility = () => setVisible(inViewport && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting
      updateVisibility()
    })
    observer.observe(heroRef.current)
    document.addEventListener('visibilitychange', updateVisibility)
    updateVisibility()
    return () => {
      query.removeEventListener('change', updateMotion)
      document.removeEventListener('visibilitychange', updateVisibility)
      observer.disconnect()
    }
  }, [])

  const updatePointer = (event) => {
    if (event.pointerType !== 'mouse' || reducedMotion) return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointer.current = {
      x: (event.clientX - bounds.left) / bounds.width * 2 - 1,
      y: (event.clientY - bounds.top) / bounds.height * 2 - 1,
    }
  }

  return (
    <section id="top" className="orbital-hero" ref={heroRef} aria-labelledby="orbital-title"
      onPointerMove={updatePointer} onPointerLeave={() => { pointer.current = { x: 0, y: 0 } }}>
      <div className="orbital-hero__inner">
        <div className="orbital-hero__copy">
          <h1 id="orbital-title">Реклама в VK, Avito и Telegram с управлением частотой</h1>
          <p>Единый кабинет на данных Big Data МТС — управляйте охватом и частотой показов на всех площадках</p>
          <a className="action-button action-button--large orbital-hero__cta" href={`${import.meta.env.BASE_URL}contacts/`}>
            <span className="action-button__label">Оставить заявку</span>
          </a>
        </div>
        <div className="orbital-hero__visual" role="img" aria-label="Stable ID: один человек на всех площадках. Красное ядро МТС синхронно связывает VK Рекламу, Telegram Ads и Avito Рекламу для общего управления охватом и частотой показов.">
          <div className="orbital-hero__shadow" />
          <SceneBoundary>
            <Suspense fallback={<SceneFallback loading />}>
              <OrbitalScene config={orbitalConfig} pointer={pointer} running={visible && !paused && !reducedMotion} />
            </Suspense>
          </SceneBoundary>
        </div>
        <OrbitalHeroFacts />
        {!reducedMotion && <button type="button" className="orbital-hero__motion" aria-label={paused ? 'Продолжить анимацию' : 'Приостановить анимацию'} aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            {paused ? <path d="m6 3 7 5-7 5V3Z" fill="currentColor" /> : <><path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>}
          </svg>
        </button>}
      </div>
    </section>
  )
}
