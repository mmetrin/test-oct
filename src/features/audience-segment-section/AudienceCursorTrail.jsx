import { useEffect, useRef, useState } from 'react'
import './AudienceCursorTrail.css'

const patterns = [
  '   ─ ─ ─\n < < < < <\n   ─ < <',
  '  · 0 1 ·\n< < < ─ ─\n  1 0 ·',
  '─ ─ < < <\n  < < < <\n    ─ ─',
  '  { } ─\n< < · [ ]\n  ─ < <',
  '   · : ·\n < 0 1 < <\n─ ─ < <',
]

const MAX_MARKS = 12
const EMIT_INTERVAL_MS = 85
const MIN_DISTANCE_PX = 14
const GRID = { x: 8, y: 12 }

export function AudienceCursorTrail() {
  const [marks, setMarks] = useState([])
  const haloRef = useRef(null)
  const previous = useRef({ time: -Infinity, x: 0, y: 0, sequence: 0 })
  const frameRef = useRef(null)
  const pointerRef = useRef(null)

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  function handlePointerMove(event) {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    pointerRef.current = {
      element: event.currentTarget,
      clientX: event.clientX,
      clientY: event.clientY,
      time: event.timeStamp,
    }
    // Coalesce high-frequency pointer events; read layout once per rendered frame.
    if (frameRef.current === null) frameRef.current = requestAnimationFrame(updateTrail)
  }

  function updateTrail() {
    frameRef.current = null
    const { element, clientX, clientY, time } = pointerRef.current
    const last = previous.current
    const bounds = element.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return
    // Convert viewport coordinates back into the scaled 1440px scene.
    const x = (clientX - bounds.left) * (element.clientWidth / bounds.width)
    const y = (clientY - bounds.top) * (element.clientHeight / bounds.height)
    if (haloRef.current) {
      haloRef.current.style.transform = `translate(${x}px, ${y}px)`
      haloRef.current.dataset.visible = 'true'
    }
    if (time - last.time < EMIT_INTERVAL_MS) return
    if (Math.hypot(x - last.x, y - last.y) < MIN_DISTANCE_PX) return

    const id = last.sequence + 1
    previous.current = { time, x, y, sequence: id }
    const mark = {
      id,
      x: Math.round(x / GRID.x) * GRID.x,
      y: Math.round(y / GRID.y) * GRID.y,
      text: patterns[id % patterns.length],
      // The cursor zone starts at scene x=610; fade as it reaches partner logos.
      opacity: 1 - 0.65 * Math.min(1, Math.max(0, (x - 270) / 130)),
    }
    setMarks((current) => [...current.slice(-(MAX_MARKS - 1)), mark])
  }

  function removeMark(id) {
    setMarks((current) => current.filter((mark) => mark.id !== id))
  }

  function hideHalo() {
    cancelAnimationFrame(frameRef.current)
    frameRef.current = null
    if (haloRef.current) haloRef.current.dataset.visible = 'false'
  }

  return (
    <>
      {/* Keep the blur outside the masked zone so it can sample the scene behind it. */}
      <div className="audience-data-scene__cursor-halo" ref={haloRef} aria-hidden="true" />
      <div
        className="audience-data-scene__cursor-zone"
        onPointerMove={handlePointerMove}
        onPointerLeave={hideHalo}
        onPointerCancel={hideHalo}
        aria-hidden="true"
      >
        {marks.map((mark) => (
          <span
            className="audience-data-scene__cursor-mark"
            key={mark.id}
            style={{ left: `${mark.x}px`, top: `${mark.y}px`, '--mark-drift': `${100 + (mark.id % 4) * 24}px`, '--mark-opacity': mark.opacity }}
            onAnimationEnd={() => removeMark(mark.id)}
          >
            {mark.text}
          </span>
        ))}
      </div>
    </>
  )
}
