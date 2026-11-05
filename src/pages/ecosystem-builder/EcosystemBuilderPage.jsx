import { SiteHeader } from '../../shared/ui/site-header/SiteHeader'
import { EcosystemBuilder } from '../../features/ecosystem-builder'

export function EcosystemBuilderPage() {
  return <main className="ecosystem-page" id="top">
    <SiteHeader homeNavigation actionHref={`${import.meta.env.BASE_URL}contacts/`} />
    <EcosystemBuilder />
  </main>
}
