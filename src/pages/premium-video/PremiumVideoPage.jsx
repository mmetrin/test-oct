import { useEffect } from 'react'

import { AdvantagesSection } from '../../features/advantages-section'
import { HeroSection } from '../../features/hero-section'
import { LeadCaptureSection } from '../../features/lead-capture'
import { PremiumVideoTransition } from '../../features/premium-video-transition'
import { usePageReady } from '../../shared/lib/usePageReady'
import { useScrollReveal } from '../../shared/lib/useScrollReveal'
import { SiteHeader } from '../../shared/ui/site-header'
import { SiteFooter } from '../../shared/ui/site-sections'
import './PremiumVideoPage.css'

const LEAD_FORM_SCROLL_OFFSET = 200
const LEAD_FORM_SCROLL_DURATION = 900

function easeInOutCubic(progress) {
  return progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2
}

function getOffsetScrollTop(element, offset) {
  const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight
  const targetScrollTop = window.scrollY + element.getBoundingClientRect().top - offset

  return Math.min(Math.max(targetScrollTop, 0), maxScrollTop)
}

function animateScrollToElement(element, offset, duration) {
  const startScrollTop = window.scrollY
  const initialTargetScrollTop = getOffsetScrollTop(element, offset)
  const distance = initialTargetScrollTop - startScrollTop
  const startTime = window.performance.now()

  if (Math.abs(distance) < 1) {
    return
  }

  function tick(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1)
    const easedProgress = easeInOutCubic(progress)

    window.scrollTo({
      top: startScrollTop + distance * easedProgress,
      left: 0,
      behavior: 'auto',
    })

    if (progress < 1) {
      window.requestAnimationFrame(tick)

      return
    }

    window.scrollTo({
      top: getOffsetScrollTop(element, offset),
      left: 0,
      behavior: 'auto',
    })
  }

  window.requestAnimationFrame(tick)
}

export function PremiumVideoPage() {
  const isReady = usePageReady(100)

  useScrollReveal()

  useEffect(() => {
    function scrollToLeadForm() {
      const form = document.getElementById('lead-form')

      if (!form) {
        return
      }

      animateScrollToElement(form, LEAD_FORM_SCROLL_OFFSET, LEAD_FORM_SCROLL_DURATION)
    }

    function handleDocumentClick(event) {
      if (!(event.target instanceof Element)) {
        return
      }

      const leadFormLink = event.target.closest('a[href="#lead-form"]')

      if (!leadFormLink) {
        return
      }

      event.preventDefault()
      window.history.pushState(null, '', '#lead-form')
      scrollToLeadForm()
    }

    document.addEventListener('click', handleDocumentClick)

    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [])

  return (
    <>
    <SiteHeader />
    <main className={`premium-video-page${isReady ? ' premium-video-page--ready' : ''}`} id="top">
      <HeroSection />
      <AdvantagesSection />
      <PremiumVideoTransition />
      <LeadCaptureSection />
      <SiteFooter />
    </main>
    </>
  )
}
