// Sample the exported Figma contour itself. It is a Bézier oval, not a
// mathematical ellipse. Re-measure after scaling so the dots keep even speed.
export function createOrbitMotion(svgSource) {
  const document = new DOMParser().parseFromString(svgSource, 'image/svg+xml')
  const svg = document.documentElement
  const path = svg.querySelector(':scope > path')
  const { width: sourceWidth, height: sourceHeight } = svg.viewBox.baseVal
  const sourceLength = path.getTotalLength()
  const samples = Array.from({ length: 1025 }, (_, index) => {
    const point = path.getPointAtLength(sourceLength * index / 1024)
    return { x: point.x / sourceWidth, y: point.y / sourceHeight }
  })
  let distances = []
  let length = 0

  const resize = (width, height) => {
    length = 0
    distances = samples.map((point, index) => {
      if (index) {
        const previous = samples[index - 1]
        length += Math.hypot((point.x - previous.x) * width, (point.y - previous.y) * height)
      }
      return length
    })
  }

  const pointAt = (progress) => {
    const distance = ((progress % 1 + 1) % 1) * length
    let low = 0
    let high = distances.length - 1
    while (high - low > 1) {
      const middle = Math.floor((low + high) / 2)
      if (distances[middle] < distance) low = middle
      else high = middle
    }
    const span = distances[high] - distances[low]
    const mix = span ? (distance - distances[low]) / span : 0
    return {
      x: samples[low].x + (samples[high].x - samples[low].x) * mix,
      y: samples[low].y + (samples[high].y - samples[low].y) * mix,
    }
  }

  const progressNear = (x, y) => {
    let closest = 0
    let closestDistance = Infinity
    samples.forEach((point, index) => {
      const distance = (point.x - x) ** 2 + (point.y - y) ** 2
      if (distance < closestDistance) {
        closest = index
        closestDistance = distance
      }
    })
    return length ? distances[closest] / length : 0
  }

  return { resize, pointAt, progressNear, pathData: path.getAttribute('d') }
}
