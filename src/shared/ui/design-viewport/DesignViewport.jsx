import { useLayoutEffect, useRef } from 'react'
import { getDesignScale } from './designScale'
import './DesignViewport.css'

const DESIGN_WIDTH = 1920

function useDesktopStyles() {
  useLayoutEffect(() => {
    const changes = []
    const visited = new WeakSet()

    const frozenQuery = (matches) => matches ? '(min-width: 0px)' : '(max-width: 0px)'
    const freezeMediaWidth = (css) => css
      .replace(/\((min|max)-width:\s*([\d.]+)px\)/g, (_, bound, width) =>
        frozenQuery(bound === 'min' ? DESIGN_WIDTH >= Number(width) : DESIGN_WIDTH <= Number(width)))
      .replace(/\(width\s*(<=|>=)\s*([\d.]+)px\)/g, (_, bound, width) =>
        frozenQuery(bound === '>=' ? DESIGN_WIDTH >= Number(width) : DESIGN_WIDTH <= Number(width)))

    const freezeViewportWidth = (css) => css
      .replace(/(-?[\d.]+)vw\b/g, (_, amount) => `${Number(amount) * DESIGN_WIDTH / 100}px`)

    const freezeRules = (rules) => {
      for (const rule of rules) {
        if (visited.has(rule)) continue
        visited.add(rule)

        if (rule instanceof CSSMediaRule) {
          const original = rule.media.mediaText
          const frozen = freezeMediaWidth(original)
          if (frozen !== original) {
            rule.media.mediaText = frozen
            changes.push(() => { rule.media.mediaText = original })
          }
        }

        if (rule.style) {
          for (const name of [...rule.style]) {
            const original = rule.style.getPropertyValue(name)
            const frozen = freezeViewportWidth(original)
            if (frozen === original) continue
            const priority = rule.style.getPropertyPriority(name)
            rule.style.setProperty(name, frozen, priority)
            changes.push(() => rule.style.setProperty(name, original, priority))
          }
        }

        if (rule.cssRules) freezeRules(rule.cssRules)
      }
    }

    const syncStyles = () => {
      for (const sheet of document.styleSheets) {
        try {
          freezeRules(sheet.cssRules)
        } catch {
          // Cross-origin stylesheets cannot be inspected.
        }
      }
    }

    syncStyles()
    // Vite replaces style elements during hot reload.
    const observer = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => [...mutation.addedNodes]
        .some((node) => node.nodeName === 'STYLE' || node.nodeName === 'LINK'))) syncStyles()
    })
    observer.observe(document.head, { childList: true })

    return () => {
      observer.disconnect()
      changes.reverse().forEach((restore) => restore())
    }
  }, [])
}

export function DesignViewport({ children }) {
  const viewportRef = useRef(null)
  useDesktopStyles()

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    document.body.classList.add('design-viewport-active')

    const syncScale = () => {
      const scale = getDesignScale()
      viewport.style.zoom = String(scale)
      document.documentElement.style.setProperty('--design-scale', String(scale))
    }

    window.addEventListener('resize', syncScale)
    syncScale()

    return () => {
      window.removeEventListener('resize', syncScale)
      document.body.classList.remove('design-viewport-active')
      document.documentElement.style.removeProperty('--design-scale')
    }
  }, [])

  return <div className="design-viewport" ref={viewportRef}>{children}</div>
}
