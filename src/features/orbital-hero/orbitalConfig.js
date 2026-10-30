// Angles are radians, speeds are radians per second. Small spheres follow rings;
// brand plaques move within separate sectors to keep the core unobstructed.
export const orbitalConfig = {
  maxPixelRatio: 1.65,
  mobileScale: 0.9,
  coreRadius: 0.98,
  camera: { position: [0, 0.45, 11.8], fov: 36 },
  parallax: { horizontal: 0.38, vertical: 0.24, orbitInertia: 4, coreInertia: 2.2 },
  orbits: [
    { id: 'middle', radius: 2.8, thickness: 0.025, tilt: [-0.25, -0.2, 0.46], speed: -0.017, gradientOffset: 0.25, gradientSpeed: -0.18 },
    { id: 'outer', radius: 2.96, thickness: 0.017, tilt: [1.06, -0.32, -0.18], speed: 0.013, gradientOffset: 0.5, gradientSpeed: 0.2 },
    { id: 'polar', radius: 2.65, thickness: 0.019, tilt: [0.655, 0.956, -1.024], speed: -0.011, gradientOffset: 0.75, gradientSpeed: -0.16 },
  ],
  brands: [
    { id: 'vk-ads', brand: 'vk', orbit: 'middle', angle: 0.18, phase: 0, speed: 0.12, size: 1.1 },
    { id: 'telegram-ads', brand: 'telegram', orbit: 'middle', angle: 4.74, phase: 2.1, speed: 0.1, size: 1.05 },
    { id: 'avito-ads', brand: 'avito', orbit: 'middle', angle: 3.16, phase: 4.2, speed: 0.11, size: 1.05 },
  ],
  modules: [
    { id: 'sphere-middle-peach', orbit: 'middle', phase: 1.4, speed: -0.12, size: 0.8, color: '#ffd2be' },
    { id: 'sphere-outer-peach', orbit: 'outer', phase: 2.65, speed: 0.2, size: 0.8, color: '#ffd2be' },
    { id: 'sphere-polar-sky', orbit: 'polar', phase: 1.35, speed: -0.11, size: 0.7, color: '#8edbff' },
  ],
}
