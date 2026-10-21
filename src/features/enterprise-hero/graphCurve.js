export const graphCurveLineWidth = 4.5

const curveSegments = [
  [[23, 171], [44, 139], [63, 112], [82, 127]],
  [[82, 127], [104, 147], [117, 151], [137, 139]],
  [[137, 139], [155, 128], [175, 153], [189, 119]],
  [[189, 119], [201, 91], [211, 100], [226, 59]],
]
const curveOffsetY = 25

function cubicPoint([start, controlA, controlB, end], progress) {
  const inverse = 1 - progress
  return {
    x: inverse ** 3 * start[0] + 3 * inverse ** 2 * progress * controlA[0]
      + 3 * inverse * progress ** 2 * controlB[0] + progress ** 3 * end[0],
    y: inverse ** 3 * start[1] + 3 * inverse ** 2 * progress * controlA[1]
      + 3 * inverse * progress ** 2 * controlB[1] + progress ** 3 * end[1] + curveOffsetY,
  }
}

const curvePoints = curveSegments.flatMap((segment, segmentIndex) =>
  Array.from({ length: 37 }, (_, pointIndex) => cubicPoint(segment, pointIndex / 36))
    .slice(segmentIndex === 0 ? 0 : 1),
)

const curveDistances = [0]
for (let index = 1; index < curvePoints.length; index += 1) {
  const previous = curvePoints[index - 1]
  const current = curvePoints[index]
  curveDistances.push(curveDistances[index - 1] + Math.hypot(current.x - previous.x, current.y - previous.y))
}
const curveLength = curveDistances.at(-1)

export function drawCurve(context, progress, mapPoint = (point) => point) {
  const targetDistance = Math.min(1, Math.max(0, progress)) * curveLength
  context.beginPath()
  const start = mapPoint(curvePoints[0])
  context.moveTo(start.x, start.y)

  for (let index = 1; index < curvePoints.length; index += 1) {
    const point = curvePoints[index]
    if (curveDistances[index] >= targetDistance) {
      const previous = curvePoints[index - 1]
      const segmentLength = curveDistances[index] - curveDistances[index - 1]
      const fraction = segmentLength ? (targetDistance - curveDistances[index - 1]) / segmentLength : 0
      const marker = mapPoint({
        x: previous.x + (point.x - previous.x) * fraction,
        y: previous.y + (point.y - previous.y) * fraction,
      })
      context.lineTo(marker.x, marker.y)
      return marker
    }
    const mappedPoint = mapPoint(point)
    context.lineTo(mappedPoint.x, mappedPoint.y)
  }

  return mapPoint(curvePoints.at(-1))
}
