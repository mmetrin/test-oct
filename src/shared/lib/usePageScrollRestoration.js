import { useEffect } from 'react'

const PAGE_SCROLL_STORAGE_KEY = 'mts-ads-page-scroll-position'

export function usePageScrollRestoration() {
  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    const savedScrollPosition = Number(window.sessionStorage.getItem(PAGE_SCROLL_STORAGE_KEY))

    let frame
    let settle
    let restore
    if (Number.isFinite(savedScrollPosition) && !window.location.hash) {
      // Restore after the first layout and once more after media/assets settle.
      restore = () => window.scrollTo({ top: savedScrollPosition, behavior: 'auto' })
      frame = window.requestAnimationFrame(restore)
      settle = window.setTimeout(restore, 180)

      window.addEventListener('pageshow', restore)

    }

    function saveScrollPosition() {
      window.sessionStorage.setItem(PAGE_SCROLL_STORAGE_KEY, String(window.scrollY))
    }

    window.addEventListener('scroll', saveScrollPosition, { passive: true })
    window.addEventListener('pagehide', saveScrollPosition)

    return () => {
      saveScrollPosition()
      window.removeEventListener('scroll', saveScrollPosition)
      window.removeEventListener('pagehide', saveScrollPosition)
      if (frame) window.cancelAnimationFrame(frame)
      if (settle) window.clearTimeout(settle)
      if (restore) window.removeEventListener('pageshow', restore)
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])
}
