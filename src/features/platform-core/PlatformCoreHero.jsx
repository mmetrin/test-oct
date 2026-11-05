import { CoreVisual } from './CoreVisual'
import { OrbitalHeroFacts } from '../orbital-hero'
import infoIcon from '../../assets/platform-core/info.svg'
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
    description: <><span>средняя MAU</span> <button className="platform-core-hero__mau-info" type="button" aria-label="Средние данные по VK, Telegram и Avito, рассчитанные по состоянию на май 2026 года."><img src={infoIcon} width="24" height="24" alt="" /><span className="platform-core-hero__mau-tooltip" aria-hidden="true">Средние данные по VK, Telegram и Avito, рассчитанные по состоянию на май 2026 года.</span></button><br />других площадок</>,
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
        <h1 id="platform-core-title">Объединяем ведущие площадки в <span className="platform-core-hero__accent">единую</span> систему управления рекламой</h1>
        <p className="platform-core-hero__description">VK, Avito и Telegram: аудитория, автоматическое управление ставками, контроль охватов и частоты на всех площадках</p>
        <div className="platform-core-hero__actions">
          <a className="action-button action-button--large platform-core-hero__cta" href={`${import.meta.env.BASE_URL}contacts/`}><span className="action-button__label">Оставить заявку</span></a>
        </div>
      </div>
      <CoreVisual />
      <OrbitalHeroFacts facts={platformFacts} />
    </div>
  </section>
}
