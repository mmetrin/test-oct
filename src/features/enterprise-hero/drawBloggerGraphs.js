import { graphCurveLineWidth } from './graphCurve'

const growthSeconds = 4
const curveGrowthSeconds = 2.8
const toyRevealSeconds = 3
const impressionsColor = '#718b9d'
const incomeColor = '#a9becc'
const darkInk = '#4e6879'
const cardFill = 'rgb(230 240 249 / 74%)'
const impressionsCurve = [0, 0.3, 0.48, 0.45, 0.64, 0.61, 0.81, 0.77, 1]
const incomeCurve = [0, 0.24, 0.39, 0.5, 0.47, 0.65, 0.77, 0.73, 1]

function clamp(value) {
  return Math.min(1, Math.max(0, value))
}

function easeOut(value) {
  return 1 - (1 - clamp(value)) ** 3
}

function smoothstep(value) {
  const progress = clamp(value)
  return progress * progress * (3 - 2 * progress)
}

function drawToyBrick(context, x, y, width, color, progress) {
  if (progress <= 0) return
  context.save()
  context.globalAlpha *= progress
  context.translate(x, y - 14 * (1 - progress))
  context.scale(0.86, 0.86)

  // A simple side silhouette keeps the toy in the same visual language as the bars.
  const studs = Math.round(width / 33.5)
  const spacing = width / studs
  context.fillStyle = color
  for (let index = 0; index < studs; index += 1) {
    context.beginPath()
    context.roundRect(index * spacing + (spacing - 17) / 2, -10, 17, 14, 4)
    context.fill()
  }
  context.beginPath()
  context.roundRect(0, 0, width, 35, 7)
  context.fill()

  // A restrained edge highlight suggests plastic without a separate 3D style.
  context.beginPath()
  context.moveTo(8, 3)
  context.lineTo(width - 8, 3)
  context.lineWidth = 1.5
  context.strokeStyle = 'rgb(255 255 255 / 24%)'
  context.stroke()
  context.restore()
}

function drawToy(context, elapsedSeconds) {
  // Two separated bricks: a shorter light-blue piece above the royal-blue base.
  drawToyBrick(context, 88, 169, 134, '#2766d9', smoothstep(elapsedSeconds / toyRevealSeconds))
  drawToyBrick(context, 146, 112, 80, '#508be4', smoothstep((elapsedSeconds - 0.65) / toyRevealSeconds))
}

function drawGrowthCurve(context, progress, height, color, values) {
  const pointAt = (position) => {
    const scaled = position * (values.length - 1)
    const index = Math.min(values.length - 2, Math.floor(scaled))
    const t = scaled - index
    const before = values[Math.max(0, index - 1)]
    const start = values[index]
    const end = values[index + 1]
    const after = values[Math.min(values.length - 1, index + 2)]
    const rise = 0.5 * ((2 * start) + (-before + end) * t
      + (2 * before - 5 * start + 4 * end - after) * t ** 2
      + (-before + 3 * start - 3 * end + after) * t ** 3)
    return { x: 25 + 200 * position, y: 218 - height * rise }
  }
  context.beginPath()
  context.moveTo(25, 218)
  for (let index = 1; index <= 80; index += 1) {
    const point = pointAt(progress * index / 80)
    context.lineTo(point.x, point.y)
  }
  const marker = pointAt(progress)
  context.strokeStyle = color
  context.lineWidth = graphCurveLineWidth
  context.lineCap = 'round'
  context.lineJoin = 'round'
  context.stroke()

  context.beginPath()
  context.arc(marker.x, marker.y, 10, 0, Math.PI * 2)
  context.fillStyle = 'rgb(255 255 255 / 22%)'
  context.fill()
  context.lineWidth = 1.5
  context.strokeStyle = 'rgb(255 255 255 / 68%)'
  context.stroke()
  context.beginPath()
  context.arc(marker.x, marker.y, 5, 0, Math.PI * 2)
  context.fillStyle = color
  context.fill()
}

export function drawImpressionsRevenueGraph(context, x, y, size, elapsedSeconds) {
  context.save()
  context.beginPath()
  context.roundRect(x, y, size, size, 40)
  context.clip()
  context.fillStyle = cardFill
  context.fillRect(x, y, size, size)
  context.translate(x, y)
  context.scale(size / 250, size / 250)

  context.font = '400 16px "MTS Text", Arial, sans-serif'
  const legends = [['Клики', impressionsColor], ['Доход', incomeColor]]
  let labelX = 20
  legends.forEach(([label, color]) => {
    context.beginPath()
    context.roundRect(labelX, 33, 17, 3, 1.5)
    context.fillStyle = color
    context.fill()
    context.fillStyle = darkInk
    context.fillText(label, labelX + 26, 40)
    labelX += 26 + context.measureText(label).width + 12
  })

  const progress = clamp(elapsedSeconds / curveGrowthSeconds)
  if (progress > 0) {
    drawGrowthCurve(context, progress, 96, incomeColor, incomeCurve)
    drawGrowthCurve(context, progress, 140, impressionsColor, impressionsCurve)
  }
  context.restore()
}

export function drawImpressionsToyGraph(context, x, y, size, elapsedSeconds) {
  context.save()
  context.beginPath()
  context.roundRect(x, y, size, size, 40)
  context.clip()
  context.fillStyle = cardFill
  context.fillRect(x, y, size, size)
  context.translate(x, y)
  context.scale(size / 250, size / 250)

  drawToy(context, elapsedSeconds)
  context.font = '400 16px "MTS Text", Arial, sans-serif'
  context.fillStyle = darkInk
  const label = 'Показы:'
  context.fillText(label, 20, 36)
  const countX = 20 + context.measureText(label).width + 8
  context.font = '400 22px "MTS Text", Arial, sans-serif'
  context.fillStyle = '#718b9d'
  const count = Math.round(192822 * easeOut(elapsedSeconds / growthSeconds))
  context.fillText(count.toLocaleString('ru-RU'), countX, 36)
  context.restore()
}
