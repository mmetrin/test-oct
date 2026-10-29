import { useEffect, useId, useRef, useState } from 'react'
import { audienceDatasets } from './connectedTvAudienceData'
import { useAudienceTransition } from './useAudienceTransition'
import './ConnectedTvAudience.css'

function AudiencePanel({ children, className = '', label }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const panel = ref.current
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setVisible(true)
      observer.unobserve(panel)
    }, { threshold: 0.25 })
    observer.observe(panel)
    return () => observer.disconnect()
  }, [])
  return <section className={`ctv-chart ${className}${visible ? ' is-visible' : ''}`} ref={ref} aria-label={label}>{children}</section>
}

function PercentBadge({ value, className = '' }) {
  return <span className={`ctv-chart__badge ${className}`}>{Math.round(value)}%</span>
}

function AgeChart({ ages }) {
  return <AudiencePanel className="ctv-chart--age" label="Возраст аудитории">
    <h3>Возраст</h3>
    <ul className="ctv-age-list">{ages.map((item, index) => <li key={item.label} style={{ '--bar-width': `${item.width}px`, '--delay': `${index * 85}ms` }}>
      <span className="ctv-age-list__label">{item.label}</span><span className="ctv-age-list__track"><span className="ctv-age-list__bar" /><PercentBadge value={item.value} /></span>
    </li>)}</ul>
  </AudiencePanel>
}

function point(radius, angle) {
  return `${130 + radius * Math.cos(angle)} ${130 + radius * Math.sin(angle)}`
}

function ringSegment(start, end) {
  const outer = 130
  const inner = 111.8
  const corner = 4
  const outerOffset = corner / outer
  const innerOffset = corner / inner
  // The SVG arc flags must use the trimmed arc, excluding the rounded ends.
  // Otherwise a segment snaps to a different circle as it crosses 50%.
  const outerLarge = end - start - 2 * outerOffset > Math.PI ? 1 : 0
  const innerLarge = end - start - 2 * innerOffset > Math.PI ? 1 : 0
  return `M ${point(outer, start + outerOffset)} A ${outer} ${outer} 0 ${outerLarge} 1 ${point(outer, end - outerOffset)} Q ${point(outer, end)} ${point(outer - corner, end)} L ${point(inner + corner, end)} Q ${point(inner, end)} ${point(inner, end - innerOffset)} A ${inner} ${inner} 0 ${innerLarge} 0 ${point(inner, start + innerOffset)} Q ${point(inner, start)} ${point(inner + corner, start)} L ${point(outer - corner, start)} Q ${point(outer, start)} ${point(outer, start + outerOffset)} Z`
}

function DonutChart({ title, segments }) {
  const id = useId().replaceAll(':', '')
  return <AudiencePanel className="ctv-chart--donut" label={`${title} аудитории`}>
    <svg className="ctv-donut" width="260" height="260" viewBox="0 0 260 260" aria-hidden="true">
      <defs>{segments.map((segment, index) => <mask id={`${id}-${index}`} key={segment.label} maskUnits="userSpaceOnUse" x="0" y="0" width="260" height="260">
        <path className="ctv-donut__reveal" d={`M ${point(120.9, segment.start)} A 120.9 120.9 0 ${segment.end - segment.start > Math.PI ? 1 : 0} 1 ${point(120.9, segment.end)}`} pathLength="100" fill="none" stroke="white" strokeWidth="24" style={{ '--delay': `${index * 170 + 180}ms` }} />
      </mask>)}</defs>
      {segments.map((segment, index) => <path key={segment.label} d={ringSegment(segment.start, segment.end)} fill={segment.color} mask={`url(#${id}-${index})`} />)}
    </svg>
    <h3 className="ctv-donut__title">{title}</h3>
    <dl className="ctv-donut__legend">{segments.map((segment, index) => <div className={`ctv-donut__label ctv-donut__label--${segment.position}`} key={segment.label} style={{ '--chart-color': segment.color, '--delay': `${index * 170 + 650}ms` }}><dt>{segment.label}</dt><dd>{Math.round(segment.value)}%</dd></div>)}</dl>
    {segments.map((segment, index) => <span key={segment.label} className="ctv-donut__icon ctv-chart__badge" style={{ left: segment.iconX, top: segment.iconY, '--chart-color': segment.color, '--delay': `${index * 170 + 750}ms` }} aria-hidden="true"><img src={segment.icon} alt="" /></span>)}
  </AudiencePanel>
}

function LocationChart({ locations }) {
  return <AudiencePanel className="ctv-chart--location" label="География аудитории по городам">
    <h3>География по городам</h3>
    <ul className="ctv-location-list">{locations.map((item, index) => <li key={item.label[0]} style={{ width: item.width, '--chart-color': item.color, '--delay': `${index * 140}ms` }}><span className="ctv-location-list__bar" /><PercentBadge value={item.value} /><span className="ctv-location-list__label">{item.label[0]}<br />{item.label[1]}</span></li>)}</ul>
  </AudiencePanel>
}

export function ConnectedTvAudience() {
  const [selected, setSelected] = useState('cinema')
  const data = useAudienceTransition(audienceDatasets[selected])
  return <section className="ctv-audience" aria-labelledby="ctv-audience-title">
    <div className="ctv-audience__heading"><h2 id="ctv-audience-title">Охватывайте аудиторию<br />онлайн-ТВ и видеосервисов</h2><p>Размещайте рекламу среди зрителей фильмов и сериалов на бесплатных и платных видеосервисах</p></div>
    <div className="ctv-audience__segments" role="group" aria-label="Источник аудитории">
      <button type="button" className={selected === 'cinema' ? 'is-selected' : ''} aria-pressed={selected === 'cinema'} aria-controls="ctv-audience-dashboard" onClick={() => setSelected('cinema')}>Каталог сериалов и кино</button>
      <button type="button" className={selected === 'online' ? 'is-selected' : ''} aria-pressed={selected === 'online'} aria-controls="ctv-audience-dashboard" onClick={() => setSelected('online')}>Онлайн ТВ</button>
    </div>
    <div id="ctv-audience-dashboard" className="ctv-audience__dashboard" role="region" aria-label={selected === 'cinema' ? 'Аудитория каталога сериалов и кино' : 'Аудитория онлайн ТВ — демонстрационные данные'}><div className="ctv-audience__row"><AgeChart ages={data.ages} /><DonutChart title="Пол" segments={data.gender} /><DonutChart title="Доход" segments={data.income} /></div><LocationChart locations={data.locations} /></div>
  </section>
}
