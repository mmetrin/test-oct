// All dimensions use the same world-space unit. Each dock is the exact seated
// centre of a module; travel is an exterior clearance vector, not an orbit.
// New modules only need a unique id, type, size, dock and material here.
export const ecosystemConfig = {
  background: '#f7fafd',
  camera: { position: [7.6, 5.4, 10.5], fov: 34, near: 0.1, far: 50 },
  rotation: [0, -0.12, -0.035],
  cycle: 24,
  modules: [
    { id: 'foundation', type: 'plate', size: [4.55, 0.38, 2.12], dock: [0.25, -1.78, 0.08], material: 'ceramic', reveal: true },
    { id: 'chassis', type: 'frame', size: [3.1, 3.12, 0.66], dock: [-0.27, 0, -0.25], material: 'ceramic', wall: 0.25 },
    { id: 'chassis-liner', type: 'frame', size: [2.68, 2.7, 0.12], dock: [-0.27, 0, 0.13], material: 'silver', wall: 0.075 },
    { id: 'rear-glass', type: 'glass', size: [2.52, 2.55, 0.10], dock: [-0.27, 0, -0.65], material: 'glass', etched: true },
    { id: 'cantilever', type: 'plate', size: [3.82, 0.28, 1.68], dock: [0.32, 1.77, -0.15], material: 'ceramic', reveal: true },
    { id: 'heat-exchanger', type: 'fins', size: [0.58, 2.27, 1.2], dock: [-2.13, -0.25, 0.04], material: 'silver' },
    { id: 'interlayer', type: 'plate', size: [2.5, 0.16, 1.5], dock: [-0.27, -0.62, 0.12], material: 'silver' },
    { id: 'optical-core', type: 'brand', brand: 'mts', size: [1.32, 1.32, 0.53], dock: [-0.22, 0.20, 0.14], material: 'ceramic' },
    { id: 'lower-cassette', type: 'cassette', size: [1.9, 0.5, 1.22], dock: [-0.3, -1.1, 0.17], material: 'ceramic' },
    { id: 'glass-wing', type: 'glass', size: [0.82, 2.18, 0.12], dock: [1.82, 0.42, -0.87], material: 'glass', etched: true },
    { id: 'extension', type: 'brand', brand: 'avito', size: [1.03, 0.96, 1.5], dock: [1.93, -1.07, 0.07], material: 'ceramic',
      motion: { delay: 7.6, travel: [1.16, 0, 0], tilt: [0, -0.18, 0.08] }, spread: [0.42, 0, 0] },
    { id: 'upper-cartridge', type: 'brand', brand: 'vk', size: [1.16, 1.02, 0.76], dock: [0.72, 2.43, -0.12], material: 'silver',
      motion: { delay: 0, travel: [0.2, 0.78, -0.55], tilt: [0.15, -0.22, -0.08] }, spread: [0, 0.38, 0] },
    { id: 'front-optic', type: 'brand', brand: 'telegram', size: [1.05, 0.92, 0.35], dock: [-0.52, -0.96, 1.10], material: 'ceramic',
      motion: { delay: 15.2, travel: [0, 0, 1.1], tilt: [-0.14, 0.16, 0] }, spread: [0, 0, 0.62] },
    { id: 'side-link', type: 'link', size: [0.3, 0.76, 0.34], dock: [1.53, 0.17, 0.06], material: 'silver' },
    { id: 'red-key', type: 'plate', size: [0.13, 0.52, 0.4], dock: [-2.48, 0.30, 0.38], material: 'red' },
  ],
}

const clamp = (value) => Math.min(1, Math.max(0, value))
export const smoothstep = (value) => { const t = clamp(value); return clamp(t * t * t * (t * (t * 6 - 15) + 10)) }

// At t=0 only the upper cartridge is outside the nearly complete structure.
// Rotation is settled before the final straight approach. After a long seated
// hold, extraction reverses this order: first clearance, then rotation.
export function dockingState(time, motion, cycle = 24) {
  if (!motion) return { distance: 0, tilt: 0, pulse: 0 }
  const t = ((time - motion.delay) % cycle + cycle) % cycle
  let distance = 0
  let tilt = 0
  if (t < 1.7) {
    distance = 1 - 0.12 * smoothstep(t / 1.7)
    tilt = 1 - smoothstep(t / 1.7)
  } else if (t < 4.6) {
    distance = 0.88 * (1 - smoothstep((t - 1.7) / 2.9))
  } else if (t > 20) {
    distance = smoothstep((t - 20) / 3)
    tilt = smoothstep((t - 22) / 2)
  }
  const pulse = t > 4.6 && t < 6.2 ? Math.sin((t - 4.6) / 1.6 * Math.PI) ** 2 : 0
  return { distance, tilt, pulse }
}
