import { BufferGeometry, ExtrudeGeometry, PlaneGeometry, Shape } from 'three'
import { mergeGeometries, toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js'

function roundedOutline(width, depth, radius) {
  const x = width / 2
  const z = depth / 2
  // Keep short straight edges between corner arcs so their bevel offsets never overlap.
  const r = Math.min(radius, x * 0.98, z * 0.98)
  const s = new Shape()
  s.moveTo(-x + r, -z)
  s.lineTo(x - r, -z)
  s.quadraticCurveTo(x, -z, x, -z + r)
  s.lineTo(x, z - r)
  s.quadraticCurveTo(x, z, x - r, z)
  s.lineTo(-x + r, z)
  s.quadraticCurveTo(-x, z, -x, z - r)
  s.lineTo(-x, -z + r)
  s.quadraticCurveTo(-x, -z, -x + r, -z)
  return s
}

// Corner radius is independent of thickness. Thin parts never have negative extrusion depths.
export class PrecisionPlateGeometry extends ExtrudeGeometry {
  constructor(width = 1, height = 0.2, depth = 1, radius = 0.14, bevel = 0.025) {
    const b = Math.min(bevel, height * 0.24, radius * 0.45)
    super(roundedOutline(width - b * 2, depth - b * 2, radius - b), {
      depth: height - b * 2, bevelEnabled: b > 0, bevelSize: b, bevelThickness: b,
      bevelSegments: 3, curveSegments: 6, steps: 1,
    })
    this.rotateX(-Math.PI / 2)
    this.translate(0, -height / 2 + b, 0)
    toCreasedNormals(this, Math.PI / 3)
  }
}

export class ArmorSectorGeometry extends ExtrudeGeometry {
  constructor(start, length, inner = 1.1, outer = 1.49, height = 0.43, bevel = 0.04) {
    const outline = new Shape()
    outline.absarc(0, 0, outer - bevel, start, start + length, false)
    outline.absarc(0, 0, inner + bevel, start + length, start, true)
    outline.closePath()
    super(outline, { depth: height - bevel * 2, bevelEnabled: true, bevelSize: bevel,
      bevelThickness: bevel, bevelSegments: 4, curveSegments: 32, steps: 1 })
    this.rotateX(-Math.PI / 2)
    this.translate(0, -height / 2 + bevel, 0)
    toCreasedNormals(this, Math.PI / 3)
  }
}

export class SideVentGeometry extends BufferGeometry {
  constructor(width, height) {
    super()
    const parts = []
    for (const side of [-1, 1]) {
      for (const z of [-0.12, -0.06, 0, 0.06, 0.12]) {
        const part = new PlaneGeometry(0.018, height * 0.27)
        part.rotateY(side * Math.PI / 2)
        part.translate(side * (width / 2 + 0.0007), -0.015, z)
        parts.push(part)
      }
    }
    const merged = mergeGeometries(parts)
    this.copy(merged)
    merged.dispose()
    parts.forEach((part) => part.dispose())
  }
}
