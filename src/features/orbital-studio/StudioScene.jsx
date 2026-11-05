import { useEffect, useRef, useState } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, RoundedBox } from '@react-three/drei'
import { ACESFilmicToneMapping, MathUtils } from 'three'
import { OrbitBandGeometry } from './orbitGeometry'
import { StudioCore } from './StudioCore'

extend({ OrbitBandGeometry })
const TAU = Math.PI * 2

function GroundShadow() {
  return <mesh position={[0, -3.25, -0.3]} rotation={[-Math.PI / 2, 0, 0]}>
    <planeGeometry args={[10, 4]} />
    <shaderMaterial transparent depthWrite={false}
      vertexShader={'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }'}
      fragmentShader={'varying vec2 vUv; void main() { vec2 p = (vUv - 0.5) * 2.0; float falloff = exp(-dot(p, p) * 5.0); float edge = 1.0 - smoothstep(0.65, 1.0, length(p)); gl_FragColor = vec4(0.31, 0.40, 0.49, falloff * edge * 0.14); }'} />
  </mesh>
}

function StudioLighting() {
  return <>
    <ambientLight intensity={0.35} />
    <directionalLight position={[-3, 7, 5]} intensity={2.1} color="#ffffff" />
    <directionalLight position={[5, 1, -3]} intensity={1.1} color="#c8e5ff" />
    {/* A self-contained photography studio: softboxes and dark reflection cards. */}
    <Environment resolution={256} frames={1} environmentIntensity={0.8}>
      <color attach="background" args={['#7f92a5']} />
      <Lightformer form="rect" intensity={4} position={[-4, 5, 3]} target={[0, 0, 0]} scale={[5, 7, 1]} />
      <Lightformer form="rect" intensity={3} position={[5, 2, 2]} target={[0, 0, 0]} scale={[2, 8, 1]} />
      <Lightformer form="rect" intensity={3.5} position={[0, 6, -4]} target={[0, 0, 0]} scale={[9, 3, 1]} />
      <Lightformer form="rect" intensity={1.4} color="#c9e4ff" position={[-3, -3, -4]} target={[0, 0, 0]} scale={[6, 3, 1]} />
      <Lightformer form="rect" intensity={0.12} color="#1e2a38" position={[0, -2, 6]} target={[0, 0, 0]} scale={[8, 1.3, 1]} />
      <Lightformer form="rect" intensity={0.08} color="#122332" position={[-6, 0, -1]} target={[0, 0, 0]} scale={[1, 8, 1]} />
    </Environment>
  </>
}

function ChannelModule({ module, radius, time, running }) {
  const carrier = useRef(null)
  const indicator = useRef(null)
  useFrame(() => {
    if (!running) return
    carrier.current.rotation.z = module.phase + time.current * module.speed
    indicator.current.emissiveIntensity = 0.12 + Math.pow(Math.max(0, Math.sin(time.current * 0.32 + module.phase)), 6) * 0.28
  })
  return <group ref={carrier} rotation={[0, 0, module.phase]}>
    <group position={[radius, 0, 0.04]} scale={module.scale}>
      <RoundedBox args={[0.28, 0.48, 0.21]} radius={0.095} smoothness={3} bevelSegments={3}>
        <meshPhysicalMaterial color="#c8d4df" metalness={0.9} roughness={0.22} clearcoat={0.4} />
      </RoundedBox>
      <RoundedBox args={[0.235, 0.39, 0.085]} radius={0.07} smoothness={3} bevelSegments={3} position={[0, 0.015, 0.1]}>
        <meshPhysicalMaterial color={module.color} metalness={0.24} roughness={0.24} clearcoat={0.9} clearcoatRoughness={0.15} />
      </RoundedBox>
      <RoundedBox args={[0.11, 0.025, 0.016]} radius={0.008} smoothness={2} position={[0, -0.112, 0.147]}>
        <meshStandardMaterial ref={indicator} color="#d6ebff" emissive="#71aadc" emissiveIntensity={0.12} roughness={0.3} />
      </RoundedBox>
    </group>
  </group>
}

function OrbitPulse({ orbit, index, config, time, running }) {
  const pulse = useRef(null)
  const material = useRef(null)
  useFrame(() => {
    if (!running) return
    const local = time.current % (config.pulse.interval * config.orbits.length) - index * config.pulse.interval
    const progress = MathUtils.clamp(local / config.pulse.duration, 0, 1)
    pulse.current.visible = local > 0 && local < config.pulse.duration
    pulse.current.rotation.z = progress * TAU + orbit.phase
    material.current.opacity = Math.sin(progress * Math.PI) ** 2 * 0.85
  })
  return <mesh ref={pulse} visible={false} position={[0, 0, orbit.depth / 2 + 0.006]}>
    <torusGeometry args={[orbit.radius, orbit.width * 0.24, 8, 32, config.pulse.arc]} />
    <meshBasicMaterial ref={material} color="#c6e8ff" transparent opacity={0} depthWrite={false} />
  </mesh>
}

function Orbit({ orbit, index, config, time, running }) {
  const group = useRef(null)
  useFrame(() => {
    if (!running) return
    const wave = time.current * orbit.speed
    group.current.rotation.x = orbit.tilt[0] + (Math.sin(wave + orbit.phase) - Math.sin(orbit.phase)) * orbit.wobble
    group.current.rotation.y = orbit.tilt[1] + (Math.cos(wave * 0.83 + orbit.phase) - Math.cos(orbit.phase)) * orbit.wobble
    group.current.rotation.z = orbit.tilt[2] + Math.sin(wave * 0.65) * orbit.wobble * 0.4
  })
  const glass = orbit.material === 'glass'
  const porcelain = orbit.material === 'porcelain'
  return <group ref={group} rotation={orbit.tilt}>
    <mesh>
      <orbitBandGeometry args={[orbit.radius, orbit.width, orbit.depth]} />
      <meshPhysicalMaterial color={glass ? '#a8d1ef' : porcelain ? '#f3f7fb' : '#b6c6d6'}
        metalness={glass ? 0.05 : porcelain ? 0.35 : 0.92} roughness={glass ? 0.1 : 0.23}
        transmission={glass ? 0.72 : 0} thickness={glass ? 0.12 : 0} ior={1.46}
        clearcoat={0.75} clearcoatRoughness={0.15} />
    </mesh>
    <mesh position={[0, 0, orbit.depth / 2]}>
      <torusGeometry args={[orbit.radius - orbit.width * 0.28, 0.009, 8, 192]} />
      <meshPhysicalMaterial color={porcelain ? '#86b7dc' : '#f1f7fc'} metalness={0.88} roughness={0.16} />
    </mesh>
    <OrbitPulse orbit={orbit} index={index} config={config} time={time} running={running} />
    {config.modules.filter((module) => module.orbit === orbit.id).map((module) =>
      <ChannelModule key={module.id} module={module} radius={orbit.radius} time={time} running={running} />)}
  </group>
}

function Sculpture({ config, pointer, running }) {
  const group = useRef(null)
  const time = useRef(0)
  const viewport = useThree((state) => state.viewport)
  // Fit the complete rotating sculpture in both portrait and landscape canvases.
  const scale = Math.min(1, viewport.width / (config.sculpture.radius * 2.2), viewport.height / (config.sculpture.radius * 2.1))
  useFrame((_, delta) => {
    if (!running) return
    const dt = Math.min(delta, 0.05)
    time.current += dt
    const base = config.sculpture.rotation
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, base[0] + pointer.current.y * config.parallax.vertical, config.parallax.orbitInertia, dt)
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, base[1] + pointer.current.x * config.parallax.horizontal, config.parallax.orbitInertia, dt)
  }, -1)
  return <group scale={scale}>
    <group ref={group} rotation={config.sculpture.rotation}>
      <StudioCore config={config} pointer={pointer} time={time} running={running} />
      {config.orbits.map((orbit, index) => <Orbit key={orbit.id} orbit={orbit} index={index} config={config} time={time} running={running} />)}
    </group>
    <GroundShadow />
  </group>
}

function SceneLifecycle({ onReady, onContextLost, onContextRestored }) {
  const gl = useThree((state) => state.gl)
  useEffect(() => {
    const canvas = gl.domElement
    const lost = (event) => { event.preventDefault(); onContextLost() }
    canvas.addEventListener('webglcontextlost', lost)
    canvas.addEventListener('webglcontextrestored', onContextRestored)
    onReady()
    return () => {
      canvas.removeEventListener('webglcontextlost', lost)
      canvas.removeEventListener('webglcontextrestored', onContextRestored)
    }
  }, [gl, onReady, onContextLost, onContextRestored])
  return null
}

export function StudioScene({ config, pointer, running, onReady, onContextLost, onContextRestored, fallback }) {
  const [compact, setCompact] = useState(() => matchMedia('(max-width: 900px)').matches)
  useEffect(() => {
    const query = matchMedia('(max-width: 900px)')
    const update = () => setCompact(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return <Canvas camera={{ ...config.camera, near: 0.1, far: 40 }} dpr={[1, compact ? config.pixelRatio.mobile : config.pixelRatio.desktop]}
    frameloop={running ? 'always' : 'demand'} fallback={fallback}
    gl={{ alpha: false, antialias: true, powerPreference: 'high-performance', toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.12 }} aria-hidden="true">
    <color attach="background" args={[config.background]} />
    <StudioLighting />
    <Sculpture config={config} pointer={pointer} running={running} />
    <SceneLifecycle onReady={onReady} onContextLost={onContextLost} onContextRestored={onContextRestored} />
  </Canvas>
}
