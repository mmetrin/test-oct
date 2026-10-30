import { SiteHeader } from '../../shared/ui/site-header'
import { OrbitalHero } from '../../features/orbital-hero/OrbitalHero'
import '../enterprise-hero/EnterpriseFigmaVariables.css'
import './OrbitalHeroPage.css'

export function OrbitalHeroPage() {
  return (
    <main className="enterprise-hero-page orbital-page">
      <SiteHeader homeNavigation actionHref={`${import.meta.env.BASE_URL}contacts/`} />
      <OrbitalHero />
    </main>
  )
}
