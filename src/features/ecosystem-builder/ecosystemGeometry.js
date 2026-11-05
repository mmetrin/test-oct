import { ExtrudeGeometry, Path, Shape } from 'three'
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js'

function roundedPath(path, width, height, radius) {
  const x = -width / 2, y = -height / 2
  const r = Math.min(radius, width / 2, height / 2)
  path.moveTo(x + r, y)
  path.lineTo(x + width - r, y)
  path.quadraticCurveTo(x + width, y, x + width, y + r)
  path.lineTo(x + width, y + height - r)
  path.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  path.lineTo(x + r, y + height)
  path.quadraticCurveTo(x, y + height, x, y + height - r)
  path.lineTo(x, y + r)
  path.quadraticCurveTo(x, y, x + r, y)
  path.closePath()
  return path
}

export class ChassisGeometry extends ExtrudeGeometry {
  constructor(width = 3, height = 3, depth = 0.5, wall = 0.2) {
    const bevel = Math.min(0.035, wall / 4, depth / 4)
    // The bevel is included in the requested dimensions, so adjacent parts
    // retain their intentional clearances instead of silently intersecting.
    const outer = roundedPath(new Shape(), width - bevel * 2, height - bevel * 2, 0.22)
    outer.holes.push(roundedPath(new Path(), width - wall * 2 + bevel * 2, height - wall * 2 + bevel * 2, Math.max(0.08, 0.22 - wall / 2)))
    super(outer, { depth: depth - bevel * 2, bevelEnabled: true, bevelSegments: 5, steps: 1, curveSegments: 16, bevelSize: bevel, bevelThickness: bevel })
    this.translate(0, 0, -depth / 2 + bevel)
    finishSurface(this)
  }
}

function finishSurface(geometry) {
  const capNormals = geometry.getAttribute('normal').clone()
  toCreasedNormals(geometry, Math.PI / 3)
  // Broad machined faces stay perfectly planar. Only the perimeter bevel is
  // smoothed, avoiding triangular reflections and warped-looking logo faces.
  const normals = geometry.getAttribute('normal')
  for (const group of geometry.groups) {
    if (group.materialIndex !== 0) continue
    for (let i = group.start; i < group.start + group.count; i++) {
      normals.setXYZ(i, capNormals.getX(i), capNormals.getY(i), capNormals.getZ(i))
    }
  }
}

// The XY corner radius is independent of thickness, unlike a rounded box.
// This preserves the rounded outline of thin ceramic inserts and glass panes.
export class RoundedPanelGeometry extends ExtrudeGeometry {
  constructor(width = 1, height = 1, depth = 0.06, radius = 0.12) {
    const bevel = Math.min(0.018, depth / 4, radius / 3)
    const shape = roundedPath(new Shape(), width - bevel * 2, height - bevel * 2, radius - bevel)
    super(shape, { depth: depth - bevel * 2, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 4, curveSegments: 16, steps: 1 })
    this.translate(0, 0, -depth / 2 + bevel)
    const positions = this.getAttribute('position')
    const uv = this.getAttribute('uv')
    for (let i = 0; i < uv.count; i++) uv.setXY(i, positions.getX(i) / width + 0.5, positions.getY(i) / height + 0.5)
    finishSurface(this)
  }
}
