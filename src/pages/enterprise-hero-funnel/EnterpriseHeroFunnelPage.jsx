import { useState } from 'react'

import { AudienceSegmentTabs } from '../../features/audience-segment-section'
import { EnterpriseHero } from '../../features/enterprise-hero/EnterpriseHero'
import { EnterpriseLeadScene } from '../../features/enterprise-lead-scene'
import { FunnelStageSection } from '../../features/funnel-stage-section'
import { SiteHeader } from '../../shared/ui/site-header'
import '../funnel-journey/FunnelJourneyPage.css'
import './EnterpriseHeroFunnelPage.css'

export function EnterpriseHeroFunnelPage() {
  const [activeSegment, setActiveSegment] = useState('enterprise')

  return (
    <main className="funnel-journey-page enterprise-hero-funnel-page">
      <SiteHeader />
      <EnterpriseHero leadershipOnly showHeader={false} />
      <div className="enterprise-hero-funnel-page__tabs">
        <AudienceSegmentTabs activeSegment={activeSegment} onChange={setActiveSegment} />
      </div>
      <FunnelStageSection updatedVisual scrollDriven={false} showBackground={false} />
      <EnterpriseLeadScene />
    </main>
  )
}
