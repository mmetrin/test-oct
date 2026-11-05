import { extend } from '@react-three/fiber'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { ChassisGeometry, RoundedPanelGeometry } from './ecosystemGeometry'

extend({ RoundedBoxGeometry, ChassisGeometry, RoundedPanelGeometry })

export function Part({ size, material, radius = 0.065, position, rotation, children }) {
  return <mesh position={position} rotation={rotation} material={material} castShadow receiveShadow>
    <roundedBoxGeometry args={[...size, 4, Math.min(radius, Math.min(...size) / 2)]} />
    {children}
  </mesh>
}

export function Panel({ size, material, radius = 0.12, position, rotation, glass = false }) {
  return <mesh position={position} rotation={rotation} material={material} castShadow={!glass} receiveShadow={!glass}>
    <roundedPanelGeometry args={[...size, radius]} />
  </mesh>
}

export function Fastener({ position, radius = 0.026, materials, rotation }) {
  return <group position={position} rotation={rotation}>
    <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.chrome}>
      <cylinderGeometry args={[radius, radius * 0.88, 0.008, 20]} />
    </mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.0045]} material={materials.graphite}>
      <cylinderGeometry args={[radius * 0.39, radius * 0.39, 0.002, 6]} />
    </mesh>
  </group>
}

export function Fasteners({ size: [w, h, d], materials, inset = 0.12, radius }) {
  return [-1, 1].flatMap((x) => [-1, 1].map((y) =>
    <Fastener key={`${x}:${y}`} position={[x * (w / 2 - inset), y * (h / 2 - inset), d / 2 + 0.005]}
      materials={materials} radius={radius} />,
  ))
}

export function Etching({ size: [w, h, d], materials }) {
  return <group position={[-w / 2 + 0.12, -h / 2 + 0.16, d / 2 + 0.004]}>
    {[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[i * 0.045, 0, 0]} material={materials.etch}>
      <boxGeometry args={[0.009, i === 0 ? 0.16 : 0.085, 0.002]} />
    </mesh>)}
    <mesh position={[w - 0.32, 0, 0]} material={materials.etch}><boxGeometry args={[0.10, 0.009, 0.002]} /></mesh>
  </group>
}
