import assert from 'node:assert/strict'
import { test } from 'node:test'
import { PrecisionPlateGeometry, ArmorSectorGeometry } from './precisionGeometry.js'

test('thin inserts retain their specified thickness with large corner radii', () => {
  for (const dimensions of [[1, 0.007, 1], [0.44, 0.085, 0.23], [0.105, 0.006, 0.021], [0.98, 0.21, 1.04]]) {
    const geometry = new PrecisionPlateGeometry(...dimensions, 0.14, 0.02)
    geometry.computeBoundingBox()
    const size = geometry.boundingBox.max.clone().sub(geometry.boundingBox.min).toArray()
    size.forEach((value, axis) => assert.ok(Math.abs(value - dimensions[axis]) < 0.00001))
    for (const value of geometry.attributes.normal.array) assert.ok(Number.isFinite(value))
    geometry.dispose()
  }
})

test('machined shell segments have finite coordinates and normals', () => {
  for (const angle of [0.13, 1.7, 3.27, 4.84]) {
    const geometry = new ArmorSectorGeometry(angle, 1.3)
    for (const name of ['position', 'normal']) for (const value of geometry.attributes[name].array) assert.ok(Number.isFinite(value))
    geometry.dispose()
  }
})
