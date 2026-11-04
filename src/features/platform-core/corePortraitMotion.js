import { smootherStep } from './coreMotion.js'

export function portraitFrame(slot, module, time, connection, portraits, sourceCount, slotCount) {
  const arrival = module.connectAt + (module.connectDuration ?? connection.duration)
  const age = time - arrival
  if (age <= 0 || !module.dock) return { opacity: 0, from: slot % sourceCount, to: slot % sourceCount, blend: 0 }
  const changing = Math.max(0, age - portraits.hold)
  const cycle = Math.floor(changing / portraits.interval)
  const from = (slot + cycle * slotCount) % sourceCount
  return {
    opacity: smootherStep(age / portraits.fadeIn) * portraits.opacity,
    from,
    to: (from + slotCount) % sourceCount,
    blend: smootherStep((changing - cycle * portraits.interval) / portraits.crossfade),
  }
}
