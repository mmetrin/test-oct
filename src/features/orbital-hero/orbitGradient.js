import { Color, Float32BufferAttribute } from 'three'

// A brighter, more saturated blue, sky and peach loop, lit by the studio.
const palette = ['#087df8', '#17b3fa', '#48d1ff', '#ffab85'].map((value) => new Color(value))

export function applyOrbitGradient(geometry, offset = 0) {
  const position = geometry.getAttribute('position')
  const values = new Float32Array(position.count * 3)
  const color = new Color()
  for (let i = 0; i < position.count; i += 1) {
    const phase = ((Math.atan2(position.getY(i), position.getX(i)) / (Math.PI * 2) + offset + 1) % 1) * palette.length
    const stop = Math.floor(phase)
    const fraction = phase - stop
    const blend = fraction * fraction * (3 - 2 * fraction)
    color.copy(palette[stop]).lerp(palette[(stop + 1) % palette.length], blend)
    color.toArray(values, i * 3)
  }
  geometry.setAttribute('color', new Float32BufferAttribute(values, 3))
}
