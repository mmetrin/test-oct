import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getCoreSceneConfig } from './coreConfig.js'
import { portraitFrame } from './corePortraitMotion.js'

const slots = 12
const sources = 20
const { modules, connection, portraits } = getCoreSceneConfig(false)
const frameAt = (slot, time) => portraitFrame(slot, modules[slot % modules.length], time, connection, portraits, sources, slots)
const arrivalAt = (index) => modules[index].connectAt + modules[index].connectDuration

test('mobile keeps the original reveal after each completed docking', () => {
  assert.equal(Array.from({ length: slots }, (_, slot) => frameAt(slot, arrivalAt(0) - 0.01)).filter((frame) => frame.opacity > 0).length, 0)
  modules.forEach((module, index) => {
    const arrival = arrivalAt(index)
    const visible = Array.from({ length: slots }, (_, slot) => frameAt(slot, arrival + portraits.fadeIn))
    assert.equal(visible.filter((frame) => frame.opacity > 0).length, (index + 1) * 3)
    for (let slot = index; slot < slots; slot += modules.length) {
      assert.equal(frameAt(slot, arrival).opacity, 0)
      assert.ok(frameAt(slot, arrival + portraits.fadeIn / 2).opacity > 0)
      assert.equal(frameAt(slot, arrival + portraits.fadeIn).opacity, portraits.opacity)
    }
  })
})

test('portraits remain visible while changing to other photographs', () => {
  for (let slot = 0; slot < slots; slot++) {
    const arrival = arrivalAt(slot % modules.length)
    const before = frameAt(slot, arrival + portraits.hold - 0.01)
    const during = frameAt(slot, arrival + portraits.hold + portraits.crossfade / 2)
    const after = frameAt(slot, arrival + portraits.hold + portraits.crossfade)
    assert.equal(before.blend, 0)
    assert.ok(during.blend > 0 && during.blend < 1)
    assert.equal(after.blend, 1)
    assert.notEqual(after.from, after.to)
    assert.equal(after.opacity, portraits.opacity)
  }
})

test('photograph weights stay continuous across atlas wrapping and every cycle boundary', () => {
  const weights = ({ opacity, from, to, blend }) => {
    const result = Array(sources).fill(0)
    result[from] += (1 - blend) * opacity
    result[to] += blend * opacity
    return result
  }
  for (let cycle = 1; cycle < 30; cycle++) {
    for (let slot = 0; slot < slots; slot++) {
      const boundary = arrivalAt(slot % modules.length) + portraits.hold + cycle * portraits.interval
      const left = weights(frameAt(slot, boundary - 0.0001))
      const right = weights(frameAt(slot, boundary + 0.0001))
      assert.ok(left.every((value, index) => Math.abs(value - right[index]) < 0.00001))
    }
  }
})
