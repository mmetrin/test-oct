import { useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { budgetGroups, demographics, interestCatalog } from './budgetSegments'
import filterIcon from '../../assets/figma/platform-calculator/filter-options.svg'
import chevron from '../../assets/figma/budget-catalog/chevron.svg'
import cross from '../../assets/figma/budget-catalog/cross.svg'
import './BudgetInterestCatalog.css'

const featured = new Map(budgetGroups.flatMap(group => group.items).map(item => [item.row, item]))
const catalog = interestCatalog.map(group => ({
  title: group.title,
  items: [...group.featuredRows.map(row => featured.get(row)), ...group.items],
}))
const childAgeGroup = demographics.find(group => group.id === 'children')
const childAgeRows = new Set(childAgeGroup.items.map(item => item.row))
const byRow = new Map(catalog.flatMap(group => group.items).map(item => [item.row, item]))
const displayLabels = new Map([[300, byRow.get(300).source],
  [468, 'Интересуются садоводством'], [123, 'Планируют ремонт']])
const highlightedGroups = [
  { title: 'Авто, мото', rows: [707, 300, 653, 407] },
  { title: 'Дом, ремонт, строительство', rows: [673, 551, 468, 123] },
].map(({ title, rows }) => ({
  title, items: rows.map(row => ({ ...byRow.get(row), label: displayLabels.get(row) ?? byRow.get(row).label })),
}))
const firstGroups = [childAgeGroup, ...highlightedGroups]
const firstRows = new Set(firstGroups.flatMap(group => group.items.map(item => item.row)))
const otherGroups = catalog.map(group => ({
  ...group, items: group.items.filter(item => !firstRows.has(item.row)),
})).filter(group => group.items.length)
const extraRows = new Set(interestCatalog.flatMap(group => group.items.map(item => item.row)))
const normalize = text => text.toLocaleLowerCase('ru').replace(/ё/g, 'е').trim()

function CatalogGroup({ group, items, expanded, onExpand, draft, onToggle }) {
  const id = useId()
  const rows = items.map(item => item.row)
  const count = rows.filter(row => draft.includes(row)).length
  return <div className="budget-catalog__group" role="group" aria-labelledby={id + '-label'}>
    <div className="budget-catalog__group-heading">
      <input type="checkbox" aria-label={`Выбрать группу «${group.title}»`} checked={count === rows.length}
        ref={node => { if (node) node.indeterminate = count > 0 && count < rows.length }}
        onChange={() => onToggle(rows)} />
      <button type="button" aria-expanded={expanded} aria-controls={id} onClick={onExpand}>
        <span id={id + '-label'}>{group.title}</span><img src={chevron} alt="" />
      </button>
    </div>
    <div className="budget-catalog__items" id={id} hidden={!expanded}>
      {items.map(item => <label key={item.row} title={`${item.source} · ${item.audience.toLocaleString('ru-RU')} чел.`}>
        <input type="checkbox" checked={draft.includes(item.row)} onChange={() => onToggle([item.row])} />
        <span>{item.label}</span>
      </label>)}
    </div>
  </div>
}

export function BudgetInterestCatalog({ dialogHost, selected, childAges, onApply }) {
  const dialog = useRef(null)
  const list = useRef(null)
  const content = useRef(null)
  const titleId = useId()
  const [draft, setDraft] = useState([])
  const [expanded, setExpanded] = useState([])
  const [query, setQuery] = useState('')
  const extraCount = selected.filter(row => extraRows.has(row)).length + childAges.length
  const term = normalize(query)

  function open() {
    setDraft([...selected, ...childAges])
    setQuery('')
    setExpanded(firstGroups.map(group => group.title))
    dialog.current.showModal()
    list.current.scrollTop = 0
  }

  function apply() {
    onApply(draft.filter(row => !childAgeRows.has(row)), draft.filter(row => childAgeRows.has(row)))
    dialog.current.close()
  }

  function toggle(rows) {
    setDraft(current => rows.every(row => current.includes(row))
      ? current.filter(row => !rows.includes(row))
      : [...new Set([...current, ...rows])])
  }

  useLayoutEffect(() => {
    if (!dialogHost) return
    const viewport = list.current
    const frame = viewport.parentElement
    function updateEdges() {
      frame.dataset.topFade = viewport.scrollTop > 1
      frame.dataset.bottomFade = viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop > 1
    }
    const observer = new ResizeObserver(updateEdges)
    observer.observe(viewport)
    observer.observe(content.current)
    viewport.addEventListener('scroll', updateEdges, { passive: true })
    return () => {
      observer.disconnect()
      viewport.removeEventListener('scroll', updateEdges)
    }
  }, [dialogHost])

  function renderGroup(group) {
    const items = !term || normalize(group.title).includes(term) ? group.items
      : group.items.filter(item => normalize(item.label + ' ' + item.source).includes(term))
    if (!items.length) return null
    const isExpanded = expanded.includes(group.title) || Boolean(term)
    return <CatalogGroup key={group.title} group={group} items={items} expanded={isExpanded} draft={draft}
      onToggle={toggle} onExpand={() => {
        if (term) setQuery('')
        setExpanded(current => isExpanded ? current.filter(title => title !== group.title) : [...current, group.title])
      }} />
  }

  const results = [...firstGroups, ...otherGroups].map(renderGroup).filter(Boolean)

  return <>
    <button type="button" className="budget-catalog__trigger" aria-haspopup="dialog" onClick={open}>
      <span>Другие таргеты</span><img src={filterIcon} alt="" />
      {extraCount > 0 && <span className="budget-catalog__count">выбрано {extraCount}</span>}
    </button>
    {dialogHost && createPortal(<dialog className="budget-catalog" ref={dialog} aria-labelledby={titleId}
      onClick={event => {
        if (event.target !== dialog.current) return
        const { left, right, top, bottom } = dialog.current.getBoundingClientRect()
        if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) dialog.current.close()
      }}>
      <header className="budget-catalog__header">
        <h3 id={titleId} tabIndex="-1" autoFocus>Другие таргеты</h3>
        <button type="button" className="budget-catalog__close" aria-label="Закрыть" onClick={() => dialog.current.close()}>
          <img src={cross} alt="" />
        </button>
      </header>
      <div className="budget-catalog__frame">
        <div className="budget-catalog__scroll" ref={list}>
          <div className="budget-catalog__content" ref={content}>
            <input type="search" aria-label="Поиск по всем таргетам" placeholder="Поиск по всем таргетам" value={query}
              onChange={event => { setQuery(event.target.value); list.current.scrollTop = 0 }} />
            {results}
            {!results.length && <p role="status">Ничего не найдено</p>}
          </div>
        </div>
      </div>
      <button type="button" className="platform-sections__cta budget-catalog__apply" onClick={apply}><span>Применить</span></button>
    </dialog>, dialogHost)}
  </>
}
