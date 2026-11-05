import { LatheGeometry, Shape } from 'three'

// A solid machined band with four rounded edges, rather than a line/ellipse.
// LatheGeometry closes the cross-section and supplies physical surface normals.
export class OrbitBandGeometry extends LatheGeometry {
  constructor(radius = 2, width = 0.08, depth = 0.1, segments = 192) {
    const edge = Math.min(width, depth) * 0.23
    const inner = radius - width / 2
    const outer = radius + width / 2
    const half = depth / 2
    const profile = new Shape()
    profile.moveTo(outer, -half + edge)
    profile.lineTo(outer, half - edge)
    profile.absarc(outer - edge, half - edge, edge, 0, Math.PI / 2)
    profile.lineTo(inner + edge, half)
    profile.absarc(inner + edge, half - edge, edge, Math.PI / 2, Math.PI)
    profile.lineTo(inner, -half + edge)
    profile.absarc(inner + edge, -half + edge, edge, Math.PI, Math.PI * 1.5)
    profile.lineTo(outer - edge, -half)
    profile.absarc(outer - edge, -half + edge, edge, Math.PI * 1.5, Math.PI * 2)
    super(profile.getPoints(3), segments)
    this.rotateX(Math.PI / 2)
  }
}
