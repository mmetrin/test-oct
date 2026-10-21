import { useRef } from 'react'
import { useRubberIndicator } from './useRubberIndicator'
import './SegmentedControl.css'

export function SegmentedControl({ disabled = false, items, onChange, value, rubber = false }) {
  const trackRef = useRef(null)
  const indicatorRef = useRef(null)
  useRubberIndicator(trackRef, indicatorRef, value, rubber)

  const handleKeyDown = (event) => {
    const enabledItems = items.filter((item) => !item.disabled)
    const current = enabledItems.findIndex((item) => item.value === value)
    let next
    if (event.key === 'ArrowRight') next = (current + 1) % enabledItems.length
    if (event.key === 'ArrowLeft') next = (current - 1 + enabledItems.length) % enabledItems.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = enabledItems.length - 1
    if (next === undefined || disabled || !enabledItems.length) return
    event.preventDefault()
    onChange?.(enabledItems[next].value)
    trackRef.current.querySelectorAll('button:not(:disabled)')[next]?.focus({ preventScroll: true })
  }

  return (
    <div className={`segmented-control${rubber ? ' segmented-control--rubber' : ''}`} role="tablist" aria-label="Кому подойдут решения" ref={trackRef} onKeyDown={handleKeyDown}>
      {rubber && <span className="segmented-control__indicator" ref={indicatorRef} aria-hidden="true" />}
      {items.map((item) => {
        const isActive = item.value === value

        return (
          <button
            aria-selected={isActive}
            className={`segmented-control__item${isActive ? ' is-active' : ''}`}
            disabled={disabled || item.disabled}
            key={item.value}
            onClick={() => onChange?.(item.value)}
            role="tab"
            type="button"
            tabIndex={isActive ? 0 : -1}
          >
            <span>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
