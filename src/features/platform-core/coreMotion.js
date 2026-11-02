export const clamp01 = (value) => Math.min(1, Math.max(0, value))
export const smoothStep = (value) => { const t = clamp01(value); return t * t * (3 - 2 * t) }
export const smootherStep = (value) => { const t = clamp01(value); return t * t * t * (t * (t * 6 - 15) + 10) }

// Connections are monotonic. The steady-state loop only reactivates ports: nothing snaps back.
export function connectionProgress(module, time, config) {
  if (module.connected) return 1
  if (!module.dock) return 0
  return smootherStep((time - module.connectAt) / (module.connectDuration ?? config.duration))
}

// A single camera-like push-in spans the docking sequence and holds its final size.
export function dockingScale(modules, time, connection, focus, enabled) {
  if (!enabled) return 1
  let firstArrival = Infinity
  let lastArrival = -Infinity
  for (const module of modules) {
    if (!module.dock) continue
    const arrival = module.connectAt + (module.connectDuration ?? connection.duration)
    firstArrival = Math.min(firstArrival, arrival)
    lastArrival = Math.max(lastArrival, arrival)
  }
  if (!Number.isFinite(firstArrival)) return 1
  const start = firstArrival - focus.lead
  const end = lastArrival + focus.settle
  return 1 + (focus.magnification - 1) * smootherStep((time - start) / (end - start))
}

export function portActivation(module, time, config, index, portCount) {
  const arrival = module.connectAt + (module.connectDuration ?? config.duration)
  const t = time - arrival
  const arrivalPulse = !module.connected && t >= -config.activationLead && t <= config.pulseDuration
    ? Math.sin(clamp01((t + config.activationLead) / (config.activationLead + config.pulseDuration)) * Math.PI) ** 2 : 0
  if (time < config.cycleStart) return arrivalPulse
  const cycle = config.cycleInterval * portCount
  const local = ((time - config.cycleStart - index * config.cycleInterval) % cycle + cycle) % cycle
  return Math.max(arrivalPulse, local < config.pulseDuration ? Math.sin(local / config.pulseDuration * Math.PI) ** 2 : 0)
}
