import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { DoubleSide, MathUtils } from 'three'

function ShellCap({ radius, lower = false }) {
  const seam = 0.22
  const edgeRadius = radius * Math.cos(seam)
  const edgeHeight = radius * Math.sin(seam)
  return <group rotation={lower ? [Math.PI, 0, 0] : [0, 0, 0]}>
    <mesh>
      <sphereGeometry args={[radius, 80, 40, 0, Math.PI * 2, 0, Math.PI / 2 - seam]} />
      <meshPhysicalMaterial color="#e0e8ef" metalness={0.86} roughness={0.24} clearcoat={0.4} clearcoatRoughness={0.22} />
    </mesh>
    <mesh position={[0, edgeHeight, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[edgeRadius - 0.018, 0.025, 12, 128]} />
      <meshPhysicalMaterial color="#f4f9ff" metalness={0.96} roughness={0.16} />
    </mesh>
    <mesh position={[0, edgeHeight - 0.005, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[edgeRadius - 0.09, edgeRadius - 0.014, 96]} />
      <meshStandardMaterial color="#abbac9" metalness={0.8} roughness={0.3} side={DoubleSide} />
    </mesh>
  </group>
}

export function StudioCore({ config, pointer, time, running }) {
  const core = useRef(null)
  const { radius, tilt, speed } = config.core
  useFrame((_, delta) => {
    if (!running) return
    const dt = Math.min(delta, 0.05)
    core.current.rotation.x = MathUtils.damp(core.current.rotation.x,
      tilt[0] + Math.sin(time.current * speed) * 0.09 + pointer.current.y * config.parallax.vertical * 0.55,
      config.parallax.coreInertia, dt)
    core.current.rotation.y = MathUtils.damp(core.current.rotation.y,
      tilt[1] + time.current * speed + pointer.current.x * config.parallax.horizontal * 0.6,
      config.parallax.coreInertia, dt)
    core.current.rotation.z = tilt[2] + Math.sin(time.current * speed * 0.7) * 0.04
  })
  return <group ref={core} rotation={tilt}>
    <ShellCap radius={radius} />
    <ShellCap radius={radius} lower />
    <mesh>
      <sphereGeometry args={[radius * 0.79, 64, 40]} />
      <meshPhysicalMaterial color="#b3c3d4" metalness={0.92} roughness={0.23} clearcoat={0.3} />
    </mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius * 0.805, 0.013, 12, 128]} />
      <meshPhysicalMaterial color="#ff0032" emissive="#ff0032" emissiveIntensity={0.65} roughness={0.3} metalness={0.2} toneMapped={false} />
    </mesh>
    {[-0.115, 0.115].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius * 0.82, 0.02, 12, 128]} />
      <meshPhysicalMaterial color="#dce8f3" metalness={0.88} roughness={0.2} />
    </mesh>)}
    <mesh>
      <sphereGeometry args={[radius * 0.99, 80, 24, 0, Math.PI * 2, Math.PI / 2 - 0.22, 0.44]} />
      <meshPhysicalMaterial color="#e9f5ff" transmission={0.96} thickness={0.08} ior={1.45}
        roughness={0.1} metalness={0} clearcoat={1} clearcoatRoughness={0.08} />
    </mesh>
  </group>
}
