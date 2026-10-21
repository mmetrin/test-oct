import { useLayoutEffect } from 'react'
import { useRevealOnVisible } from '../../shared/lib/useRevealOnVisible'
import { AudienceDataScene } from './AudienceDataScene'
import './AudienceOrbitSection.css'

export function AudienceOrbitSection() {
  const { elementRef, isVisible } = useRevealOnVisible({
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px',
  })

  useLayoutEffect(() => {
    const section = elementRef.current
    if (!section) return undefined

    const updateHeight = () => {
      section.style.setProperty('--audience-orbit-height', `${section.offsetHeight}px`)
    }
    const observer = new ResizeObserver(updateHeight)
    updateHeight()
    observer.observe(section)

    return () => observer.disconnect()
  }, [elementRef])

  return (
    <section
      className={`audience-orbit-section${isVisible ? ' audience-segment-section__content--visible' : ''}`}
      aria-labelledby="audience-orbit-title"
      ref={elementRef}
    >
      <div className="audience-orbit-section__container">
        <h2 className="audience-orbit-section__title" id="audience-orbit-title">
          <span>Анализируем больше данных —</span>
          <strong>точнее находим ваших клиентов</strong>
        </h2>

        <div className="audience-orbit-section__visual">
          <AudienceDataScene />
        </div>

        <div className="audience-orbit-section__captions">
          <p>Подберём точную аудиторию среди 65+ млн абонентов МТС на основе их интересов, геоданных, интернет-поведения и звонков</p>
          <p>Обогащаем выборку данными партнёров — знаем детали о реальных покупках товаров вашей категории или бренда</p>
        </div>
      </div>
    </section>
  )
}
