import { useEffect, useRef, useState } from 'react'

function interpolateDataset(from, to, progress) {
  return Object.fromEntries(Object.entries(to).map(([group, items]) => [group, items.map((item, index) => {
    const previous = from[group][index]
    return Object.fromEntries(Object.entries(item).map(([key, value]) => [key,
      typeof value === 'number' ? previous[key] + (value - previous[key]) * progress : value,
    ]))
  })]))
}

export function useAudienceTransition(target) {
  const [displayed, setDisplayed] = useState(target)
  const current = useRef(target)

  useEffect(() => {
    const from = current.current
    if (from === target) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      current.current = target
      setDisplayed(target)
      return
    }
    let frame
    let started
    const animate = (time) => {
      started ??= time
      const progress = Math.min((time - started) / 1450, 1)
      // Ease gently into and out of the change, with no initial burst of speed.
      const eased = progress ** 3 * (progress * (progress * 6 - 15) + 10)
      current.current = progress === 1 ? target : interpolateDataset(from, target, eased)
      setDisplayed(current.current)
      if (progress < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [target])

  return displayed
}
