import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { EnterpriseFunnelSection } from './EnterpriseFunnelSection'
import { EnterpriseContentSection } from '../../features/enterprise-content/EnterpriseContentSection'
import { EnterpriseHero } from '../../features/enterprise-hero/EnterpriseHero'
import { EnterprisePartnerLogos } from '../../features/enterprise-hero/EnterprisePartnerLogos'
import { usePageScrollRestoration } from '../../shared/lib/usePageScrollRestoration'
import { SiteHeader } from '../../shared/ui/site-header'
import { getDesignScale } from '../../shared/ui/design-viewport'
import './EnterpriseFigmaVariables.css'
import './EnterpriseHeroPage.css'

export function EnterpriseHeroPage() {
  const [videoChangeCount, setVideoChangeCount] = useState(0)
  const [areLogosVisible, setAreLogosVisible] = useState(false)
  const [activeSegment, setActiveSegment] = useState(
    () => new URLSearchParams(window.location.search).get('segment') || 'enterprise',
  )
  const pageRef = useRef(null)
  usePageScrollRestoration()

  useEffect(() => {
    const updateLogosVisibility = () => setAreLogosVisible(window.scrollY >= 48)
    window.addEventListener('scroll', updateLogosVisibility, { passive: true })
    updateLogosVisibility()

    return () => window.removeEventListener('scroll', updateLogosVisibility)
  }, [])

  useEffect(() => {
    const sectionId = window.location.hash.slice(1)
    if (!['small-business-content', 'publishers-content', 'bloggers-content'].includes(sectionId)) return undefined
    const showSection = () => document.getElementById(sectionId)?.scrollIntoView()
    const frame = window.requestAnimationFrame(showSection)
    const settle = window.setTimeout(showSection, 220)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(settle)
    }
  }, [])

  useLayoutEffect(() => {
    const page = pageRef.current
    const hero = page?.querySelector('.enterprise-hero')
    const facts = hero?.querySelector('.enterprise-hero__facts')
    const logos = page?.querySelector('.enterprise-partner-logos')
    const copy = hero?.querySelector('.enterprise-hero__copy')
    if (!hero || !facts || !logos || !copy) return undefined

    const syncLogoPosition = () => {
      const gap = (facts.getBoundingClientRect().bottom - hero.getBoundingClientRect().bottom) / getDesignScale() + 70
      logos.style.marginTop = `${gap}px`
    }

    const observer = new ResizeObserver(syncLogoPosition)
    observer.observe(hero)
    observer.observe(copy)
    observer.observe(facts)
    window.addEventListener('resize', syncLogoPosition)
    syncLogoPosition()

    let isMounted = true
    document.fonts?.ready.then(() => {
      if (isMounted) syncLogoPosition()
    })

    return () => {
      isMounted = false
      observer.disconnect()
      window.removeEventListener('resize', syncLogoPosition)
      logos.style.removeProperty('margin-top')
    }
  }, [])

  const changeSegment = (segment) => {
    setActiveSegment(segment)
    const url = new URL(window.location.href)
    if (segment === 'enterprise') url.searchParams.delete('segment')
    else url.searchParams.set('segment', segment)
    url.hash = ''
    window.history.replaceState(null, '', url)
  }

  return (
    <main className="enterprise-hero-page" ref={pageRef}>
      <SiteHeader />
      <EnterpriseHero
        leadershipOnly
        showTrustCopy
        showHeader={false}
        onVideoChange={() => setVideoChangeCount((count) => count + 1)}
      />
      <EnterprisePartnerLogos videoChangeCount={videoChangeCount} visible={areLogosVisible} />
      <EnterpriseFunnelSection activeSegment={activeSegment} onSegmentChange={changeSegment} />
      {activeSegment === 'enterprise' && (
        <>
          <section className="enterprise-hero-page__big-data" aria-labelledby="enterprise-big-data-title">
            <h2 id="enterprise-big-data-title">тут биг дата</h2>
          </section>
          <EnterpriseContentSection />
        </>
      )}
    </main>
  )
}
