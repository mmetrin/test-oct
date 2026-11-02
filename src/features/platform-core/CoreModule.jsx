import { useRef } from 'react'
import { extend, useFrame } from '@react-three/fiber'
import { connectionProgress } from './coreMotion'
import { CoreBrandMark } from './CoreBrandMark'
import { PrecisionPlate } from './PrecisionPlate'
import { PrecisionFasteners } from './PrecisionFasteners'
import { SideVentGeometry } from './precisionGeometry'

extend({ SideVentGeometry })

const dimensions = { capsule: [0.68, 0.22, 1.02], plate: [0.96, 0.15, 0.76], stack: [0.78, 0.29, 0.88], glass: [0.74, 0.19, 0.9] }

export function CoreModule({ module, config, time, running, reduced, desktop }) {
  const group = useRef(null)
  const { materials, colors } = config
  const cleanPlaque = desktop && Boolean(module.brand)
  const logoScale = cleanPlaque ? config.desktopPlaques.logoScales[module.brand] ?? config.desktopPlaques.logoScale : 0.61
  const scale = module.scale * (desktop ? config.desktopPlaques.scales[module.brand] ?? 1 : 1)
  const initialScale = scale * (desktop ? config.desktopPlaques.initialScales[module.brand] ?? 1 : 1)
  const plaqueColor = cleanPlaque ? config.desktopPlaques.colors[module.brand] : null
  const lidMaterial = plaqueColor
    ? { ...materials.ceramic, color: plaqueColor, metalness: 0.02, roughness: 0.31, clearcoat: 0.3, envMapIntensity: 0.45 }
    : materials.ceramic
  const base = dimensions[module.shape]
  const [w, h, d] = module.brand ? [Math.max(0.98, base[0]), Math.max(0.21, base[1]), Math.max(1.04, base[2])] : base
  const radius = module.shape === 'capsule' ? 0.2 : 0.135
  const lidHeight = 0.07
  const lidY = h / 2 + 0.025 + lidHeight / 2
  const top = lidY + lidHeight / 2
  const dock = module.dock?.map((value, axis) => value + config.sculpture.corePosition[axis])
  const initial = reduced && dock ? dock : module.from
  const dockAngle = module.dockAngle ?? module.angle
  const turn = Math.atan2(Math.sin(dockAngle - module.angle), Math.cos(dockAngle - module.angle))
  const settled = reduced && Boolean(dock)
  const side = module.connectorSide ?? -1
  const sideConnector = module.connectorAxis === 'x'
  useFrame(() => {
    if (!running) return
    const t = time.current
    const progress = connectionProgress(module, t, config.connection)
    group.current.scale.setScalar(initialScale + (scale - initialScale) * progress)
    const amplitude = config.motion.floatAmplitude * (1 - progress)
    for (let axis = 0; axis < 3; axis++) {
      const target = dock?.[axis] ?? module.from[axis]
      group.current.position.setComponent(axis, module.from[axis] + (target - module.from[axis]) * progress)
    }
    group.current.position.y += Math.sin(t * config.motion.floatSpeed + module.phase) * amplitude
    group.current.rotation.z = (module.tilt?.[2] ?? 0) * (1 - progress) + Math.sin(t * 0.4 + module.phase) * amplitude * 0.5
    group.current.rotation.x = (module.tilt?.[0] ?? 0) * (1 - progress)
    group.current.rotation.y = module.angle + turn * progress
  })
  return <group ref={group} position={initial} rotation={settled ? [0, dockAngle, 0] : [module.tilt?.[0] ?? 0, module.angle, module.tilt?.[2] ?? 0]}
    scale={settled ? scale : initialScale + (scale - initialScale) * connectionProgress(module, time.current, config.connection)}>
    <PrecisionPlate size={[w, h, d]} radius={radius} bevel={0.035} material={materials.satin} />
    <PrecisionPlate size={[w * 0.9, 0.025, d * 0.9]} radius={radius * 0.8} bevel={0.004}
      position={[0, h / 2 + 0.0125, 0]} material={materials.dark} />
    <PrecisionPlate size={[w * 0.94, lidHeight, d * 0.94]} radius={radius * 0.9} bevel={0.012}
      position={[0, lidY, 0]} material={lidMaterial} />
    <PrecisionPlate size={[w * 0.87, 0.025, d * 0.87]} radius={radius * 0.75} bevel={0.004}
      position={[0, -h / 2 - 0.008, 0]} material={materials.silver} />
    {module.brand
      ? <CoreBrandMark key={`${module.brand}-${cleanPlaque}`} brand={module.brand}
        size={w * logoScale}
        position={[0, top + 0.0015, cleanPlaque ? 0 : -0.015]} onBrandSurface={Boolean(plaqueColor)} />
      : <group position={[0, top, -d * 0.065]}>
        <PrecisionPlate size={[w * 0.6, 0.013, d * 0.48]} radius={0.055} bevel={0.003} material={materials.dark} />
        <PrecisionPlate size={[w * 0.54, 0.019, d * 0.41]} radius={0.045} bevel={0.004} position={[0, 0.009, 0]}
          material={{ ...materials.glaze, color: '#b9d6e9' }} />
        {[-0.09, 0, 0.09].map((x) => <mesh key={x} position={[x, 0.019, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.006, d * 0.24]} />
          <meshBasicMaterial color="#ebf6ff" transparent opacity={0.6} depthWrite={false} />
        </mesh>)}
      </group>}
    {!cleanPlaque && <>
      <PrecisionFasteners positions={[[-w * 0.34, top + 0.001, d * 0.31], [w * 0.34, top + 0.001, -d * 0.31]]} size={0.018} material={materials.silver} />
      <PrecisionPlate size={[0.105, 0.006, 0.021]} radius={0.008} bevel={0.0015}
        position={[w * 0.23, top + 0.0035, d * 0.33]} material={{ color: module.brand === 'vk' ? colors.red : colors.reflection, roughness: 0.32, metalness: 0.25 }} />
      <mesh>
        <sideVentGeometry args={[w, h]} />
        <meshStandardMaterial color="#485b6e" roughness={0.55} metalness={0.5} />
      </mesh>
    </>}
    {module.dock && <group position={sideConnector ? [side * (w / 2 + 0.055), -0.01, 0] : [0, -0.01, side * (d / 2 + 0.055)]} rotation={[0, sideConnector ? Math.PI / 2 : 0, 0]}>
      <PrecisionPlate size={[w * 0.35, 0.1, 0.19]} radius={0.025} bevel={0.012} material={materials.silver} />
      <PrecisionPlate size={[w * 0.26, 0.055, 0.2]} radius={0.017} bevel={0.008} material={materials.dark} />
    </group>}
  </group>
}
