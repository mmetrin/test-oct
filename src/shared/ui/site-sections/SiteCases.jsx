import { useId, useLayoutEffect, useRef } from 'react'

import manifest from '../../../assets/figma/enterprise-content/manifest.json'
import './SiteCases.css'

const images = import.meta.glob('../../../assets/figma/enterprise-content/case-*@2x.*', {
  eager: true,
  query: '?url',
  import: 'default',
})
const cases = manifest.filter((item) => item.name.startsWith('case-'))

export function SiteCases({ className = '', id }) {
  const titleId = useId()
  const scrollerRef = useRef(null)

  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    const centerCards = () => {
      scroller.scrollLeft = (scroller.scrollWidth - scroller.clientWidth) / 2
    }

    centerCards()
    const observer = new ResizeObserver(centerCards)
    observer.observe(scroller)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={`site-cases ${className}`} id={id} aria-labelledby={titleId}>
      <h2 id={titleId}>Кейсы</h2>
      <div className="site-cases__scroll" ref={scrollerRef} tabIndex={0} role="region" aria-label="Все кейсы — прокрутка по горизонтали">
        <div className="site-cases__strip">
          {cases.map((item) => (
            <img
              key={item.source}
              src={images[`../../../assets/figma/enterprise-content/${item.file}`]}
              alt={item.text.filter(Boolean).join('. ')}
              width={item.w}
              height={item.h}
              loading="lazy"
              draggable={false}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
