import { AudienceSegmentTabs } from '../../features/audience-segment-section'
import { BloggersContent } from '../../features/bloggers-content'
import { SiteHeader } from '../../shared/ui/site-header'
import './BloggersPage.css'

export function BloggersPage() {
  const handleSegmentChange = (segment) => {
    if (segment === 'bloggers') return

    const destination = new URL(`${import.meta.env.BASE_URL}enterprise-hero/`, window.location.origin)
    if (segment !== 'enterprise') {
      destination.searchParams.set('segment', segment)
      destination.hash = `${segment}-content`
    }
    window.location.assign(destination)
  }

  return (
    <>
      <SiteHeader />
      <main className="bloggers-standalone" id="top">
        <div className="bloggers-standalone__tabs">
          <AudienceSegmentTabs activeSegment="bloggers" onChange={handleSegmentChange} />
        </div>
        <BloggersContent />
      </main>
    </>
  )
}
