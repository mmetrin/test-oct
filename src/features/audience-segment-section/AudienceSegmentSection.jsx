import { useState } from 'react'

import bigDataWordmark from '../../assets/figma/big-data-stage/big-data-wordmark.png'
import { AudienceDataVideo } from './AudienceDataVideo'
import { useRevealOnVisible } from '../../shared/lib/useRevealOnVisible'
import { SegmentedControl } from '../../shared/ui/segmented-control/SegmentedControl'
import './AudienceSegmentSection.css'

const audienceSegments = [
  { label: 'Крупному бизнесу', value: 'enterprise' },
  { label: 'Малому и среднему бизнесу', value: 'small-business' },
  { label: 'Паблишерам', value: 'publishers' },
  { label: 'Блогерам', value: 'bloggers' },
]

export function AudienceSegmentTabs({ activeSegment, onChange, rubber = false }) {
  return (
    <div className="audience-segment-section__tabs">
      <SegmentedControl items={audienceSegments} onChange={onChange} value={activeSegment} rubber={rubber} />
    </div>
  )
}

export function AudienceSegmentSection({ activeSegment: controlledSegment, funnelTransition = 'idle', onSegmentChange, hideTabs = false }) {
  const [internalSegment, setInternalSegment] = useState(audienceSegments[0].value)
  const activeSegment = controlledSegment ?? internalSegment
  const handleSegmentChange = onSegmentChange ?? setInternalSegment
  const { elementRef: dataContentRef, isVisible: isDataContentVisible } = useRevealOnVisible({
    threshold: 0.1,
    rootMargin: '0px 0px -8% 0px',
    once: true,
  })
  const isFunnelPreviewVisible = funnelTransition === 'preview'
  const isFunnelComplete = funnelTransition === 'complete'
  const isContentVisible = isFunnelComplete || (!isFunnelPreviewVisible && isDataContentVisible)

  return (
    <section className="audience-segment-section" aria-labelledby="audience-data-title">
      {!hideTabs && <AudienceSegmentTabs activeSegment={activeSegment} onChange={handleSegmentChange} />}

      <div
        ref={dataContentRef}
        className={`audience-segment-section__stage${isContentVisible ? ' audience-segment-section__stage--visible' : ''}`}
      >
        <AudienceDataVideo />
        <div className="audience-segment-section__content">
          <img
            className="audience-segment-section__wordmark"
            src={bigDataWordmark}
            alt="BIG DATA МТС"
            loading="lazy"
            decoding="async"
          />
          <h2 className="audience-segment-section__data-title" id="audience-data-title">
            <span>Анализируем больше данных —</span>
            <strong>точнее находим ваших клиентов</strong>
          </h2>
          <div className="audience-segment-section__captions">
            <p>Подберём точную аудиторию среди 65+ млн абонентов МТС на основе их интересов, гео-данных, интернет-поведения и звонков</p>
            <p>Обогащаем выборку данными от партнёров — знаем детали о реальных покупках на товары вашей категории или бренд</p>
          </div>
        </div>
      </div>
    </section>
  )
}
