import { useEffect, useId, useRef, useState } from 'react'
import chevron from '../../assets/figma/platform-calculator/dropdown-chevron.svg'
import './BudgetMultiSelect.css'

const normalize = text => text.toLocaleLowerCase('ru').replace(/ё/g, 'е').trim()

function ParentCheck({ title, count, total, onChange }) {
  const mixed = count > 0 && count < total
  return <input type="checkbox" aria-label={`Вся группа «${title}»`} checked={count === total}
    ref={node => { if (node) node.indeterminate = mixed }} onChange={onChange} />
}

// A flat field uses a single untitled group; interests use expandable parent groups.
export function BudgetMultiSelect({ title, placeholder, groups, value, onChange, inputRef, compact = false }) {
  const field = useRef(null)
  const trigger = useRef(null)
  const strip = useRef(null)
  const localInput = useRef(null)
  const input = inputRef ?? localInput
  const id = useId()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState([])
  const items = groups.flatMap(group => group.items)
  const byRow = new Map(items.map(item => [item.row, item]))
  const chosen = value.map(row => byRow.get(row)).filter(Boolean)
  const term = normalize(query)

  function close() {
    setOpen(false)
    setQuery('')
  }

  useEffect(() => {
    const root = field.current
    function scrollChips(event) {
      if (event.ctrlKey || event.shiftKey || event.deltaX || !event.deltaY) return
      const row = event.target.closest('.budget-multi__strip, .budget-multi__values')
      if (!row || row.scrollWidth <= row.clientWidth) return
      const unit = event.deltaMode === 1 ? 20 : event.deltaMode === 2 ? row.clientWidth : 1
      const before = row.scrollLeft
      row.scrollLeft += event.deltaY * unit
      if (row.scrollLeft !== before) event.preventDefault()
    }
    root.addEventListener('wheel', scrollChips, { passive: false })
    return () => root.removeEventListener('wheel', scrollChips)
  }, [])

  useEffect(() => {
    if (!open) return
    const dialog = field.current.closest('dialog')
    const boundary = dialog ?? field.current
    function outside(event) {
      if (!boundary.contains(event.target)) close()
    }
    dialog?.addEventListener('close', close)
    document.addEventListener('pointerdown', outside)
    return () => {
      dialog?.removeEventListener('close', close)
      document.removeEventListener('pointerdown', outside)
    }
  }, [open])

  function selectRows(rows) {
    const remove = rows.every(row => value.includes(row))
    onChange(remove ? value.filter(row => !rows.includes(row)) : [...new Set([...value, ...rows])])
  }

  const matches = groups.map(group => {
    const visible = !term || normalize(group.title ?? '').includes(term) ? group.items
      : group.items.filter(item => normalize(item.label + ' ' + item.source).includes(term))
    return { ...group, visible }
  }).filter(group => group.visible.length)

  function openCompact() {
    setOpen(true)
    requestAnimationFrame(() => input.current?.focus())
  }

  const editor = <div className="budget-multi__field" data-open={open}>
      <div className="budget-multi__values">
        {chosen.map(item => <button type="button" className="budget-multi__token" key={item.row} title={item.label}
          aria-label={`Убрать: ${item.label}`} onClick={() => {
            input.current.focus()
            selectRows([item.row])
          }}>
          <span>{item.label}</span><span aria-hidden="true">×</span>
        </button>)}
        <input id={compact ? id + '-search' : id} ref={input} aria-label={compact ? `Поиск: ${title}` : undefined} role="combobox" aria-haspopup="dialog" aria-controls={id + '-menu'} aria-expanded={open}
          autoComplete="off" placeholder={compact ? 'Поиск' : chosen.length ? '' : 'Не выбран'} value={query}
          onClick={() => setOpen(true)} onFocus={() => setOpen(true)}
          onChange={event => { setQuery(event.target.value); setOpen(true) }}
          onKeyDown={event => {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              setOpen(true)
              requestAnimationFrame(() => field.current?.querySelector('.budget-multi__menu input[type="checkbox"]')?.focus())
            }
          }} />
      </div>
      {!compact && <button type="button" className="budget-multi__arrow" aria-label={`${open ? 'Свернуть' : 'Раскрыть'}: ${title}`}
        aria-expanded={open} onClick={() => { if (open) close(); else { input.current.focus(); setOpen(true) } }}>
        <span aria-hidden="true" />
      </button>}
    </div>

  return <div className={compact ? 'budget-multi budget-multi--compact' : 'budget-multi'} ref={field}
    onBlur={event => {
      const boundary = field.current.closest('dialog') ?? field.current
      if (event.relatedTarget && !boundary.contains(event.relatedTarget)) close()
    }}
    onKeyDown={event => {
      if (open && event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        if (compact) trigger.current.focus()
        else input.current.focus()
        close()
      }
    }}>
    <div className="budget-multi__label">
      <label htmlFor={id} id={id + '-label'}>{title}</label>
      {chosen.length > 0 && (!compact || open) && <button type="button" aria-label={`Очистить поле «${title}»`} onClick={() => {
        input.current.focus()
        onChange([])
      }}>Очистить</button>}
    </div>
    {compact ? <button ref={trigger} type="button" id={id} className="budget-multi__preview" aria-haspopup="dialog"
      aria-labelledby={id + '-label'} aria-describedby={id + '-tokens'} aria-expanded={open} aria-controls={id + '-menu'}
      onKeyDown={event => {
        if (event.key === 'ArrowDown') { event.preventDefault(); openCompact() }
        if (['ArrowLeft', 'ArrowRight'].includes(event.key) && strip.current.scrollWidth > strip.current.clientWidth) {
          event.preventDefault()
          strip.current.scrollBy({ left: event.key === 'ArrowLeft' ? -80 : 80 })
        }
      }}
      onClick={() => { if (open) close(); else openCompact() }}>
      <span className="budget-multi__strip" ref={strip} id={id + '-tokens'}>
        {!chosen.length && <span className="budget-multi__placeholder">{placeholder}</span>}
        {chosen.map(item => <span className="budget-multi__pill" key={item.row}>{item.shortLabel ?? item.label}</span>)}
      </span>
      <span className="budget-multi__end"><img src={chevron} alt="" /></span>
    </button> : editor}
    {open && <div className="budget-multi__menu" id={id + '-menu'} role="dialog" aria-label={`Варианты: ${title}`}>
      {compact && editor}
      {matches.map(group => {
        const show = !group.title || Boolean(term) || expanded.includes(group.title)
        const count = group.items.filter(item => value.includes(item.row)).length
        return <div key={group.title || 'options'}>
          {group.title && <div className="budget-multi__parent">
            <ParentCheck title={group.title} count={count} total={group.items.length} onChange={() => selectRows(group.items.map(item => item.row))} />
            <button type="button" aria-expanded={show} onClick={() => {
              setQuery('')
              setExpanded(current => show ? current.filter(name => name !== group.title) : [...current, group.title])
            }}>{group.title}<span className="budget-multi__chevron" aria-hidden="true" /></button>
          </div>}
          {show && <div className={group.title ? 'budget-multi__children' : undefined}>
            {group.visible.map(item => <label className="budget-multi__option" key={item.row} title={`${item.source} · ${item.audience.toLocaleString('ru-RU')} чел.`}>
              <input type="checkbox" checked={value.includes(item.row)} onChange={() => selectRows([item.row])} />
              <span>{item.label}</span>
            </label>)}
          </div>}
        </div>
      })}
      {!matches.length && <p className="budget-multi__empty" role="status">Ничего не найдено</p>}
    </div>}
  </div>
}
