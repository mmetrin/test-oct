import { useState } from 'react'

import { AudienceSegmentSection, AudienceSegmentTabs } from '../../features/audience-segment-section'
import { FunnelStageSection } from '../../features/funnel-stage-section'
import { FunnelHeroSection } from '../../features/funnel-hero-section'
import { LightGlowCanvas } from '../../features/light-glow'
import formImage from '../../../form.png'
import { usePageScrollRestoration } from '../../shared/lib/usePageScrollRestoration'
import { useScrollReveal } from '../../shared/lib/useScrollReveal'
import { SiteHeader } from '../../shared/ui/site-header'
import { SiteFooter } from '../../shared/ui/site-sections'
import './FunnelJourneyPage.css'

export function FunnelJourneyPage() {
  const [activeSegment, setActiveSegment] = useState(() => new URLSearchParams(window.location.search).get('segment') || 'enterprise')
  const [funnelTransition, setFunnelTransition] = useState('idle')
  usePageScrollRestoration()
  useScrollReveal('.funnel-journey-page__scroll-reveal', {
    threshold: 0.04,
    rootMargin: '0px 0px -8% 0px',
  })

  const handleSegmentChange = (segment) => {
    if (segment === 'bloggers') {
      window.location.assign(`${import.meta.env.BASE_URL}bloggers`)
      return
    }
    setActiveSegment(segment)
  }

  return (
    <main className="funnel-journey-page">
      <SiteHeader />
      <FunnelHeroSection />
      <div className="funnel-journey-page__tabs">
        <AudienceSegmentTabs activeSegment={activeSegment} onChange={handleSegmentChange} />
      </div>
      <div className="funnel-journey-page__funnel-flow">
        <FunnelStageSection onTransitionChange={setFunnelTransition} />
      </div>
      <AudienceSegmentSection
        activeSegment={activeSegment}
        funnelTransition={funnelTransition}
        hideTabs
        onSegmentChange={handleSegmentChange}
      />
      <section className="funnel-journey-page__feedback funnel-journey-page__scroll-reveal" aria-label="Форма обратной связи">
        <LightGlowCanvas />
        <img src={formImage} alt="Форма обратной связи" />
      </section>
      <SiteFooter />
    </main>
  )
}
