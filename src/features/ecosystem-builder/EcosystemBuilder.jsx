import { Component, lazy, Suspense, useCallback, useState } from 'react'
import { ecosystemConfig } from './ecosystemConfig'
import { useEcosystemMotion } from './useEcosystemMotion'
import { EcosystemFacts } from './EcosystemFacts'
import '../../shared/ui/action-button/ActionButton.css'
import './EcosystemBuilder.css'

const EcosystemScene = lazy(() => import('./EcosystemScene').then((module) => ({ default: module.EcosystemScene })))

function SceneStatus({ failed = false, onRetry }) {
  return <div className="ecosystem__status" role="status">
    {failed ? <>
      <p>3D-композиция недоступна в этом браузере.</p>
      <button type="button" onClick={onRetry}>Попробовать снова</button>
    </> : <><span className="ecosystem__loader" aria-hidden="true" /><span className="ecosystem__sr-only">Загрузка 3D-композиции</span></>}
  </div>
}

class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <SceneStatus failed onRetry={this.props.onRetry} /> : this.props.children }
}

export function EcosystemBuilder() {
  const motion = useEcosystemMotion()
  const [expanded, setExpanded] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [ready, setReady] = useState(false)
  const [contextLost, setContextLost] = useState(false)
  const retry = useCallback(() => { setReady(false); setContextLost(false); setAttempt((value) => value + 1) }, [])
  const onReady = useCallback(() => setReady(true), [])
  const onContextLost = useCallback(() => setContextLost(true), [])

  return <section ref={motion.container} className="ecosystem" aria-labelledby="ecosystem-title"
    onPointerMove={motion.onPointerMove} onPointerLeave={motion.onPointerLeave}>
    <div className="ecosystem__inner">
      <div className="ecosystem__copy">
        <h1 id="ecosystem-title">Реклама в VK, Avito и Telegram с управлением частотой</h1>
        <p>Единый кабинет на данных Big Data МТС — управляйте охватом и частотой показов на всех площадках</p>
        <a className="action-button action-button--large ecosystem__cta" href={`${import.meta.env.BASE_URL}contacts/`}>
          <span className="action-button__label">Оставить заявку</span>
        </a>
      </div>
    </div>
    <div className="ecosystem__visual">
      <div className="ecosystem__canvas" role="img" aria-label="Модульная экосистема МТС: модули VK Рекламы, Avito и Telegram плавно соединяются с общей архитектурой вокруг красного ядра МТС.">
        <SceneBoundary key={attempt} onRetry={retry}>
          <Suspense fallback={<SceneStatus />}>
            <EcosystemScene config={ecosystemConfig} pointer={motion.pointer} running={motion.running && !contextLost}
              expanded={expanded} reducedMotion={motion.reducedMotion} onReady={onReady} onContextLost={onContextLost}
              onContextRestored={retry} fallback={<SceneStatus failed onRetry={retry} />} />
          </Suspense>
        </SceneBoundary>
      </div>
      {contextLost && <SceneStatus failed onRetry={retry} />}
    </div>
    <EcosystemFacts />
    {ready && !contextLost && <div className="ecosystem__controls" aria-label="Управление 3D-композицией">
      <button className="ecosystem__control" type="button" aria-pressed={expanded}
        aria-label={expanded ? 'Собрать конструкцию' : 'Раскрыть конструкцию'} title={expanded ? 'Собрать конструкцию' : 'Раскрыть конструкцию'}
        onClick={() => setExpanded((value) => !value)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
        </svg>
      </button>
      {!motion.reducedMotion && <button className="ecosystem__control" type="button" aria-pressed={motion.paused}
        aria-label={motion.paused ? 'Продолжить анимацию' : 'Приостановить анимацию'} title={motion.paused ? 'Продолжить анимацию' : 'Приостановить анимацию'}
        onClick={() => motion.setPaused((value) => !value)}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          {motion.paused ? <path d="m6 4 8 5-8 5V4Z" fill="currentColor" /> : <path d="M6 4v10m6-10v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}
        </svg>
      </button>}
    </div>}
  </section>
}
