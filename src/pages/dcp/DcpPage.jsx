import { DcpHeroSection } from '../../features/dcp-hero-section'
import { DcpServiceModeSection } from '../../features/dcp-service-mode-section'
import { SiteHeader } from '../../shared/ui/site-header'
import './DcpPage.css'

export function DcpPage() {
  return (
    <>
    <SiteHeader />
    <main className="dcp-page">
      <DcpHeroSection showHeader={false} />
      <DcpServiceModeSection />
    </main>
    </>
  )
}
