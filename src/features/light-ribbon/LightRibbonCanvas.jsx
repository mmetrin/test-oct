import { useEffect, useRef } from 'react'

import './LightRibbonCanvas.css'

const FRAME_INTERVAL = 1000 / 30
const CURVE_SEGMENTS = 64

function cubicPoint(start, controlA, controlB, end, progress) {
  const inverseProgress = 1 - progress

  return {
    x:
      inverseProgress ** 3 * start.x +
      3 * inverseProgress ** 2 * progress * controlA.x +
      3 * inverseProgress * progress ** 2 * controlB.x +
      progress ** 3 * end.x,
    y:
      inverseProgress ** 3 * start.y +
      3 * inverseProgress ** 2 * progress * controlA.y +
      3 * inverseProgress * progress ** 2 * controlB.y +
      progress ** 3 * end.y,
  }
}

function drawTaperedCurve(context, points, color, getWidth) {
  context.strokeStyle = color
  context.lineCap = 'round'

  for (let index = 0; index < points.length - 1; index += 1) {
    const progress = index / (points.length - 1)
    const startPoint = points[index]
    const endPoint = points[index + 1]

    context.beginPath()
    context.lineWidth = Math.max(getWidth(progress), 0.5)
    context.moveTo(startPoint.x, startPoint.y)
    context.lineTo(endPoint.x, endPoint.y)
    context.stroke()
  }
}

function getCurvePoints(start, controlA, controlB, end) {
  return Array.from({ length: CURVE_SEGMENTS }, (_, index) => {
    return cubicPoint(start, controlA, controlB, end, index / (CURVE_SEGMENTS - 1))
  })
}

function drawRadialGlow(context, x, y, radius, color) {
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius)

  gradient.addColorStop(0, color)
  gradient.addColorStop(1, 'rgb(0 0 0 / 0%)')
  context.fillStyle = gradient
  context.beginPath()
  context.arc(x, y, radius, 0, Math.PI * 2)
  context.fill()
}

function drawRibbon(context, width, height, time) {
  context.fillStyle = '#000814'
  context.fillRect(0, 0, width, height)

  const movement = Math.sin(time * 0.8) * height * 0.006
  const start = { x: width * 0.07, y: height * 0.84 }
  const controlA = { x: width * 0.075, y: height * (0.67 + movement / height) }
  const controlB = { x: width * 0.40, y: height * (0.48 - movement / height) }
  const end = { x: width * 0.87, y: height * 0.43 }
  const lowerRibbon = getCurvePoints(start, controlA, controlB, end)

  context.globalCompositeOperation = 'screen'
  context.filter = `blur(${Math.max(width, height) * 0.045}px)`
  drawTaperedCurve(context, lowerRibbon, 'rgb(0 91 255 / 13%)', (progress) => {
    return height * (0.37 * (1 - progress ** 0.7) + 0.025)
  })

  context.filter = `blur(${Math.max(width, height) * 0.019}px)`
  drawTaperedCurve(context, lowerRibbon, 'rgb(0 143 255 / 40%)', (progress) => {
    return height * (0.25 * (1 - progress ** 0.76) + 0.014)
  })

  context.filter = `blur(${Math.max(width, height) * 0.006}px)`
  drawTaperedCurve(context, lowerRibbon, 'rgb(102 194 255 / 76%)', (progress) => {
    return height * (0.165 * (1 - progress ** 0.81) + 0.007)
  })

  context.filter = `blur(${Math.max(width, height) * 0.004}px)`
  drawTaperedCurve(context, lowerRibbon, 'rgb(236 248 255 / 94%)', (progress) => {
    return height * (0.092 * (1 - progress ** 0.84) + 0.003)
  })

  const upperStart = { x: width * 0.17, y: height * 0.45 }
  const upperControlA = { x: width * 0.44, y: height * 0.35 }
  const upperControlB = { x: width * 0.71, y: height * 0.43 }
  const upperEnd = { x: width * 0.91, y: height * 0.05 }
  const upperRibbon = getCurvePoints(upperStart, upperControlA, upperControlB, upperEnd)

  context.filter = `blur(${Math.max(width, height) * 0.013}px)`
  drawTaperedCurve(context, upperRibbon, 'rgb(34 146 255 / 32%)', () => height * 0.022)
  context.filter = `blur(${Math.max(width, height) * 0.002}px)`
  drawTaperedCurve(context, upperRibbon, 'rgb(220 244 255 / 82%)', () => height * 0.0035)

  const ghostStart = { x: width * 0.54, y: height * 0.38 }
  const ghostControlA = { x: width * 0.71, y: height * 0.26 }
  const ghostControlB = { x: width * 0.83, y: height * 0.16 }
  const ghostEnd = { x: width * 0.96, y: height * 0.04 }
  const ghostRibbon = getCurvePoints(ghostStart, ghostControlA, ghostControlB, ghostEnd)

  context.filter = `blur(${Math.max(width, height) * 0.018}px)`
  drawTaperedCurve(context, ghostRibbon, 'rgb(12 71 174 / 22%)', () => height * 0.027)

  const baseX = width * 0.12
  const baseY = height * 0.78
  drawRadialGlow(context, baseX, baseY, height * 0.27, 'rgb(105 200 255 / 17%)')
  drawRadialGlow(context, baseX, baseY, height * 0.16, 'rgb(229 247 255 / 47%)')
  drawRadialGlow(context, width * 0.74, height * 0.40, height * 0.07, 'rgb(0 159 255 / 72%)')
  drawRadialGlow(context, width * 0.74, height * 0.40, height * 0.022, 'rgb(232 249 255 / 90%)')

  context.filter = 'none'
  context.globalCompositeOperation = 'source-over'
}

export function LightRibbonCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: false })

    if (!canvas || !context) {
      return undefined
    }

    let animationFrameId = 0
    let previousFrameTime = 0
    const startTime = window.performance.now()
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    function resize() {
      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      const width = Math.round(canvas.clientWidth * devicePixelRatio)
      const height = Math.round(canvas.clientHeight * devicePixelRatio)

      if (canvas.width === width && canvas.height === height) {
        return
      }

      canvas.width = width
      canvas.height = height
    }

    function draw(currentTime) {
      resize()
      drawRibbon(context, canvas.width, canvas.height, (currentTime - startTime) / 1000)
    }

    function render(currentTime) {
      animationFrameId = window.requestAnimationFrame(render)

      if (document.hidden || currentTime - previousFrameTime < FRAME_INTERVAL) {
        return
      }

      previousFrameTime = currentTime
      draw(currentTime)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    draw(startTime)

    if (!reducedMotionQuery.matches) {
      animationFrameId = window.requestAnimationFrame(render)
    }

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
    }
  }, [])

  return <canvas className="light-ribbon-canvas" ref={canvasRef} aria-label="Анимация светового потока" />
}
