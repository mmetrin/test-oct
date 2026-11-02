import { Component, lazy, Suspense, useCallback, useState } from 'react'
import { coreConfig, getCoreSceneConfig } from './coreConfig'
import { useCoreMotion } from './useCoreMotion'

const CoreScene = lazy(() => import('./CoreScene').then((module) => ({ default: module.CoreScene })))

function SceneStatus({ failed = false, onRetry }) {
  return <div className="core-visual__status" role="status">
    {failed ? <><p>3D-композиция сейчас недоступна</p><button type="button" onClick={onRetry}>Попробовать снова</button></>
      : <><span className="core-visual__loader" aria-hidden="true" /><span>Собираем систему…</span></>}
  </div>
}

class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <SceneStatus failed onRetry={this.props.onRetry} /> : this.props.children }
}

export function CoreVisual() {
  const motion = useCoreMotion()
  // Keep positions and connection timing stable when the viewport changes mid-animation.
  const [desktopScene] = useState(motion.desktop)
  const sceneConfig = getCoreSceneConfig(desktopScene)
  const [attempt, setAttempt] = useState(0)
  const [ready, setReady] = useState(false)
  const [lost, setLost] = useState(false)
  const onReady = useCallback(() => setReady(true), [])
  const onLost = useCallback(() => setLost(true), [])
  const retry = useCallback(() => { setReady(false); setLost(false); setAttempt((value) => value + 1) }, [])
  return <div className="core-visual" ref={motion.container} style={{ '--core-render-padding': `${coreConfig.desktopFocus.renderPadding}px` }} onPointerMove={motion.onPointerMove} onPointerLeave={motion.onPointerLeave}>
    <div className="core-visual__canvas" role="img" aria-label={`Приподнятое технологическое ядро с керамическим куполом, стеклянной вставкой и серебристым корпусом. МТС снизу слева, VK Реклама сверху, ${desktopScene ? 'Telegram справа и Avito снизу справа' : 'Avito справа и Telegram снизу справа'} одновременно движутся к четырём равномерно расположенным разъёмам. Подключения завершаются с интервалом в ${sceneConfig.connection.arrivalInterval === 2 ? 'две секунды' : 'одну секунду'}. При каждой стыковке на поверхности купола проявляются три портрета из блока Big Data; затем фотографии плавно сменяются другими.${motion.desktop ? ' После всех подключений портреты собираются в центре купола и превращаются в знак STABLE ID с красным силуэтом человека.' : ''}`}>
      <SceneBoundary key={attempt} onRetry={retry}>
        <Suspense fallback={<SceneStatus />}>
          <CoreScene config={sceneConfig} motion={{ ...motion, running: motion.running && !lost }} onReady={onReady} onLost={onLost} onRestored={retry} fallback={<SceneStatus failed onRetry={retry} />} />
        </Suspense>
      </SceneBoundary>
    </div>
    {lost && <SceneStatus failed onRetry={retry} />}
    {ready && !lost && !motion.reduced && <button className="core-visual__pause" type="button" aria-pressed={motion.paused}
      aria-label={motion.paused ? 'Продолжить анимацию' : 'Приостановить анимацию'}
      title={motion.paused ? 'Продолжить анимацию' : 'Приостановить анимацию'} onClick={() => motion.setPaused((value) => !value)}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        {motion.paused ? <path d="m5 3 7 5-7 5V3Z" fill="currentColor" /> : <path d="M5.5 4v8m5-8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}
      </svg>
    </button>}
  </div>
}
