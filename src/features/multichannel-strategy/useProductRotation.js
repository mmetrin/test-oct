import { useEffect, useState } from 'react'

const ROTATION_INTERVAL = 8000

export function useProductRotation(stageRef, enabled, productCount) {
  const [rotation, setRotation] = useState({ current: 0, previous: null, cycle: 0 })

  useEffect(() => {
    if (!enabled || productCount < 2) return
    const stage = stageRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const isCard = (element) => element instanceof Element && Boolean(element.closest('.strategy-channel__card'))
    let visible = false
    let hovered = Boolean(stage.querySelector('.strategy-channel__card:hover'))
    let focused = isCard(document.activeElement)
    let interval
    const sync = () => {
      window.clearInterval(interval)
      if (!visible || hovered || focused || document.hidden || reducedMotion.matches) return
      interval = window.setInterval(() => {
        setRotation(({ current, cycle }) => ({
          previous: current,
          current: (current + productCount - 1) % productCount,
          cycle: cycle + 1,
        }))
      }, ROTATION_INTERVAL)
    }
    const onPointerOver = (event) => {
      if (event.pointerType === 'touch') return
      const next = isCard(event.target)
      if (next !== hovered) { hovered = next; sync() }
    }
    const onPointerOut = (event) => {
      if (event.pointerType === 'touch') return
      const next = isCard(event.relatedTarget)
      if (next !== hovered) { hovered = next; sync() }
    }
    const onFocusIn = (event) => { focused = isCard(event.target); sync() }
    const onFocusOut = (event) => { focused = isCard(event.relatedTarget); sync() }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    observer.observe(stage)
    stage.addEventListener('pointerover', onPointerOver)
    stage.addEventListener('pointerout', onPointerOut)
    stage.addEventListener('focusin', onFocusIn)
    stage.addEventListener('focusout', onFocusOut)
    document.addEventListener('visibilitychange', sync)
    reducedMotion.addEventListener('change', sync)
    return () => {
      window.clearInterval(interval)
      observer.disconnect()
      stage.removeEventListener('pointerover', onPointerOver)
      stage.removeEventListener('pointerout', onPointerOut)
      stage.removeEventListener('focusin', onFocusIn)
      stage.removeEventListener('focusout', onFocusOut)
      document.removeEventListener('visibilitychange', sync)
      reducedMotion.removeEventListener('change', sync)
    }
  }, [stageRef, enabled, productCount])

  return rotation
}
