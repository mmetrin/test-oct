import { useEffect, useLayoutEffect, useState } from 'react'

import { AudienceSegmentTabs } from '../../features/audience-segment-section'
import { BloggersContent } from '../../features/bloggers-content'
import { FunnelStageSection } from '../../features/funnel-stage-section'
import { SmallBusinessContent } from '../../features/small-business-content'
import { PublishersContent } from '../../features/publishers-content'
import '../funnel-journey/FunnelJourneyPage.css'
import './EnterpriseFunnelSection.css'

export function EnterpriseFunnelSection({ activeSegment, onSegmentChange }) {
  const [displayedSegment, setDisplayedSegment] = useState(activeSegment)
  const [outgoingSegment, setOutgoingSegment] = useState(null)
  const [hasSwitched, setHasSwitched] = useState(false)

  useLayoutEffect(() => {
    if (activeSegment === displayedSegment) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayedSegment(activeSegment)
      setOutgoingSegment(null)
      return undefined
    }

    setOutgoingSegment(displayedSegment)
    setDisplayedSegment(activeSegment)
    setHasSwitched(true)
  }, [activeSegment, displayedSegment])

  useEffect(() => {
    if (!outgoingSegment) return undefined

    const timer = window.setTimeout(() => setOutgoingSegment(null), 520)
    return () => window.clearTimeout(timer)
  }, [outgoingSegment])

  const renderContent = (segment) => {
    if (segment === 'small-business') return <SmallBusinessContent />
    if (segment === 'publishers') return <PublishersContent />
    if (segment === 'bloggers') return <BloggersContent />
    return <FunnelStageSection updatedVisual designLayout />
  }

  return (
    <div className={`enterprise-funnel${activeSegment === 'small-business' ? ' enterprise-funnel--small-business' : ''}`}>
      <div className="enterprise-funnel__tabs">
        <AudienceSegmentTabs activeSegment={activeSegment} onChange={onSegmentChange} />
      </div>
      {outgoingSegment && (
        <div className="enterprise-funnel__panel is-leaving" key={`outgoing-${outgoingSegment}`} aria-hidden="true" inert>
          {renderContent(outgoingSegment)}
        </div>
      )}
      <div className={`enterprise-funnel__panel${hasSwitched ? ' has-switched' : ''}`} key={displayedSegment}>
        {renderContent(displayedSegment)}
      </div>
    </div>
  )
}
