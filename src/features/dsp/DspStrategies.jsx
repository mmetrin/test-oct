import { useState } from 'react'
import { dspAsset } from './dspAssets'
import { DspAction } from './DspControls'

const strategies = [
  { id: 'reach', label: 'Reach', title: 'Увеличьте знание и присутствие бренда', description: 'Подойдёт рекламодателям с новым брендом, меняющим позиционирование, с широкой целевой аудиторией или сезонными предложениями', kpis: ['Охват', 'Частота', 'Viewability', 'Фрод'] },
  { id: 'brand', label: 'Brandformance', title: 'Повышайте узнаваемость и доверие к бренду', description: 'Стратегия подойдёт рекламодателям с имиджевыми и коммерческими целями, длинным циклом принятия решения о покупке и высокой конкуренцией на рынке', kpis: ['CTR', 'PI', 'BR'] },
  { id: 'performance', label: 'Performance', title: 'Для Full-сервиса: наращивайте конверсии и доверие к бренду', description: 'Стратегия динамического ретаргетинга подойдёт рекламодателям, которым важно одновременно работать на охват, увеличение доли рынка и продажи', kpis: ['Post-click', 'Post-view', 'CPA', 'ДРР'] },
]

export function DspStrategies() {
  const [selected, setSelected] = useState(0)
  const item = strategies[selected]
  return <section className="dsp-strategies" aria-labelledby="dsp-strategies-title">
    <img className="dsp-strategies__background" src={dspAsset('funnel-background.png')} width="1920" height="820" alt="" loading="lazy" />
    <div className="dsp-strategies__copy"><h2 id="dsp-strategies-title">Рекламные стратегии<br />для всех этапов воронки</h2>
      <div className="dsp-strategies__content dsp-switch-content" id="dsp-strategy-details" key={item.id}>
        <div className="dsp-strategies__description"><h3>{item.title}</h3><p>{item.description}</p></div>
        <img className="dsp-strategies__illustration" src={dspAsset(`strategy-${item.id}.png`)} width="295" height="144" alt={selected === 2 ? 'Нативные и динамические баннеры' : 'Видео и баннеры'} />
        <div className="dsp-strategies__kpis"><span>Целевые KPI</span>{item.kpis.map(kpi => <span className="dsp-chip" key={kpi}>{kpi}</span>)}</div>
      </div>
      <DspAction />
    </div>
    <div className="dsp-strategies__funnel"><img key={item.id} className="dsp-switch-content" src={dspAsset(`funnel-${item.id}.png`)} width="510" height="480" alt="" /><div className="dsp-strategies__tabs" role="group" aria-label="Этап рекламной воронки">{strategies.map((strategy, i) => <button key={strategy.id} type="button" aria-pressed={selected === i} aria-controls="dsp-strategy-details" onClick={() => setSelected(i)}>{strategy.label}</button>)}</div></div>
  </section>
}
