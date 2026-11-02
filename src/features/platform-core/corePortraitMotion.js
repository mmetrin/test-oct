import { smootherStep } from './coreMotion.js'

export function portraitFrame(slot, module, time, connection, portraits, sourceCount, slotCount, desktop = false) {
  const arrival = module.connectAt + (module.connectDuration ?? connection.duration)
  const age = time - arrival
  // The final easing tail is almost stationary: reveal at visual contact, before it finishes.
  const revealAge = age + (desktop ? portraits.desktopRevealLead : 0)
  const fadeIn = desktop ? portraits.desktopFadeIn : portraits.fadeIn
  if (revealAge <= 0 || !module.dock) return { opacity: 0, from: slot % sourceCount, to: slot % sourceCount, blend: 0 }
  const changing = Math.max(0, age - portraits.hold)
  const cycle = Math.floor(changing / portraits.interval)
  const from = (slot + cycle * slotCount) % sourceCount
  return {
    opacity: smootherStep(revealAge / fadeIn) * portraits.opacity,
    from,
    to: (from + slotCount) % sourceCount,
    blend: smootherStep((changing - cycle * portraits.interval) / portraits.crossfade),
  }
}
