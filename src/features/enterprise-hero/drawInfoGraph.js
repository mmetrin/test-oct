import { drawCurve, graphCurveLineWidth } from './graphCurve'

const graphGrowthSeconds = 4
const conversionGrowthSeconds = 5.4
const cardFill = 'rgb(222 226 238 / 70%)'
const cardHeightRatio = .61
const graphPalettes = {
  dark: { line: '#526b7c', barBottom: '#526b7c', barTop: '#829aab' },
  light: { line: '#96aebf', barBottom: '#486777', barTop: '#7896a8' },
}

function clamp(progress) {
  return Math.min(1, Math.max(0, progress))
}

function smoothstep(progress) {
  const value = clamp(progress)
  return value * value * (3 - 2 * value)
}

function mapConversionCurvePoint(point) {
  const progress = (point.x - 23) / 203
  const straightY = 196 - 112 * progress
  return {
    x: 27 + progress * 196,
    y: 133 - 63 * progress + (point.y - straightY) * .3,
  }
}

export function getConversionValue(elapsedSeconds) {
  const progress = clamp(elapsedSeconds / conversionGrowthSeconds)
  return Math.round(99 * progress) / 10
}

function drawCardBackground(context, x, y, size, fill, backdrop, widthRatio = 1) {
  // Canvas graphs are scaled down; keep the radius and border in stage pixels,
  // matching the CSS metric cards rather than scaling their decoration too.
  const scale = Math.abs(context.getTransform().a) || 1
  const radius = (backdrop?.radius ?? 24) / scale
  const border = 1 / scale
  const width = size * widthRatio
  const height = size * cardHeightRatio
  context.beginPath()
  context.roundRect(x, y, width, height, radius)
  context.clip()
  if (backdrop) {
    context.save()
    context.filter = 'blur(2px)'
    context.drawImage(backdrop.source, backdrop.x, backdrop.y, backdrop.width, backdrop.height)
    context.restore()
  }
  context.fillStyle = fill
  context.fillRect(x, y, width, height)
  context.beginPath()
  context.roundRect(x + border / 2, y + border / 2, width - border, height - border, radius - border / 2)
  context.lineWidth = border
  context.strokeStyle = 'rgb(255 255 255 / 16%)'
  context.stroke()
}

export function drawInfoGraph(context, x, y, size, elapsedSeconds, tone = 'dark', backdrop, graphOpacity = 1) {
  context.save()
  drawCardBackground(context, x, y, size, cardFill, backdrop)
  context.translate(x, y)
  context.scale(size / 250, size / 250)
  context.globalAlpha *= graphOpacity

  const lineDelay = 0.35
  const lineProgress = .5 + .5 * smoothstep((elapsedSeconds - lineDelay) / (graphGrowthSeconds - lineDelay))

  context.lineCap = 'round'
  context.lineJoin = 'round'
  context.lineWidth = graphCurveLineWidth
  context.strokeStyle = graphPalettes[tone].line
  drawCurve(context, lineProgress, mapConversionCurvePoint)
  context.stroke()

  const marker = drawCurve(context, lineProgress, mapConversionCurvePoint)
  context.beginPath()
  context.arc(marker.x, marker.y, 12, 0, Math.PI * 2)
  context.fillStyle = 'rgb(255 255 255 / 22%)'
  context.fill()
  context.lineWidth = 1.5
  context.strokeStyle = 'rgb(255 255 255 / 68%)'
  context.stroke()
  context.beginPath()
  context.arc(marker.x, marker.y, 5.5, 0, Math.PI * 2)
  context.fillStyle = graphPalettes[tone].line
  context.fill()

  context.restore()
}

export function drawInfoBarGraph(context, x, y, size, elapsedSeconds, tone = 'dark', backdrop, graphOpacity = 1) {
  context.save()
  drawCardBackground(context, x, y, size, cardFill, backdrop, 0.9)
  context.translate(x, y)
  context.scale(size / 250, size / 250)
  context.globalAlpha *= graphOpacity

  const barHeights = [48, 68, 58, 82, 100, 116]
  const baseline = 143
  const barFill = context.createLinearGradient(0, baseline, 0, 60)
  barFill.addColorStop(0, graphPalettes[tone].barBottom)
  barFill.addColorStop(1, graphPalettes[tone].barTop)
  context.fillStyle = barFill

  barHeights.forEach((targetHeight, index) => {
    const delay = index * 0.16
    const progress = clamp((elapsedSeconds - delay) / (graphGrowthSeconds - delay))
    const height = targetHeight * (.62 + .38 * smoothstep(progress))
    if (height <= 0) return
    context.beginPath()
    context.roundRect(34 + index * 30, baseline - height, 12, height, 6)
    context.fill()
  })

  context.restore()
}
