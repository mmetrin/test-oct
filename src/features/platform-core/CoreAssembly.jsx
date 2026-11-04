import { useMemo, useRef } from 'react'
import { extend, useFrame } from '@react-three/fiber'
import { Vector2 } from 'three'
import { portActivation } from './coreMotion'
import { ArmorSectorGeometry } from './precisionGeometry'
import { PrecisionPlate } from './PrecisionPlate'
import { PrecisionFasteners } from './PrecisionFasteners'
import { CorePortraitSurface } from './CorePortraitSurface'
import { CoreLogoSurface } from './CoreLogoSurface'

extend({ ArmorSectorGeometry })
const sectors = [0.13, 1.7, 3.27, 4.84]
const baseProfile = [[1.03, -0.3], [1.25, -0.3], [1.35, -0.34], [1.365, -0.36], [1.365, -0.38], [1.345, -0.386], [1.345, -0.406], [1.365, -0.412], [1.36, -0.43], [1.34, -0.436], [1.34, -0.456], [1.35, -0.462], [1.33, -0.49], [1.28, -0.55], [1.1, -0.57], [1.03, -0.51], [1.03, -0.3]]
const glassProfile = [[1.07, 0.06], [1.085, 0.045], [1.13, 0.07], [1.145, 0.105], [1.145, 0.28], [1.13, 0.315], [1.085, 0.315], [1.07, 0.29], [1.07, 0.06]]

function ProfileRing({ profile, material }) {
  const points = useMemo(() => profile.map(([r, y]) => new Vector2(r, y)), [profile])
  return <mesh castShadow={!material.transmission} receiveShadow={!material.transmission}>
    <latheGeometry args={[points, 128]} />
    <meshPhysicalMaterial {...material} />
  </mesh>
}

function Ring({ radius, tube = 0.018, y = 0, material }) {
  return <mesh position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
    <torusGeometry args={[radius, tube, 10, 128]} />
    <meshPhysicalMaterial {...material} />
  </mesh>
}

function Dock({ module, config, time, running, index, count }) {
  const indicator = useRef(null)
  useFrame(() => {
    if (running) indicator.current.emissiveIntensity = 0.05 + portActivation(module, time.current, config.connection, index, count) * 0.8
  })
  const { materials, colors } = config
  return <group rotation={[0, module.portAngle ?? module.angle, 0]}>
    <group position={[0, (module.dock?.[1] ?? 0) - 0.01, 1.48]} rotation={[Math.PI / 2, 0, 0]}>
      <PrecisionPlate size={[0.44, 0.085, 0.23]} radius={0.055} bevel={0.012} material={materials.silver} />
      <PrecisionPlate size={[0.35, 0.012, 0.145]} radius={0.036} bevel={0.003} position={[0, 0.045, 0]} material={materials.dark} />
      <PrecisionPlate size={[0.2, 0.009, 0.021]} radius={0.008} bevel={0.002} position={[0, 0.054, -0.033]}>
        <meshStandardMaterial ref={indicator} color={colors.reflection} emissive={colors.reflection} emissiveIntensity={0.05} roughness={0.28} />
      </PrecisionPlate>
    </group>
  </group>
}

export function CoreAssembly({ config, time, running, modules, desktop, reduced }) {
  const rotor = useRef(null)
  const pulseMaterial = useRef(null)
  const ports = modules.filter((module) => module.dock || module.portAngle !== undefined)
  const sectorLength = config.coreBrand ? Math.PI * 2 / ports.length - 0.26 : 1.3
  const armorSectors = config.coreBrand ? ports.map((module) => module.portAngle - Math.PI / 2 - sectorLength / 2) : sectors
  const fastenerPositions = armorSectors.flatMap((start) => [start + 0.2, start + sectorLength - 0.2].map((angle) => [Math.cos(angle) * 1.29, 0.261, -Math.sin(angle) * 1.29]))
  const { materials, colors } = config
  useFrame(() => {
    if (!running) return
    rotor.current.rotation.y = time.current * 0.045
    let activation = 0
    ports.forEach((module, i) => { activation = Math.max(activation, portActivation(module, time.current, config.connection, i, ports.length)) })
    pulseMaterial.current.emissiveIntensity = activation * 0.5
  })
  return <group>
    {/* A continuous ceramic dome and a thick, closed glass collar have no overlapping shells. */}
    {config.coreBrand ? <CoreLogoSurface config={config} />
      : <CorePortraitSurface config={config} modules={modules} time={time} running={running} desktop={desktop} reduced={reduced} />}
    <ProfileRing profile={glassProfile} material={materials.glass} />
    <Ring radius={1.08} y={0.08} tube={0.014} material={materials.silver} />
    <Ring radius={1.12} y={0.31} tube={0.012} material={materials.silver} />
    <Ring radius={1.064} y={0.225} tube={0.009} material={{ color: colors.red, metalness: 0.3, roughness: 0.34 }} />
    <group ref={rotor}>
      {[0, 2.094, 4.188].map((angle) => <mesh key={angle} rotation={[Math.PI / 2, 0, angle]} position={[0, 0.245, 0]}>
        <torusGeometry args={[1.102, 0.007, 6, 32, 0.8]} />
        <meshPhysicalMaterial {...materials.silver} />
      </mesh>)}
    </group>
    {armorSectors.map((start, index) => <group key={start}>
      <mesh castShadow receiveShadow position={[0, 0.045, 0]}>
        <armorSectorGeometry args={[start, sectorLength]} />
        <meshPhysicalMaterial {...(desktop ? config.desktopShell : index % 2 ? materials.ceramic : materials.satin)} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, start + 0.12]} position={[0, 0.261, 0]}>
        <ringGeometry args={[1.397, 1.407, 64, 1, 0, sectorLength - 0.24]} />
        <meshStandardMaterial color="#7d93a8" metalness={0.45} roughness={0.65} transparent opacity={0.48}
          depthWrite={false} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-1} />
      </mesh>
    </group>)}
    <PrecisionFasteners positions={fastenerPositions} size={0.023} material={materials.silver} />
    {/* Recessed graphite belt, polished reveals, and a rounded structural lower casing. */}
    <mesh castShadow receiveShadow position={[0, -0.24, 0]}>
      <cylinderGeometry args={[1.39, 1.36, 0.12, 96]} />
      <meshPhysicalMaterial {...materials.dark} />
    </mesh>
    <Ring radius={1.383} y={-0.205} tube={0.013} material={materials.silver} />
    <Ring radius={1.366} y={-0.285} tube={0.012} material={materials.silver} />
    <ProfileRing profile={baseProfile} material={desktop ? config.desktopShell : materials.satin} />
    <Ring radius={1.29} y={-0.54} tube={0.012} material={materials.silver} />
    <mesh position={[0, 0.29, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.105, 0.008, 8, 96]} />
      <meshStandardMaterial ref={pulseMaterial} color={colors.reflection} emissive={colors.reflection} emissiveIntensity={0} metalness={0.2} roughness={0.3} />
    </mesh>
    {ports.map((module, i) => <Dock key={module.id} module={module} config={config} time={time} running={running} index={i} count={ports.length} />)}
  </group>
}
