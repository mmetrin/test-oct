import { useEffect, useId, useRef } from 'react'
import beautyPortrait from '../../assets/figma/hero-cards-design/m-kosmetik-portrait.png'
import studentPortrait from '../../pages/certification/assets/people/240655279.png'
import homePortrait from '../../pages/certification/assets/people/240655281.png'
import officePortrait from '../../pages/certification/assets/people/240655282.png'
import teamPortrait from '../../pages/certification/assets/people/240655285.png'
const SEGMENTS = [
  { id: 'age', label: 'Возраст', value: '25–34 года', description: 'Находим аудиторию нужного возраста', icon: '◎' },
  { id: 'geo', label: 'Геометки', value: 'Рядом с вашим бизнесом', description: 'Выбираем тех, кто бывает рядом', icon: '⌖' },
  { id: 'interests', label: 'Интересы', value: 'Покупки · путешествия · стиль', description: 'Объединяем людей с общими интересами', icon: '✧' },
]
const IMAGES = [beautyPortrait, studentPortrait, homePortrait, officePortrait, teamPortrait]
const SHAPE = '-48,-36 25,-48 49,-18 40,39 -34,48 -51,12'
const SHARDS = Array.from({ length: 156 }, (_, id) => ({
  id, phase: ((id * 0.61803398875) % 1), layer: id % 4,
  size: 0.23 + ((id * 17) % 29) / 45,
  color: id % 5, angle: ((id * 47) % 100) - 50,
}))
const PORTRAITS = Array.from({ length: 15 }, (_, id) => ({
  id, group: Math.floor(id / 5), image: IMAGES[(id * 3 + Math.floor(id / 5)) % IMAGES.length],
  x: 210 + Math.floor(id / 5) * 580 + [0, 165, 310, 65, 260][id % 5],
  y: [240, 345, 230, 470, 475][id % 5],
  size: [0.84, 1.12, 0.78, 0.65, 0.86][id % 5],
  angle: [-17, 12, -9, 19, -13][id % 5],
}))

export function DataStream({ active }) {
  const svgRef = useRef(null)
  const interaction = useRef({ active })
  const prefix = useId().replaceAll(':', '')
  useEffect(() => { interaction.current = { active } }, [active])

  useEffect(() => {
    const svg = svgRef.current
    const shards = [...svg.querySelectorAll('[data-shard]')]
    const portraits = [...svg.querySelectorAll('[data-portrait]')]
    const connections = [...svg.querySelectorAll('[data-connection]')]
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    let frame = 0
    let last = 0
    let time = 0
    const emphasis = PORTRAITS.map(() => 0)
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting }, { rootMargin: '100px' })
    observer.observe(svg)

    const render = (now) => {
      frame = requestAnimationFrame(render)
      const dt = Math.min((now - last) / 1000 || 0, 0.05)
      last = now
      if (!visible || document.hidden) return
      const { active: selected } = interaction.current
      if (selected === null && !reducedMotion.matches) time += dt
      shards.forEach((node, index) => {
        const shard = SHARDS[index]
        const phase = (shard.phase + time * (0.012 + shard.layer * 0.002)) % 1
        const x = phase * 2200 - 140
        const y = 310 + Math.sin(phase * Math.PI * 2 + shard.layer * 0.64) * (105 + shard.layer * 23) + shard.layer * 28
        const size = shard.size * (0.52 + shard.layer * 0.22)
        const angle = shard.angle + Math.sin(time * 0.26 + index) * 18
        node.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${angle.toFixed(2)}) skewX(-22) scale(${size.toFixed(3)} ${(size * 0.68).toFixed(3)})`)
      })
      const points = PORTRAITS.map((portrait, index) => {
        const target = selected === portrait.group ? 1 : 0
        emphasis[index] += (target - emphasis[index]) * (reducedMotion.matches ? 1 : Math.min(1, dt * 7))
        const focus = emphasis[index]
        const x = portrait.x + Math.sin(time * 0.23 + index * 2.2) * 32
        const y = portrait.y + Math.cos(time * 0.3 + index * 1.7) * 26 - focus * 12
        const size = portrait.size * (1 + focus * 0.72)
        const angle = (portrait.angle + Math.sin(time * 0.2 + index) * 6) * (1 - focus)
        portraits[index].setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${angle.toFixed(2)}) scale(${size.toFixed(3)})`)
        return `${x.toFixed(2)},${y.toFixed(2)}`
      })
      connections.forEach((node, group) => node.setAttribute('points', [0, 1, 2, 4, 3, 0].map(index => points[group * 5 + index]).join(' ')))
    }
    frame = requestAnimationFrame(render)
    return () => { cancelAnimationFrame(frame); observer.disconnect() }
  }, [])

  return (
    <svg ref={svgRef} className="data-stream" viewBox="0 0 1920 680" aria-hidden="true">
      <defs>
        {['#8ec9f4', '#325e98', '#ffe4d7', '#d3e6f3', '#719ed1'].map((color, index) => (
          <linearGradient key={color} id={`${prefix}-glass-${index}`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#fff" stopOpacity=".87" /><stop offset=".3" stopColor={color} stopOpacity=".6" />
            <stop offset=".75" stopColor={color} stopOpacity=".95" /><stop offset="1" stopColor="#fff" stopOpacity=".7" />
          </linearGradient>
        ))}
        <linearGradient id={`${prefix}-sheen`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff" stopOpacity=".5" /><stop offset=".5" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#9acdf9" stopOpacity=".15" />
        </linearGradient>
        <clipPath id={`${prefix}-portrait`}><polygon points={SHAPE} /></clipPath>
      </defs>
      <g className="data-stream__ribbons" fill="none" stroke="#fff" strokeWidth="1">
        <path d="M-100 280C400 50 650 620 1150 370S1700 190 2020 380" />
        <path d="M-100 320C400 90 650 660 1150 410S1700 230 2020 420" />
        <path d="M-100 520C400 650 800 100 1250 230S1750 600 2020 210" />
      </g>
      <g className="data-stream__shards">
        {SHARDS.map(shard => (
          <g key={shard.id} data-shard="" opacity={0.28 + shard.layer * 0.19}>
            <polygon points={SHAPE} transform="translate(1 5)" fill="#315988" opacity=".3" />
            <polygon points={SHAPE} fill={`url(#${prefix}-glass-${shard.color})`} stroke="#fff" strokeOpacity=".85" strokeWidth="1.5" />
            <path d="M-48-36 25-48 49-18" fill="none" stroke="#fff" strokeWidth="2.5" />
          </g>
        ))}
      </g>
      {SEGMENTS.map((segment, group) => (
        <g key={segment.id} className={`data-stream__segment ${active === group ? 'is-selected' : ''}`}>
          <polyline data-connection="" className="data-stream__connection" fill="none" stroke="#386ea8" strokeWidth="1.5" strokeDasharray="5 8" />
          {PORTRAITS.filter(portrait => portrait.group === group).map(portrait => (
            <g key={portrait.id} data-portrait="" className="data-stream__portrait">
              <polygon points={SHAPE} transform="translate(2 6)" fill="#315988" opacity=".23" />
              <g clipPath={`url(#${prefix}-portrait)`}>
                <image href={portrait.image} x="-70" y="-65" width="140" height="155" preserveAspectRatio="xMidYMin slice" />
                <polygon points={SHAPE} fill={`url(#${prefix}-sheen)`} />
              </g>
              <polygon points={SHAPE} fill="none" stroke="#fff" strokeWidth="2" />
              <path className="data-stream__brackets" d="M-60-32v-24h24M36-56h24v24M60 32v24H36M-36 56h-24V32" fill="none" stroke="#28578b" strokeWidth="1.4" />
            </g>
          ))}
        </g>
      ))}
    </svg>
  )
}
