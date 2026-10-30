import { MathUtils } from 'three'

export function getChannelAngle(channel, time) {
  return channel.angle + Math.sin(time * channel.speed + channel.phase) * 0.025
}

export function getOrbitRotation(orbit, time, target) {
  return target.set(
    orbit.tilt[0] + Math.sin(time * orbit.speed) * 0.13,
    orbit.tilt[1] + Math.sin(time * orbit.speed * 0.7) * 0.16,
    orbit.tilt[2],
  )
}

export const signalDelays = [0, 0.4, 0.8]
const signalPeriod = 8
const launchTime = 0.5
const travelDuration = 3.36

// Each channel sends three separate spheres; all channels stay synchronized.
export function getSignalProgress(time, delay) {
  const elapsed = (time % signalPeriod) - launchTime - delay
  const travel = MathUtils.clamp(elapsed / travelDuration, 0, 1)
  return travel * 0.35 + travel * travel * 0.65
}

export function getSignalCycle(time) {
  let launch = 0
  for (const delay of signalDelays) {
    const elapsed = (time % signalPeriod) - launchTime - delay
    if (elapsed >= 0 && elapsed < 0.8) {
      launch = Math.max(launch, Math.sin(elapsed / 0.8 * Math.PI) ** 2)
    }
  }
  // One response after the entire packet arrives, then a quiet interval.
  const packetArrival = launchTime + signalDelays.at(-1) + travelDuration
  const contact = (time % signalPeriod) - packetArrival
  const arrival = MathUtils.smoothstep(contact, 0, 0.22)
    * (1 - MathUtils.smoothstep(contact, 0.22, 0.92))
  return {
    launch,
    arrival,
  }
}
