// All lengths are scene units; angles are radians; speeds are radians/second.
// Each module follows its orbit's actual transform. Add/remove modules freely.
export const studioConfig = {
  background: '#F7FAFD',
  pixelRatio: { desktop: 1.6, mobile: 1.35 },
  camera: { position: [0, 0.55, 12.7], fov: 35 },
  sculpture: { rotation: [0.06, -0.14, -0.08], radius: 3.5 },
  core: { radius: 1.14, speed: 0.045, tilt: [0.24, 0, -0.35] },
  parallax: { horizontal: 0.13, vertical: 0.085, orbitInertia: 2.3, coreInertia: 1.15 },
  pulse: { interval: 7, duration: 3.8, arc: 0.22 },
  orbits: [
    { id: 'equatorial', radius: 2.48, width: 0.095, depth: 0.09, tilt: [1.15, 0.23, -0.45], wobble: 0.075, speed: 0.055, phase: 0, material: 'silver' },
    { id: 'ascending', radius: 2.79, width: 0.065, depth: 0.13, tilt: [0.48, 1.08, 0.12], wobble: 0.065, speed: 0.045, phase: 1.7, material: 'silver' },
    { id: 'outer', radius: 3.23, width: 0.07, depth: 0.095, tilt: [0.87, -0.46, 0.5], wobble: 0.055, speed: 0.035, phase: 3.4, material: 'porcelain' },
    { id: 'glass', radius: 2.98, width: 0.14, depth: 0.055, tilt: [-0.34, 0.83, -0.62], wobble: 0.06, speed: 0.04, phase: 5.2, material: 'glass' },
  ],
  modules: [
    { id: 'silver-01', orbit: 'equatorial', phase: 0.28, speed: 0.115, scale: 1, color: '#edf3f8' },
    { id: 'blue-01', orbit: 'equatorial', phase: 3.6, speed: 0.115, scale: 0.9, color: '#1863D5' },
    { id: 'silver-02', orbit: 'ascending', phase: 1.85, speed: -0.085, scale: 0.88, color: '#ffffff' },
    { id: 'red-01', orbit: 'ascending', phase: 4.9, speed: -0.085, scale: 0.7, color: '#FF0032' },
    { id: 'sky-01', orbit: 'outer', phase: 0.7, speed: 0.065, scale: 1.06, color: '#71AADC' },
    { id: 'silver-03', orbit: 'outer', phase: 3.7, speed: 0.065, scale: 0.82, color: '#edf3f8' },
    { id: 'silver-04', orbit: 'glass', phase: 5.75, speed: -0.075, scale: 0.76, color: '#dce9f3' },
  ],
}
