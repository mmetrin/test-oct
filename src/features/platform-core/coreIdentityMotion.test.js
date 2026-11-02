import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getCoreSceneConfig } from './coreConfig.js'
import { identityFrame } from './coreIdentityMotion.js'

const { modules, connection, desktopIdentity, portraits } = getCoreSceneConfig(true)
const lastArrival = Math.max(...modules.map((module) => module.connectAt + module.connectDuration))
const start = lastArrival + desktopIdentity.hold
const frameAt = (time, enabled = true, reduced = false) => identityFrame(modules, time, connection, desktopIdentity, enabled, reduced)

test('identity waits until every connection has revealed its portraits', () => {
  assert.ok(desktopIdentity.hold > portraits.fadeIn)
  for (const time of [0, lastArrival - 0.1, lastArrival + portraits.fadeIn, start]) {
    const frame = frameAt(time)
    assert.equal(frame.merge, 0)
    assert.equal(frame.portraitOpacity, 1)
    assert.equal(frame.markOpacity, 0)
    assert.equal(frame.portraitTime, time)
  }
})

test('portraits converge continuously while the identity appears and remains visible', () => {
  let previous = frameAt(start)
  for (let time = start; time <= start + 8; time += 0.02) {
    const frame = frameAt(time)
    assert.ok(frame.merge >= previous.merge && frame.merge <= 1)
    assert.ok(frame.markOpacity >= previous.markOpacity && frame.markOpacity <= 1)
    assert.ok(frame.portraitOpacity <= previous.portraitOpacity && frame.portraitOpacity >= 0)
    assert.ok(frame.merge - previous.merge < 0.03)
    assert.ok(frame.markOpacity - previous.markOpacity < 0.04)
    assert.ok(frame.portraitOpacity + frame.markOpacity > 0.1)
    assert.equal(frame.portraitTime, start)
    previous = frame
  }
  for (const time of [start + 8, 60, 1000]) {
    const frame = frameAt(time)
    assert.equal(frame.merge, 1)
    assert.equal(frame.portraitOpacity, 0)
    assert.equal(frame.markOpacity, 1)
    assert.equal(frame.markScale, 1)
  }
})

test('mobile or unavailable identity assets keep the original portrait sequence', () => {
  for (const time of [0, start, 1000]) {
    assert.deepEqual(frameAt(time, false), { merge: 0, portraitOpacity: 1, markOpacity: 0, markScale: 1, portraitTime: time })
  }
})

test('reduced motion shows the completed identity without freezing mid-transition', () => {
  const frame = frameAt(connection.cycleStart, true, true)
  assert.equal(frame.merge, 1)
  assert.equal(frame.portraitOpacity, 0)
  assert.equal(frame.markOpacity, 1)
  assert.equal(frame.markScale, 1)
})
