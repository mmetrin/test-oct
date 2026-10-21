import { useEffect, useRef } from 'react'
import './InteractiveWebCanvas.css'

const MAX_NODES = 300
const NEIGHBORS = 4
const PHOTO_MOTION_RADIUS = 175
const PHOTO_MOTION_FORCE = 0.18

function createWeb(width, height) {
  const targetCount = Math.min(MAX_NODES, Math.max(90, Math.round((width * height) / 3100)))
  const columns = Math.max(2, Math.round(Math.sqrt((targetCount * width) / height)))
  const rows = Math.max(2, Math.ceil(targetCount / columns))
  const stepX = width / columns
  const stepY = height / rows
  const jitter = Math.min(stepX, stepY) * 0.85
  const nodes = Array.from({ length: rows * columns }, (_, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)
    const x = (column + 0.5) * stepX + (Math.random() - 0.5) * jitter
    const y = (row + 0.5) * stepY + (Math.random() - 0.5) * jitter
    return { x, y, homeX: x, homeY: y, vx: 0, vy: 0, phase: Math.random() * Math.PI * 2 }
  })

  const edges = []
  const seen = new Set()
  const maxDistance = Math.max(stepX, stepY) * 2.15

  nodes.forEach((node, index) => {
    const nearest = []
    nodes.forEach((candidate, candidateIndex) => {
      if (candidateIndex === index) return
      const distance = Math.hypot(node.x - candidate.x, node.y - candidate.y)
      if (distance < maxDistance) nearest.push({ candidateIndex, distance })
    })
    nearest.sort((a, b) => a.distance - b.distance)
    nearest.slice(0, NEIGHBORS).forEach(({ candidateIndex, distance }) => {
      const from = Math.min(index, candidateIndex)
      const to = Math.max(index, candidateIndex)
      const key = `${from}-${to}`
      if (seen.has(key)) return
      seen.add(key)
      edges.push({ from, to, distance })
    })
  })

  return { nodes, edges, maxDistance }
}

export function InteractiveWebCanvas({ staticAreaRef }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!container || !context) return undefined

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let nodes = []
    let edges = []
    let maxDistance = 1
    let pointer = null
    let staticBounds = null
    let frame = 0
    let previousTime = 0

    const isInStaticArea = (x, y) => staticBounds
      && x >= staticBounds.left
      && x <= staticBounds.right
      && y >= staticBounds.top
      && y <= staticBounds.bottom

    const draw = () => {
      context.clearRect(0, 0, width, height)
      context.lineWidth = 0.8

      edges.forEach(({ from, to, distance }) => {
        const start = nodes[from]
        const end = nodes[to]
        const pointerDistance = pointer && !start.isPhotoNode && !end.isPhotoNode
          ? Math.min(Math.hypot(start.x - pointer.x, start.y - pointer.y), Math.hypot(end.x - pointer.x, end.y - pointer.y))
          : Infinity
        const highlight = Math.max(0, 1 - pointerDistance / 180)
        const opacity = 0.1 + (1 - distance / maxDistance) * 0.075 + highlight * 0.22
        context.strokeStyle = `rgba(27, 92, 146, ${opacity})`
        context.beginPath()
        context.moveTo(start.x, start.y)
        context.lineTo(end.x, end.y)
        context.stroke()
      })

      nodes.forEach(({ x, y, isPhotoNode }) => {
        const distance = pointer && !isPhotoNode ? Math.hypot(x - pointer.x, y - pointer.y) : Infinity
        const highlight = Math.max(0, 1 - distance / 160)
        context.fillStyle = `rgba(20, 93, 154, ${0.48 + highlight * 0.48})`
        context.beginPath()
        context.arc(x, y, 1.25 + highlight * 1.4, 0, Math.PI * 2)
        context.fill()
      })
    }

    const measureStaticArea = () => {
      const photo = staticAreaRef?.current
      if (photo) {
        const containerBounds = container.getBoundingClientRect()
        const photoBounds = photo.getBoundingClientRect()
        staticBounds = {
          left: photoBounds.left - containerBounds.left,
          right: photoBounds.right - containerBounds.left,
          top: photoBounds.top - containerBounds.top,
          bottom: photoBounds.bottom - containerBounds.top,
        }
      } else {
        staticBounds = null
      }

      nodes.forEach((node) => {
        node.isPhotoNode = Boolean(isInStaticArea(node.homeX, node.homeY))
        if (node.isPhotoNode) {
          node.x = node.homeX
          node.y = node.homeY
          node.vx = 0
          node.vy = 0
        }
      })

      if (pointer && isInStaticArea(pointer.x, pointer.y)) pointer = null
      draw()
    }

    const animate = (time) => {
      const step = Math.min(2, Math.max(0.5, (time - previousTime) / 16.67))
      previousTime = time
      const photoMotion = staticBounds && {
        x: (staticBounds.left + staticBounds.right) / 2
          + Math.cos(time * 0.00052) * (staticBounds.right - staticBounds.left) * 0.28,
        y: (staticBounds.top + staticBounds.bottom) / 2
          + Math.sin(time * 0.00067) * (staticBounds.bottom - staticBounds.top) * 0.28,
      }

      nodes.forEach((node) => {
        const drift = node.isPhotoNode ? 4 : 3
        const targetX = node.homeX + Math.sin(time * 0.00028 + node.phase) * drift
        const targetY = node.homeY + Math.cos(time * 0.00024 + node.phase) * drift
        node.vx += (targetX - node.x) * 0.012 * step
        node.vy += (targetY - node.y) * 0.012 * step

        const influence = node.isPhotoNode ? photoMotion : pointer
        if (influence) {
          const dx = node.x - influence.x
          const dy = node.y - influence.y
          const distance = Math.max(1, Math.hypot(dx, dy))
          const radius = node.isPhotoNode ? PHOTO_MOTION_RADIUS : 145
          if (distance < radius) {
            const strength = node.isPhotoNode ? PHOTO_MOTION_FORCE : 1.7
            const force = Math.pow(1 - distance / radius, 2) * strength * step
            node.vx += (dx / distance) * force
            node.vy += (dy / distance) * force
          }
        }

        node.vx *= Math.pow(0.92, step)
        node.vy *= Math.pow(0.92, step)
        node.x += node.vx * step
        node.y += node.vy * step
      })

      draw()
      frame = window.requestAnimationFrame(animate)
    }

    const rebuild = () => {
      width = container.clientWidth
      height = container.clientHeight
      canvas.width = Math.max(1, Math.round(width * pixelRatio))
      canvas.height = Math.max(1, Math.round(height * pixelRatio))
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      const web = createWeb(width, height)
      nodes = web.nodes
      edges = web.edges
      maxDistance = web.maxDistance
      measureStaticArea()
    }

    const onPointerMove = (event) => {
      const bounds = container.getBoundingClientRect()
      const x = event.clientX - bounds.left
      const y = event.clientY - bounds.top
      pointer = isInStaticArea(x, y) ? null : { x, y }
      if (motionPreference.matches) draw()
    }

    const onPointerLeave = () => {
      pointer = null
      if (motionPreference.matches) draw()
    }

    const onMotionChange = () => {
      window.cancelAnimationFrame(frame)
      frame = 0
      if (motionPreference.matches) {
        draw()
      } else {
        previousTime = performance.now()
        frame = window.requestAnimationFrame(animate)
      }
    }

    const resizeObserver = new ResizeObserver(rebuild)
    resizeObserver.observe(container)
    const photoObserver = new ResizeObserver(measureStaticArea)
    if (staticAreaRef?.current) photoObserver.observe(staticAreaRef.current)
    rebuild()
    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('pointerleave', onPointerLeave)
    motionPreference.addEventListener('change', onMotionChange)
    onMotionChange()

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      photoObserver.disconnect()
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerleave', onPointerLeave)
      motionPreference.removeEventListener('change', onMotionChange)
    }
  }, [staticAreaRef])

  return (
    <div className="interactive-web-canvas" ref={containerRef}>
      <canvas aria-hidden="true" ref={canvasRef} />
    </div>
  )
}
