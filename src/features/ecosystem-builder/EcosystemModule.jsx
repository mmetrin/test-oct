import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { dockingState } from './ecosystemConfig'
import { BrandCartridge } from './BrandCartridge'
import { Part, Panel, Fastener, Fasteners, Etching } from './ModuleParts'

function Cassette({ module, materials }) {
  const [w, h, d] = module.size
  return <>
    <Part size={[w, h, d]} material={materials[module.material]} />
    <Part size={[w - 0.06, 0.026, d - 0.10]} position={[0, h / 2 + 0.013, 0]} material={materials.silver} radius={0.012} />
    <Part size={[w - 0.08, h - 0.10, 0.055]} position={[0, 0, d / 2 + 0.015]} material={materials.graphite} radius={0.028} />
    {Array.from({ length: 8 }, (_, i) => <Part key={i} size={[0.024, h - 0.17, 0.065]}
      position={[-w / 2 + 0.14 + i * (w - 0.28) / 7, 0, d / 2 + 0.05]} material={materials.silver} radius={0.01} />)}
    <Part size={[0.12, 0.024, 0.018]} position={[w / 2 - 0.16, h / 2 - 0.07, d / 2 + 0.065]} material={materials.blue} radius={0.008} />
  </>
}

function ModuleBody({ module, materials }) {
  const [w, h, d] = module.size
  if (module.type === 'frame') return <>
    <mesh material={materials[module.material]} castShadow receiveShadow>
      <chassisGeometry args={[w, h, d, module.wall]} />
    </mesh>
    {module.material === 'ceramic' && <Fasteners size={module.size} inset={module.wall / 2} materials={materials} />}
  </>
  if (module.type === 'brand') return <BrandCartridge module={module} materials={materials} />
  if (module.type === 'cassette') return <Cassette module={module} materials={materials} />
  if (module.type === 'fins') return <>
    <Part size={[w * 0.65, h, d * 0.72]} material={materials.graphite} radius={0.06} />
    {Array.from({ length: 14 }, (_, i) => <Panel key={i} size={[w, d, 0.072]} rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -h / 2 + 0.08 + i * (h - 0.16) / 13, 0]} material={materials.silver} radius={0.065} />)}
    <Part size={[0.13, h - 0.12, 0.06]} position={[-w / 2 + 0.1, 0, d / 2 + 0.025]} material={materials.ceramic} radius={0.03} />
    {[-1, 1].map((sign) => <Fastener key={sign} position={[-w / 2 + 0.1, sign * (h / 2 - 0.16), d / 2 + 0.06]} radius={0.023} materials={materials} />)}
  </>
  if (module.type === 'link') return <>
    <Part size={[w, h, d]} material={materials.silver} />
    <Part size={[w + 0.035, h * 0.35, d + 0.035]} material={materials.milk} radius={0.04} />
    <Part size={[0.035, h * 0.15, 0.012]} position={[0, 0, d / 2 + 0.024]} material={materials.blue} radius={0.01} />
  </>
  if (module.type === 'plate' && h < w && h < d) return <>
    <Panel size={[w, d, h]} rotation={[-Math.PI / 2, 0, 0]} material={materials[module.material]} radius={0.14} />
    {module.reveal && <>
      <Panel size={[w - 0.04, d - 0.04, 0.018]} position={[0, -h / 2 - 0.009, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.gasket} radius={0.13} />
      <Panel size={[w - 0.09, d - 0.09, 0.054]} position={[0, -h / 2 - 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.silver} radius={0.12} />
      {[-1, 1].flatMap((x) => [-1, 1].map((z) => <Fastener key={`${x}:${z}`} materials={materials}
        position={[x * (w / 2 - 0.18), h / 2 + 0.004, z * (d / 2 - 0.18)]} rotation={[-Math.PI / 2, 0, 0]} radius={0.025} />))}
    </>}
  </>
  return <>
    {module.type === 'glass'
      ? <Panel size={module.size} material={materials.glass} radius={0.1} glass />
      : <Part size={module.size} material={materials[module.material]} />}
    {module.etched && <><Etching size={module.size} materials={materials} /><Fasteners size={module.size} materials={materials} /></>}
  </>
}

export function DockHardware({ config, materials }) {
  const active = (id) => config.modules.some((module) => module.id === id)
  return <>
    {active('upper-cartridge') && [-1, 1].map((sign) => <Part key={`top-${sign}`} size={[0.08, 0.016, 0.46]}
      position={[0.72 + sign * 0.34, 1.918, -0.12]} material={materials.chrome} radius={0.008} />)}
    {active('extension') && [-1, 1].map((sign) => <Part key={`side-${sign}`} size={[0.77, 0.04, 0.055]}
      position={[1.93, -1.57, 0.07 + sign * 0.48]} material={materials.chrome} radius={0.012} />)}
    {active('front-optic') && [-1, 1].map((sign) => <mesh key={`front-${sign}`}
      position={[-0.52 + sign * 0.32, -1.10, 0.885]} rotation={[Math.PI / 2, 0, 0]} material={materials.chrome} castShadow>
      <cylinderGeometry args={[0.035, 0.035, 0.08, 20]} />
    </mesh>)}
    {active('optical-core') && [-1, 1].map((sign) => <Part key={`core-${sign}`} size={[0.10, 0.12, 0.51]}
      position={[-0.22 + sign * 0.44, 0.20, -0.36]} material={materials.silver} radius={0.035} />)}
  </>
}

export function EcosystemModule({ module, materials, time, expansion, reducedMotion, cycle }) {
  const group = useRef(null)
  useFrame(() => {
    const { distance, tilt } = dockingState(time.current, reducedMotion ? null : module.motion, cycle)
    const travel = module.motion?.travel ?? [0, 0, 0]
    const angles = module.motion?.tilt ?? [0, 0, 0]
    const spread = module.spread ?? [0, 0, 0]
    group.current.position.set(...module.dock.map((p, axis) => p + travel[axis] * distance + spread[axis] * expansion.current))
    group.current.rotation.set(...angles.map((angle) => angle * tilt))
  })
  const initial = dockingState(0, reducedMotion ? null : module.motion, cycle)
  return <group ref={group} name={module.id}
    position={module.dock.map((p, axis) => p + (module.motion?.travel[axis] ?? 0) * initial.distance)}
    rotation={(module.motion?.tilt ?? [0, 0, 0]).map((angle) => angle * initial.tilt)}>
    <ModuleBody module={module} materials={materials} />
  </group>
}

export function DockReceivers({ config, time, running }) {
  const indicators = useRef([])
  const seats = [
    { id: 'upper-cartridge', position: [0.72, 1.935, 0.36], size: [0.60, 0.016, 0.025] },
    { id: 'extension', position: [1.94, -1.57, 0.70], size: [0.60, 0.018, 0.025] },
    { id: 'front-optic', position: [-0.52, -0.83, 0.845], size: [0.60, 0.016, 0.025] },
  ].filter((seat) => config.modules.some((module) => module.id === seat.id))
  useFrame(() => {
    if (!running) return
    seats.forEach((seat, i) => {
      const module = config.modules.find((item) => item.id === seat.id)
      const { pulse } = dockingState(time.current, module.motion, config.cycle)
      indicators.current[i].emissiveIntensity = 0.1 + pulse * 1.7
      indicators.current[i].color.set(pulse > 0.1 ? '#a6d2fa' : '#71aadc')
    })
  })
  return seats.map((seat, i) => <Part key={seat.id} size={seat.size} position={seat.position} radius={0.007}>
    <meshStandardMaterial ref={(value) => { indicators.current[i] = value }} color="#71aadc" emissive="#71aadc" emissiveIntensity={0.1} roughness={0.3} />
  </Part>)
}
