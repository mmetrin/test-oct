import { useState } from 'react'
import { budgetGroups, demographics, interestCatalog } from './budgetSegments'
import { BudgetInterestCatalog } from './BudgetInterestCatalog'
import { BudgetMultiSelect } from './BudgetMultiSelect'
import { platformChannels } from './platformChannels'
import { estimateBudget, monthlyFrequency } from './budgetEstimate'
import './PlatformBudgetCalculator.css'

const artwork = import.meta.glob('../../assets/figma/platform-calculator/*.svg', { eager: true, import: 'default' })
const icon = name => artwork[`../../assets/figma/platform-calculator/${name}.svg`]
const segments = [...budgetGroups, ...interestCatalog].flatMap(group => group.items)
const initialSelection = segments.filter(segment => segment.selected).map(segment => segment.row)
const initialProfile = {
  sex: demographics.find(group => group.id === 'sex').items.map(item => item.row),
  age: demographics.find(group => group.id === 'age').items.map(item => item.row),
  income: demographics.find(group => group.id === 'income').items.slice(-2).map(item => item.row),
}
const number = new Intl.NumberFormat('ru-RU')
const plural = new Intl.PluralRules('ru-RU')

function ChannelLogo({ name }) {
  if (name !== 'avito') return <img src={icon(name)} alt="" />
  return <span className="budget-result__avito" aria-hidden="true">
    {['green', 'red', 'purple', 'blue'].map(color =>
      <img key={color} className={`budget-result__avito-${color}`} src={icon(`avito-${color}`)} alt="" />
    )}
  </span>
}

function BudgetResult({ estimate, multiple }) {
  const { audience, budget, channelReach, capped, modeled } = estimate
  const people = plural.select(audience) === 'few' ? 'человека' : 'человек'
  const description = modeled ? 'Оценка аудитории' : multiple ? 'Верхняя оценка аудитории' : 'Аудитория'
  return <aside className="budget-result" aria-label="Предварительная оценка кампании">
    <div className="budget-result__metric">
      <div className="budget-result__people">
        <span>{number.format(audience)}</span> <small>чел</small>
      </div>
      <p className="budget-result__secondary">Охват Big Data МТС</p>
      {capped && <p className="budget-result__limit">Достигнут предел по численности населения</p>}
    </div>
    <div className="budget-result__channels">
      {platformChannels.map(({ title, id }) => <div className="budget-result__channel" key={id}>
        <span className="budget-result__brand"><span className="budget-result__logo"><ChannelLogo name={id} /></span>{title}</span>
        <span className="budget-result__leader" style={{ backgroundImage: `url(${icon(id + '-leader')})` }} aria-hidden="true" />
        <strong>{number.format(channelReach[id])}</strong>
      </div>)}
      <p className="budget-result__secondary">Охват на площадках</p>
    </div>
    <div className="budget-result__metric">
      <div className="budget-result__amount">{number.format(budget)} <span>₽ в месяц</span></div>
      <p className="budget-result__secondary">Бюджет при частоте {monthlyFrequency} и среднем CPM</p>
    </div>
    <div className="budget-result__footer">
      <a className="platform-sections__cta budget-result__cta" href="#connection">Обсудить запуск</a>
      <p className="budget-result__legal">Охват рассчитан без учёта географии. При запуске кампании можно выбрать города и регионы показа. Расчёт ориентировочный, параметры зависят от настроек и сезона. Не является офертой.</p>
    </div>
    <span className="platform-sections__sr-only" role="status">{description} — {number.format(audience)} {people}. Сценарный бюджет {number.format(budget)} рублей в месяц.</span>
  </aside>
}

export function PlatformBudgetCalculator({ dialogHost }) {
  const [selected, setSelected] = useState(initialSelection)
  const [profile, setProfile] = useState(initialProfile)
  const filters = demographics.flatMap(group => {
    const chosen = group.items.filter(item => profile[group.id]?.includes(item.row))
    return chosen.length ? [{ id: group.id, chosen, options: group.items }] : []
  })
  const activeSegments = segments.filter(item => selected.includes(item.row))
  const hasSelection = activeSegments.length > 0 || filters.length > 0
  const estimate = estimateBudget(activeSegments, filters)

  function toggle(row) {
    setSelected(current => current.includes(row) ? current.filter(value => value !== row) : [...current, row])
  }

  function profileField({ id, title, placeholder, items }) {
    return <BudgetMultiSelect key={id} compact title={title} placeholder={placeholder}
      groups={[{ items }]} value={profile[id] || []}
      onChange={rows => setProfile(current => ({ ...current, [id]: rows }))} />
  }

  return <div className="budget-calculator">
    <div className="budget-picker">
      <div className="budget-picker__heading">
        <h3>Подберите аудиторию</h3>
        <div className="budget-picker__actions">
          {hasSelection && <button type="button" className="budget-picker__reset" onClick={() => {
            setSelected([])
            setProfile({})
          }}>Сбросить выбор</button>}
          <BudgetInterestCatalog dialogHost={dialogHost} selected={selected} childAges={profile.children ?? []} onApply={(rows, childAges) => {
            setSelected(rows)
            setProfile(current => ({ ...current, children: childAges }))
          }} />
        </div>
      </div>
      <div className="budget-picker__groups">
        {budgetGroups.map(group => <div className="budget-picker__row" key={group.title} role="group" aria-label={group.title}>
          <span className="budget-picker__label">{group.title}</span>
          <div className="budget-picker__options">
            {group.items.map(item => <button key={item.row} type="button" className="budget-chip" data-tone={item.tone}
              aria-pressed={selected.includes(item.row)} title={`${item.source} · ${number.format(item.audience)} чел.`} onClick={() => toggle(item.row)}>
              <span className="budget-chip__icon" aria-hidden="true">{item.icon && <img src={icon(item.icon)} alt="" />}</span>
              <span className="budget-chip__text">{item.label}</span>
              {selected.includes(item.row) && <img className="budget-chip__close" src={icon('close')} alt="" />}
            </button>)}
          </div>
        </div>)}
        <div className="budget-profile">
          {demographics.filter(field => field.id !== 'children').map(profileField)}
        </div>
      </div>

    </div>
    <BudgetResult estimate={estimate} multiple={activeSegments.length > 1 || estimate.bounded} />
  </div>
}
