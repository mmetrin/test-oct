import { smootherStep } from './coreMotion.js'

export function identityFrame(modules, time, connection, transition, enabled, reduced = false) {
  const idle = { merge: 0, portraitOpacity: 1, markOpacity: 0, markScale: 1, portraitTime: time }
  if (!enabled) return idle
  const arrivals = modules.filter((module) => module.dock).map((module) => module.connectAt + (module.connectDuration ?? connection.duration))
  if (!arrivals.length) return idle
  const start = Math.max(...arrivals) + transition.hold
  const age = reduced ? Infinity : Math.max(0, time - start)
  const markOpacity = smootherStep((age - transition.revealDelay) / transition.revealDuration)
  return {
    merge: smootherStep(age / transition.mergeDuration),
    portraitOpacity: 1 - smootherStep((age - transition.mergeDuration * 0.2) / (transition.mergeDuration * 0.65)),
    markOpacity,
    markScale: 0.82 + markOpacity * 0.18,
    portraitTime: Math.min(time, start),
  }
}
