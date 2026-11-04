import { SiteHeader } from '../../shared/ui/site-header'
import { SiteFooter } from '../../shared/ui/site-sections'
import { PlatformCoreHero, PlatformAudienceSection, PlatformCoreSections } from '../../features/platform-core'
import '../enterprise-hero/EnterpriseFigmaVariables.css'
import './PlatformCorePage.css'

const platformNavigation = [
  { label: 'Как работает', href: '#how-it-works' },
  { label: 'Кому подходит', href: '#who-it-is-for' },
  { label: 'Площадки', href: '#platforms' },
  { label: 'Расчет бюджета', href: '#budget' },
  { label: 'Интерфейс', href: '#interface' },
]

export function PlatformCorePage() {
  return <main className="enterprise-hero-page platform-core-page">
    <SiteHeader className="platform-core-header" navigationItems={platformNavigation} actionHref={`${import.meta.env.BASE_URL}contacts/`} />
    <PlatformCoreHero />
    <PlatformAudienceSection />
    <PlatformCoreSections />
    <SiteFooter />
  </main>
}
