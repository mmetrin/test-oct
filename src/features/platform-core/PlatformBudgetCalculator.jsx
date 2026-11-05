import { useState } from 'react'
import { budgetGroups } from './budgetSegments'
import { platformChannels } from './platformChannels'
import { estimateBudget, populationLimit, monthlyFrequency, exampleCpm } from './budgetEstimate'
import './PlatformBudgetCalculator.css'

const icons = import.meta.glob('../../assets/figma/platform-calculator/*.svg', { eager: true, import: 'default' })
const icon = (name) => icons[`../../assets/figma/platform-calculator/${name}.svg`]
const segments = budgetGroups.flatMap(group => group.items)
const initialSelection = segments.filter(segment => segment.selected).map(segment => segment.label)
const number = new Intl.NumberFormat('ru-RU')
const millions = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 })

function ChannelLogo({ name }) {
  if (name !== 'avito') return <img src={icon(name)} alt="" />
  return <span className="budget-result__avito" aria-hidden="true">
    {['green', 'red', 'purple', 'blue'].map(color =>
      <img key={color} className={`budget-result__avito-${color}`} src={icon(`avito-${color}`)} alt="" />
    )}
  </span>
}

function BudgetResult({ estimate, multiple }) {
  const { audience, budget, channelReach, capped } = estimate
  const qualifier = multiple ? 'до ' : ''
  return <aside className="budget-result" aria-label="Предварительная оценка кампании">
    <div>
      <div className="budget-result__people"><small>{qualifier}</small>{number.format(audience)}</div>
      <p className="budget-result__caption">{audience ? 'человек в выбранной аудитории' : 'Выберите хотя бы один сегмент'}</p>
      {capped && <p className="budget-result__limit">Достигнут предел по численности населения</p>}
    </div>
    <div className="budget-result__channels">
      <p className="budget-result__secondary">{multiple ? 'Верхняя оценка по площадкам' : 'Аудитория на площадках'}</p>
      {platformChannels.map(({ title, id }) => <div className="budget-result__channel" key={id}>
        <span className="budget-result__brand"><span className="budget-result__logo"><ChannelLogo name={id} /></span>{title}</span>
        <span className="budget-result__leader" aria-hidden="true" />
        <strong>{number.format(channelReach[id])}</strong>
      </div>)}
    </div>
    <div>
      <p className="budget-result__secondary">Бюджет при {monthlyFrequency} показах на человека<br />и условном CPM {exampleCpm} ₽</p>
      <div className="budget-result__amount budget-result__amount--money">{millions.format(budget / 1_000_000)} <span>млн ₽ в месяц</span></div>
    </div>
    <a className="platform-sections__cta budget-result__cta" href="#connection">Обсудить запуск</a>
    <span className="platform-sections__sr-only" role="status">Аудитория {qualifier}{number.format(audience)} человек. Сценарный бюджет {number.format(budget)} рублей в месяц.</span>
  </aside>
}

export function PlatformBudgetCalculator() {
  const [selected, setSelected] = useState(initialSelection)
  const activeSegments = segments.filter(item => selected.includes(item.label))
  const estimate = estimateBudget(activeSegments)

  function toggle(label) {
    setSelected(current => current.includes(label) ? current.filter(value => value !== label) : [...current, label])
  }

  return <div className="budget-calculator">
    <div className="budget-picker">
      <h3>Выберите аудиторию</h3>
      <div className="budget-picker__groups">
        {budgetGroups.map(group => <div className="budget-picker__row" key={group.title} role="group" aria-label={group.title}>
          <span className="budget-picker__label">{group.title}</span>
          <div className="budget-picker__options">
            {group.items.map(item => <button key={item.label} type="button" className={`budget-chip budget-chip--${item.tone ?? group.tone}`}
              aria-pressed={selected.includes(item.label)} title={`${item.source} · ${number.format(item.audience)} чел.`} onClick={() => toggle(item.label)}>
              <span className="budget-chip__icon"><img src={icon(item.icon)} alt="" /></span>
              <span className="budget-chip__text">{item.label}</span>
              {selected.includes(item.label) && <img className="budget-chip__close" src={icon('close')} alt="" />}
            </button>)}
          </div>
        </div>)}
      </div>
      <p className="budget-picker__note">Человек может входить в несколько сегментов. Для такого выбора показана верхняя оценка аудитории.</p>
      <details className="budget-picker__method">
        <summary>Как считаем</summary>
        <p>Выбор включает людей хотя бы из одного сегмента. Складываем размеры выбранных сегментов. Если один человек входит в несколько, сумма учитывает его повторно. Для каждой площадки считаем отдельно и ограничиваем результат её месячной аудиторией из блока «Площадки».</p>
        {activeSegments.length > 1 && <p>Сумма по вашему выбору — {number.format(estimate.gross)} вхождений. В крупнейшем сегменте — {number.format(Math.max(...activeSegments.map(item => item.audience)))} человек.</p>}
        <p>Предел оценки — {number.format(populationLimit)} жителей России без Крыма и Севастополя на 1 января 2025 года. Предел применяется к итогу. Чтобы исключить жителей этих территорий из каждого сегмента, нужны данные по регионам.</p>
        <p>Бюджет рассчитан для показа рекламы всей указанной аудитории по {monthlyFrequency} раза за месяц. Для примера берём {exampleCpm} ₽ за 1 000 показов. Фактический охват и стоимость зависят от размещения.</p>
      </details>
    </div>
    <BudgetResult estimate={estimate} multiple={activeSegments.length > 1} />
  </div>
}
