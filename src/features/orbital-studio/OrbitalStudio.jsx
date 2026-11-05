import { Component, lazy, Suspense, useCallback, useState } from 'react'
import { studioConfig } from './studioConfig'
import { useStudioMotion } from './useStudioMotion'
import './OrbitalStudio.css'

const StudioScene = lazy(() => import('./StudioScene').then((module) => ({ default: module.StudioScene })))

function SceneStatus({ failed = false, onRetry }) {
  return <div className="orbital-studio__status" role="status">
    {failed ? <>
      <p>Не удалось открыть 3D-композицию. Проверьте, включено ли аппаратное ускорение в браузере.</p>
      <button type="button" onClick={onRetry}>Попробовать снова</button>
    </> : <><span className="orbital-studio__loading" aria-hidden="true" /><span>Загрузка композиции…</span></>}
  </div>
}

class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <SceneStatus failed onRetry={this.props.onRetry} /> : this.props.children }
}

export function OrbitalStudio() {
  const motion = useStudioMotion()
  const [attempt, setAttempt] = useState(0)
  const [contextLost, setContextLost] = useState(false)
  const [ready, setReady] = useState(false)
  const retry = useCallback(() => {
    setReady(false)
    setContextLost(false)
    setAttempt((value) => value + 1)
  }, [])
  const onReady = useCallback(() => setReady(true), [])
  const onContextLost = useCallback(() => setContextLost(true), [])

  return <section ref={motion.container} className="orbital-studio" aria-label="Орбитальная система МТС Маркетолога 2.0"
    onPointerMove={motion.onPointerMove} onPointerLeave={motion.onPointerLeave}>
    {/* Deliberate negative space for future hero copy; no invented marketing content. */}
    <div className="orbital-studio__visual">
      <div className="orbital-studio__canvas" role="img" aria-label="Многослойное серебристое ядро, стеклянные и металлические орбиты с движущимися технологическими модулями.">
        <SceneBoundary key={attempt} onRetry={retry}>
          <Suspense fallback={<SceneStatus />}>
            <StudioScene config={studioConfig} pointer={motion.pointer}
              running={motion.running && !contextLost} onReady={onReady}
              onContextLost={onContextLost} onContextRestored={retry}
              fallback={<SceneStatus failed onRetry={retry} />} />
          </Suspense>
        </SceneBoundary>
      </div>
      {contextLost && <SceneStatus failed onRetry={retry} />}
    </div>
    {ready && !contextLost && !motion.reducedMotion && <button className="orbital-studio__motion" type="button"
      aria-label={motion.paused ? 'Продолжить анимацию' : 'Приостановить анимацию'}
      aria-pressed={motion.paused} title={motion.paused ? 'Продолжить анимацию' : 'Приостановить анимацию'}
      onClick={() => motion.setPaused((value) => !value)}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        {motion.paused ? <path d="m6 3 7 5-7 5V3Z" fill="currentColor" /> : <path d="M5.5 3.5v9m5-9v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}
      </svg>
    </button>}
  </section>
}
