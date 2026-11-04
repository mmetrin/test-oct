import { CoreVisual } from './CoreVisual'
import { OrbitalHeroFacts } from '../orbital-hero'
import '../../shared/ui/action-button/ActionButton.css'
import './PlatformCoreHero.css'

const platformFacts = [
  {
    id: 'audience',
    value: <>65+ <span>млн</span></>,
    description: <><span>аудитории от МТС,</span> самого крупного оператора страны</>,
  },
  {
    id: 'mau',
    value: <>78 <span>млн</span></>,
    description: <><span>средняя MAU</span><br />других площадок</>,
  },
  {
    id: 'account',
    value: <><span className="platform-core-hero__fact-prefix">всего</span> 1</>,
    description: <><span>личный кабинет</span><br />для управления</>,
  },
]

export function PlatformCoreHero() {
  return <section className="platform-core-hero" id="top" aria-labelledby="platform-core-title">
    <div className="platform-core-hero__main">
      <div className="platform-core-hero__copy">
        <h1 id="platform-core-title">Объединяем крупные площадки в единую систему управления рекламой</h1>
        <p className="platform-core-hero__description">Единый кабинет на данных Big Data МТС: аудитория, управление ставками, охватами и частотой — по всем площадкам сразу</p>
        <div className="platform-core-hero__actions">
          <a className="action-button action-button--large platform-core-hero__cta" href={`${import.meta.env.BASE_URL}contacts/`}><span className="action-button__label">Оставить заявку</span></a>
        </div>
      </div>
      <CoreVisual />
      <OrbitalHeroFacts facts={platformFacts} />
    </div>
  </section>
}
