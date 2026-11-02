import assert from 'node:assert/strict'
import { test } from 'node:test'
import { coreConfig, getCoreSceneConfig } from './coreConfig.js'
import { connectionProgress, dockingScale, portActivation } from './coreMotion.js'

test('desktop approach waits for docking, grows smoothly, and never resets on later pulses', () => {
  const { modules, connection, desktopFocus } = getCoreSceneConfig(true)
  const scaleAt = (time) => dockingScale(modules, time, connection, desktopFocus, true)
  assert.equal(scaleAt(4), 1)
  assert.ok(scaleAt(10) > 1 && scaleAt(10) < desktopFocus.magnification)
  let previous = 1
  for (let time = 0; time < 60; time += 0.05) {
    const value = scaleAt(time)
    assert.ok(value >= previous && value <= desktopFocus.magnification)
    assert.ok(value - previous < 0.002)
    previous = value
  }
  assert.equal(previous, desktopFocus.magnification)
})

test('mobile and tablet retain their original scale throughout docking and after resize', () => {
  for (const time of [0, 4, 8.8, 10, 11.8, 15, 60, 1000]) {
    assert.equal(dockingScale(coreConfig.modules, time, coreConfig.connection, coreConfig.desktopFocus, false), 1)
  }
})

test('each joining module stays docked, including across later activation cycles', () => {
  const dockingFixtures = [
    ...coreConfig.modules,
    { dock: [0, 0, 1], connectAt: 0, connected: true },
  ]
  for (const module of dockingFixtures) {
    assert.ok(module.dock, `${module.brand} must have a docking target`)
    let previous = 0
    for (let time = 0; time < 180; time += 0.025) {
      const progress = connectionProgress(module, time, coreConfig.connection)
      assert.ok(progress >= previous && progress <= 1)
      previous = progress
    }
    assert.equal(previous, 1)
  }
})

test('floating modules never snap into a nonexistent docking point', () => {
  for (const module of [{ from: [1, 0, 1], connectAt: 0 }]) {
    assert.equal(connectionProgress(module, 0, coreConfig.connection), 0)
    assert.equal(connectionProgress(module, 1000, coreConfig.connection), 0)
  }
})

for (const desktop of [false, true]) test(`${desktop ? 'desktop' : 'mobile'} modules start together and finish docking ${desktop ? 'two' : 'one'} seconds apart`, () => {
  const { modules, connection } = getCoreSceneConfig(desktop)
  const start = modules[0].connectAt
  const arrivals = modules.map((module) => {
    assert.equal(module.connectAt, start)
    assert.equal(connectionProgress(module, start, connection), 0)
    assert.ok(connectionProgress(module, start + 0.1, connection) > 0)
    const arrival = module.connectAt + (module.connectDuration ?? connection.duration)
    assert.ok(connectionProgress(module, arrival - 0.1, connection) < 1)
    assert.equal(connectionProgress(module, arrival, connection), 1)
    return arrival
  }).sort((a, b) => a - b)
  for (let index = 1; index < arrivals.length; index++) {
    assert.ok(Math.abs(arrivals[index] - arrivals[index - 1] - (desktop ? 2 : 1)) < 1e-10)
  }
  assert.ok(connection.cycleStart > arrivals.at(-1) + connection.pulseDuration)
})

test('desktop motion starts immediately while the mobile timing stays unchanged', () => {
  const desktop = getCoreSceneConfig(true)
  assert.equal(desktop.modules[0].connectAt, desktop.desktopMotion.timelineOffset)
  assert.equal(getCoreSceneConfig(false), coreConfig)
  assert.deepEqual(coreConfig.modules.map((module) => module.connectDuration), [4.8, 5.8, 6.8, 7.8])
})

test('the four ports and docked modules are evenly spaced around the core', () => {
  const modules = [...coreConfig.modules].sort((a, b) => a.portAngle - b.portAngle)
  const radius = Math.hypot(modules[0].dock[0], modules[0].dock[2])
  modules.forEach((module, index) => {
    const next = modules[(index + 1) % modules.length]
    const gap = (next.portAngle - module.portAngle + Math.PI * 2) % (Math.PI * 2)
    assert.ok(Math.abs(gap - Math.PI / 2) < 1e-10)
    assert.ok(Math.abs(Math.hypot(module.dock[0], module.dock[2]) - radius) < 1e-10)
    assert.equal(module.dock[1], modules[0].dock[1])
  })
})

test('branded modules approach the raised core from outside and meet their own ports', () => {
  for (const module of coreConfig.modules) {
    const [x, , z] = module.dock
    const radius = Math.hypot(x, z)
    assert.ok(Math.abs(x - Math.sin(module.portAngle) * radius) < 0.002)
    assert.ok(Math.abs(z - Math.cos(module.portAngle) * radius) < 0.002)
    const connectorSide = module.connectorSide ?? -1
    // The plug points inward while the logo remains flush with a readable lid.
    const alignment = (module.connectorAxis === 'x'
      ? Math.cos(module.dockAngle) * x - Math.sin(module.dockAngle) * z
      : Math.sin(module.dockAngle) * x + Math.cos(module.dockAngle) * z) * connectorSide / radius
    assert.ok(alignment < -0.999)
    for (let time = module.connectAt; time <= module.connectAt + (module.connectDuration ?? coreConfig.connection.duration); time += 0.05) {
      const progress = connectionProgress(module, time, coreConfig.connection)
      const position = module.from.map((value, axis) => value + (module.dock[axis] + coreConfig.sculpture.corePosition[axis] - value) * progress)
      const distance = Math.hypot(position[0] - coreConfig.sculpture.corePosition[0], position[2] - coreConfig.sculpture.corePosition[2])
      assert.ok(distance >= radius - 0.002, `${module.brand} must not pass through the core`)
    }
  }
})

test('port illumination remains bounded and continuous at the loop boundary', () => {
  const ports = coreConfig.modules.filter((item) => item.dock || item.portAngle !== undefined)
  assert.ok(ports.length > 0)
  ports.forEach((module, index) => {
    for (let time = 0; time < 100; time += 0.05) {
      const value = portActivation(module, time, coreConfig.connection, index, ports.length)
      assert.ok(Number.isFinite(value) && value >= 0 && value <= 1)
    }
    const boundary = coreConfig.connection.cycleStart + coreConfig.connection.cycleInterval * (ports.length + index)
    assert.ok(Math.abs(portActivation(module, boundary - 0.0001, coreConfig.connection, index, ports.length) - portActivation(module, boundary + 0.0001, coreConfig.connection, index, ports.length)) < 0.0001)
  })
})
