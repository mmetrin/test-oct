import { useEffect, useRef, useState } from 'react'

export function useRevealOnVisible({ threshold = 0.24, rootMargin = '0px 0px -10% 0px', once = true } = {}) {
  const elementRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current

    if (!element) {
      return undefined
    }

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (once && !entry.isIntersecting) {
          return
        }

        setIsVisible(entry.isIntersecting)

        if (once && entry.isIntersecting) {
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [once, rootMargin, threshold])

  return { elementRef, isVisible }
}
