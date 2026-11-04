// World units; angles in radians; durations in seconds. Modules are independent of ad channels.
function radialDock(portAngle, connectorSide = -1, connectorAxis = 'z') {
  const facing = portAngle + (connectorAxis === 'x' ? connectorSide * Math.PI / 2 : connectorSide === 1 ? Math.PI : 0)
  return {
    portAngle,
    dock: [Math.sin(portAngle) * 2.09, 0, Math.cos(portAngle) * 2.09],
    dockAngle: Math.atan2(Math.sin(facing), Math.cos(facing)),
    connectorSide,
    connectorAxis,
  }
}

const coreDock = (quadrant, connectorSide, connectorAxis) => radialDock(-0.5 + quadrant * Math.PI / 2, connectorSide, connectorAxis)

export const coreConfig = {
  moduleCount: 4,
  colors: { background: '#f7fafd', white: '#ffffff', reflection: '#71aadc', blue: '#1863d5', red: '#ff0032' },
  camera: { position: [4.6, 4.8, 10.5], fov: 34 },
  pixelRatio: { desktop: 1.75, mobile: 1.35 },
  sculpture: { rotation: [0.08, -0.2, -0.22], corePosition: [-0.326, 0.665, -0.325], width: 8.6, height: 7.1, mobileWidth: 7.8, mobileHeight: 6.6 },
  motion: { speed: 1, rotation: 0.028, turnAmplitude: 0.065, floatAmplitude: 0.055, floatSpeed: 0.64, parallax: 0.045, inertia: 2.4 },
  desktopMotion: { parallax: 0.16, inertia: 4.8, timelineOffset: 4 },
  connection: { duration: 4.8, arrivalInterval: 1, activationLead: 1.5, pulseDuration: 2.8, cycleInterval: 5.8, cycleStart: 15 },
  desktopConnection: { arrivalInterval: 2, cycleStart: 18 },
  desktopPlaques: {
    logoScale: 0.72, logoScales: { telegram: 0.83, vk: 0.83 },
    scales: { mts: 0.9, telegram: 0.9 },
    initialScales: { mts: 0.85 },
    colors: { telegram: '#229ED9', mts: '#FF0032', vk: '#0077FF' },
  },
  desktopFocus: { baseScale: 1.32, renderPadding: 64, magnification: 1.08, lead: 0.7, settle: 1.3 },
  desktopShell: { color: '#e4e7ed', metalness: 1, roughness: 0.26, clearcoat: 0.32, clearcoatRoughness: 0.2, envMapIntensity: 1.4 },
  portraits: { fadeIn: 0.65, hold: 3.6, interval: 4.8, crossfade: 1.15, opacity: 0.94 },
  lights: {
    ambient: 0.22, key: 2.6, fill: 0.65, rim: 1.75, environment: 0.8, exposure: 1,
    environmentResolution: 512, shadowResolution: 2048,
    cards: [
      { id: 'overhead', position: [-3, 7, 4], scale: [5, 4, 1], intensity: 3.4, color: '#fff9f3' },
      { id: 'key-strip', position: [-5, 3, 2], scale: [1.2, 6, 1], intensity: 3.2, color: '#ffffff' },
      { id: 'front-softbox', position: [3, 4, 6], scale: [3, 3, 1], intensity: 1.4, color: '#f2f7ff' },
      { id: 'rim-strip', position: [4, 1, -3], scale: [0.8, 5, 1], intensity: 4, color: '#b9dcff' },
      { id: 'back-softbox', position: [-1, 4, -6], scale: [5, 2, 1], intensity: 2.6, color: '#ffffff' },
      { id: 'lower-bounce', position: [-2, -4, 3], scale: [5, 2, 1], intensity: 0.6, color: '#b4d4ef' },
      { id: 'front-flag', position: [0, 0, 7], scale: [5, 1.8, 1], intensity: 0.025, color: '#0b192b' },
      { id: 'side-flag', position: [6, -1, 0], scale: [2, 6, 1], intensity: 0.025, color: '#102236' },
    ],
  },
  desktopLights: {
    ambient: 0.2, key: 2.5, fill: 0.85, rim: 2.7, accent: 1,
    keyColor: '#f2f4ff', fillColor: '#8cbfff', rimColor: '#7acbff', accentColor: '#b5a2ff',
    environmentColor: '#8995a7',
    cards: [
      { id: 'pearl-key', position: [-3, 7, 5], scale: [5, 4, 1], intensity: 2.8, color: '#f5f4ff' },
      { id: 'azure-strip', position: [5, 3, 0], scale: [1.4, 6, 1], intensity: 4.2, color: '#5b9dff' },
      { id: 'lavender-softbox', position: [-4, 1, -1], scale: [2.8, 4.5, 1], intensity: 2.8, color: '#b99cff' },
      { id: 'cyan-reflection', position: [5, 1, 4], scale: [2.4, 5.5, 1], intensity: 2.8, color: '#91dcff' },
      { id: 'lilac-reflection', position: [-4, 1.5, 5], scale: [3.5, 4.5, 1], intensity: 2.1, color: '#c6a7ff' },
      { id: 'front-softbox', position: [0, 5, 8], scale: [4, 2.5, 1], intensity: 1.35, color: '#f1f7ff' },
      { id: 'ice-rim', position: [-1, 4, -5], scale: [3, 0.8, 1], intensity: 4.2, color: '#8ad8ff' },
      { id: 'upper-cyan', position: [1, 5, -3], scale: [4.5, 3, 1], intensity: 2.5, color: '#a6e4ff' },
      { id: 'blue-bounce', position: [-1, -3, 4], scale: [3, 2, 1], intensity: 1.15, color: '#94b0da' },
      { id: 'front-flag', position: [0, 0, 7], scale: [5, 1.2, 1], intensity: 0.5, color: '#a7adc4' },
      { id: 'side-flag', position: [5, -1, 4], scale: [1.4, 4, 1], intensity: 0.14, color: '#53618d' },
    ],
  },
  materials: {
    ceramic: { color: '#f5f7fa', metalness: 0.06, roughness: 0.3, clearcoat: 0.38, clearcoatRoughness: 0.19, envMapIntensity: 0.75 },
    satin: { color: '#bbc8d4', metalness: 0.94, roughness: 0.28, clearcoat: 0.22, clearcoatRoughness: 0.2 },
    silver: { color: '#e5edf4', metalness: 1, roughness: 0.17 },
    dark: { color: '#334457', metalness: 0.72, roughness: 0.38 },
    glass: { color: '#ddecf8', metalness: 0, roughness: 0.1, transmission: 0.88, thickness: 0.07, ior: 1.44, clearcoat: 0.6 },
    glaze: { color: '#a6c7df', metalness: 0.3, roughness: 0.19, clearcoat: 0.9, clearcoatRoughness: 0.1 },
  },
  modules: [
    // Annotated starting positions; dock coordinates are relative to the raised core.
    { id: 'mts-lower-left', shape: 'plate', brand: 'mts', angle: 0.45, from: [-0.24, 1.16, 3.613], ...coreDock(0, 1, 'x'), scale: 1.08, phase: 3.4, tilt: [-0.08, 0, -0.04], connectAt: 4, connectDuration: 4.8 },
    { id: 'vk-top', shape: 'capsule', brand: 'vk', angle: 0.55, from: [-2.225, 1.7, -2.731], ...coreDock(3, 1), scale: 1.08, phase: 0.3, tilt: [0.08, 0, 0.08], connectAt: 4, connectDuration: 5.8 },
    { id: 'avito-right', shape: 'plate', brand: 'avito', angle: 0.2, from: [1.187, 1.5, -3.07], ...coreDock(2, 1), scale: 1.03, phase: 4.2, tilt: [0.08, 0, 0.1], connectAt: 4, connectDuration: 6.8 },
    { id: 'telegram-lower-right', shape: 'plate', brand: 'telegram', angle: 0.95, from: [2.133, 0.3, 1.537], ...coreDock(1), scale: 1.09, phase: 2.1, tilt: [0.08, 0, 0.08], connectAt: 4, connectDuration: 7.8 },
  ],
}

export function getCoreSceneConfig(desktop) {
  if (!desktop) return coreConfig
  const connection = { ...coreConfig.connection, ...coreConfig.desktopConnection }
  const placement = [
    { brand: 'vk', degrees: 225, radius: 3.35, height: 0.38, angle: 0.3, connectorSide: 1 },
    { brand: 'avito', degrees: 105, radius: 2.95, height: 0.14, angle: 0.35, connectorAxis: 'x' },
    { brand: 'telegram', degrees: 345, radius: 3.15, height: 0.12, angle: -0.35 },
  ]
  return {
    ...coreConfig,
    sculpture: { ...coreConfig.sculpture, rotation: [0.26, -0.2, -0.22] },
    moduleCount: 3,
    coreBrand: 'mts',
    connection,
    modules: placement.map(({ brand, degrees, radius, height, angle, connectorSide, connectorAxis }, index) => {
      const module = coreConfig.modules.find((item) => item.brand === brand)
      const portAngle = degrees * Math.PI / 180
      return {
        ...module,
        ...radialDock(portAngle, connectorSide, connectorAxis),
        id: `${brand}-desktop`,
        angle,
        from: [Math.sin(portAngle) * radius + coreConfig.sculpture.corePosition[0], coreConfig.sculpture.corePosition[1] + height, Math.cos(portAngle) * radius + coreConfig.sculpture.corePosition[2]],
        connectDuration: connection.duration + index * connection.arrivalInterval,
      }
    }),
  }
}
