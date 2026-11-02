import { CoreVisual } from './CoreVisual'
import { OrbitalHeroFacts } from '../orbital-hero'
import '../../shared/ui/action-button/ActionButton.css'
import './PlatformCoreHero.css'

export function PlatformCoreHero() {
  return <section className="platform-core-hero" id="top" aria-labelledby="platform-core-title">
    <div className="platform-core-hero__main">
      <div className="platform-core-hero__copy">
        <h1 id="platform-core-title">Реклама в VK, Avito и Telegram с управлением частотой</h1>
        <p className="platform-core-hero__description">Единый кабинет на данных Big Data МТС — управляйте охватом и частотой показов на всех площадках</p>
        <div className="platform-core-hero__actions">
          <a className="action-button action-button--large platform-core-hero__cta" href={`${import.meta.env.BASE_URL}contacts/`}><span className="action-button__label">Оставить заявку</span></a>
        </div>
      </div>
      <CoreVisual />
      <OrbitalHeroFacts />
    </div>
  </section>
}
