import { AdvantageCard } from '../../entities/advantage'
import { advantages } from './advantagesData'

export function AdvantagesSection() {
  return (
    <section className="facts-section" aria-label="Преимущества видеорекламы">
      <div className="page-container facts-section__grid">
        {advantages.map((advantage) => (
          <AdvantageCard advantage={advantage} key={advantage.title.join(' ')} />
        ))}
      </div>
    </section>
  )
}
