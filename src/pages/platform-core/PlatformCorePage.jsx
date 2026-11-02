import { SiteHeader } from '../../shared/ui/site-header'
import { PlatformCoreHero } from '../../features/platform-core'
import '../enterprise-hero/EnterpriseFigmaVariables.css'
import './PlatformCorePage.css'

export function PlatformCorePage() {
  return <main className="enterprise-hero-page platform-core-page">
    <SiteHeader homeNavigation actionHref={`${import.meta.env.BASE_URL}contacts/`} />
    <PlatformCoreHero />
  </main>
}
