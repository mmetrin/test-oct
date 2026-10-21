import { useRef, useState } from 'react'
import { DataStream } from './DataStream'
import { AmbientParticles } from './AmbientParticles'
import { DataNetwork } from './DataNetwork'
import './EnterpriseBigData.css'

const SEGMENTS = [
  { id: 'age', label: 'Возраст', value: '25–34 года', description: 'Находим аудиторию нужного возраста', icon: '◎' },
  { id: 'geo', label: 'Геометки', value: 'Рядом с вашим бизнесом', description: 'Выбираем тех, кто бывает рядом', icon: '⌖' },
  { id: 'interests', label: 'Интересы', value: 'Покупки · путешествия · стиль', description: 'Объединяем людей с общими интересами', icon: '✧' },
]
export function EnterpriseBigData({ variant = 'shards' }) {
  const [hovered, setHovered] = useState(null)
  const [focused, setFocused] = useState(null)
  const [pinned, setPinned] = useState(null)
  const active = pinned ?? focused ?? hovered
  const stageRef = useRef(null)
  const selectAtPointer = (event) => {
    if (event.pointerType === 'touch') return
    const bounds = stageRef.current.getBoundingClientRect()
    setHovered(Math.max(0, Math.min(2, Math.floor((event.clientX - bounds.left) / bounds.width * 3))))
  }
  const clearSelection = () => { setPinned(null); setHovered(null); setFocused(null) }

  return (
    <section className={`enterprise-data ${variant === 'particles' ? 'enterprise-data--particles' : ''} ${variant === 'network' ? 'enterprise-data--network' : ''} ${active !== null ? 'has-selection' : ''}`} id="enterprise-big-data" aria-labelledby="enterprise-big-data-title">
      <header className="enterprise-data__heading">
        <h2 id="enterprise-big-data-title">Анализируем больше данных —<br />точнее находим ваших клиентов</h2>
        {variant === 'shards' && <p>Находим общие признаки среди миллионов сигналов — и собираем вашу аудиторию</p>}
      </header>
      <div ref={stageRef} className={`enterprise-data__stage ${variant === 'particles' ? 'enterprise-data__stage--particles' : ''} ${variant === 'network' ? 'enterprise-data__stage--network' : ''}`} onPointerMove={variant === 'shards' ? selectAtPointer : undefined} onPointerLeave={variant === 'shards' ? () => setHovered(null) : undefined}
        onKeyDown={event => { if (event.key === 'Escape') clearSelection() }}>
        {variant === 'network' ? <><AmbientParticles /><DataNetwork /></> : variant === 'particles' ? <AmbientParticles /> : <>
        <div className="enterprise-data__filters" role="group" aria-label="Выберите признак аудитории">
          {SEGMENTS.map((segment, index) => (
            <div key={segment.id} className={`enterprise-data__filter ${active === index ? 'is-active' : ''}`}>
              <button type="button" aria-pressed={pinned === index} aria-describedby={active === index ? `data-tooltip-${segment.id}` : undefined}
                onFocus={() => setFocused(index)} onBlur={() => setFocused(null)}
                onPointerEnter={() => setHovered(index)}
                onClick={() => { setPinned(pinned === index ? null : index); setHovered(null); setFocused(null) }}>
                <span aria-hidden="true">{segment.icon}</span>{segment.label}<span className="enterprise-data__filter-plus" aria-hidden="true">{active === index ? '−' : '+'}</span>
              </button>
              <div className="enterprise-data__tooltip" id={`data-tooltip-${segment.id}`} role="tooltip" aria-hidden={active !== index}>
                <strong>{segment.value}</strong><span>{segment.description}</span>
              </div>
            </div>
          ))}
        </div>
        <DataStream active={active} />
        </>}
      </div>
      <div className="enterprise-data__details">
        <p>Подберём точную аудиторию среди 65+ млн абонентов МТС на основе их интересов, интернет-поведения, звонков и гео-данных</p>
        <p>Обогащаем выборку данными от партнёров — знаем детали о реальных покупках на товары вашей категории или бренд</p>
      </div>
    </section>
  )
}
