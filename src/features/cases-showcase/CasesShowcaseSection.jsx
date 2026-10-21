import { useState } from 'react'

import { SegmentedControl } from '../../shared/ui/segmented-control/SegmentedControl'
import case01 from '../../assets/figma/enterprise-hero/cases/case-01.png'
import case02 from '../../assets/figma/enterprise-hero/cases/case-02.png'
import case03 from '../../assets/figma/enterprise-hero/cases/case-03.png'
import case04 from '../../assets/figma/enterprise-hero/cases/case-04.png'
import case05 from '../../assets/figma/enterprise-hero/cases/case-05.png'
import case06 from '../../assets/figma/enterprise-hero/cases/case-06.png'
import case07 from '../../assets/figma/enterprise-hero/cases/case-07.png'
import case08 from '../../assets/figma/enterprise-hero/cases/case-08.png'
import case09 from '../../assets/figma/enterprise-hero/cases/case-09.png'
import case10 from '../../assets/figma/enterprise-hero/cases/case-10.png'
import case11 from '../../assets/figma/enterprise-hero/cases/case-11.png'
import case12 from '../../assets/figma/enterprise-hero/cases/case-12.png'
import case13 from '../../assets/figma/enterprise-hero/cases/case-13.png'
import './CasesShowcaseSection.css'

const cases = [
  { image: case01, title: 'Как снизить CPM до 140 рублей с помощью рекламы в приложении' },
  { image: case02, title: 'Как Big Data помогла увеличить количество покупателей' },
  { image: case03, title: 'Как реклама помогла увеличить покупки в высокий сезон на 30%' },
  { image: case04, title: 'Как Big Data и Telegram Ads помогли увеличить продажи на 60 п.п.' },
  { image: case05, title: 'ИИ-креатив помог достичь VTR 93% и повысить узнаваемость бренда' },
  { image: case06, title: 'Как реклама по своей базе помогла вернуть покупателей и увеличить продажи' },
  { image: case07, title: 'Точный таргетинг помог превратить 87% кликов в сеансы на сайте' },
  { image: case08, title: 'Как привлечь подписчиков в Telegram-канал медицинского бренда' },
  { image: case09, title: 'Кросс-канальная аналитика помогла расширить охват без дублирования аудитории' },
  { image: case10, title: 'Как снизили стоимость подписчика в Telegram более чем в 2 раза' },
  { image: case11, title: 'Как снизили CPC на 65% и увеличили охваты' },
  { image: case12, title: 'Как интерактивные баннеры снизили ДРР в 3 раза' },
  { image: case13, title: 'Как MMS помогли реактивировать клиентов и удвоить ROMI' },
]

const caseTabs = [
  { value: 'enterprise', label: 'Крупный бизнес' },
  { value: 'all', label: 'Все кейсы' },
]

export function CasesShowcaseSection() {
  const [activeTab, setActiveTab] = useState('enterprise')

  return (
    <section aria-labelledby="cases-showcase-title" className="cases-showcase-section">
      <div className="cases-showcase-section__header">
        <h2 id="cases-showcase-title">Кейсы</h2>
        <SegmentedControl items={caseTabs} onChange={setActiveTab} value={activeTab} />
      </div>

      <div aria-label="Карточки кейсов, прокрутите по горизонтали" className="cases-showcase-section__scroller" role="region" tabIndex="0">
        <ul className="cases-showcase-section__list">
          {cases.map(({ image, title }, index) => (
            <li className="cases-showcase-section__card" key={image}>
              <img alt={`Кейс ${index + 1}: ${title}`} decoding={index < 4 ? 'sync' : 'async'} height="540" loading={index < 4 ? 'eager' : 'lazy'} src={image} width="460" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
