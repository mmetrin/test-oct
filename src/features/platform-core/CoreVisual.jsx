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
  const [lost, setLost] = useState(false)
  const onLost = useCallback(() => setLost(true), [])
  const retry = useCallback(() => { setLost(false); setAttempt((value) => value + 1) }, [])
  return <div className="core-visual" ref={motion.container} style={{ '--core-render-padding': `${coreConfig.desktopFocus.renderPadding}px` }} onPointerMove={motion.onPointerMove} onPointerLeave={motion.onPointerLeave}>
    <div className="core-visual__canvas" role="img" aria-label={desktopScene
      ? 'Технологическое ядро с белым логотипом МТС в центре красного керамического купола. Вокруг него равномерно расположены три плашки: VK Реклама сверху, Avito справа и Telegram слева. Они одновременно движутся к трём разъёмам и подключаются с интервалом в две секунды.'
      : 'Приподнятое технологическое ядро с керамическим куполом, стеклянной вставкой и серебристым корпусом. МТС снизу слева, VK Реклама сверху, Avito справа и Telegram снизу справа одновременно движутся к четырём равномерно расположенным разъёмам. Подключения завершаются с интервалом в одну секунду. При каждой стыковке на поверхности купола проявляются три портрета из блока Big Data; затем фотографии плавно сменяются другими.' }>
      <SceneBoundary key={attempt} onRetry={retry}>
        <Suspense fallback={<SceneStatus />}>
          <CoreScene config={sceneConfig} motion={{ ...motion, running: motion.running && !lost }} onLost={onLost} onRestored={retry} fallback={<SceneStatus failed onRetry={retry} />} />
        </Suspense>
      </SceneBoundary>
    </div>
    {lost && <SceneStatus failed onRetry={retry} />}
  </div>
}
