import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Billboard, Decal, Environment, Lightformer, RoundedBox, useTexture } from '@react-three/drei'
import { AlwaysStencilFunc, KeepStencilOp, MathUtils, NotEqualStencilFunc, ReplaceStencilOp, SRGBColorSpace } from 'three'
import vkAdsLogo from '../../assets/orbital-hero/vk-ads.svg'
import telegramLogo from '../../assets/orbital-hero/telegram.svg'
import avitoLogo from '../../assets/orbital-hero/avito.svg'
import mtsLogo from '../../assets/orbital-hero/mts-mark-white.svg'
import { applyOrbitGradient } from './orbitGradient'
import { ChannelSignals } from './ChannelSignals'
import { getChannelAngle, getOrbitRotation, getSignalCycle } from './channelMotion'

const logos = { vk: vkAdsLogo, telegram: telegramLogo, avito: avitoLogo }
const prepareLogo = (texture) => { texture.colorSpace = SRGBColorSpace }
const orbitStencil = {
  stencilWrite: true,
  stencilWriteMask: 0,
  stencilRef: 1,
  stencilFuncMask: 1,
  stencilFunc: NotEqualStencilFunc,
  stencilFail: KeepStencilOp,
  stencilZFail: KeepStencilOp,
  stencilZPass: KeepStencilOp,
}
// Bit 1 hides rings behind plaques; bit 2 also hides small spheres behind
// the core. Both masks use the visible geometry, including rounded corners.
const sphereOccluderStencil = {
  stencilWrite: true,
  stencilWriteMask: 2,
  stencilRef: 2,
  stencilFunc: AlwaysStencilFunc,
  stencilFail: KeepStencilOp,
  stencilZFail: KeepStencilOp,
  stencilZPass: ReplaceStencilOp,
}
const sphereStencil = { ...orbitStencil, stencilRef: 2, stencilFuncMask: 2 }
const plaqueOccluderStencil = { ...sphereOccluderStencil, stencilWriteMask: 3, stencilRef: 3 }

function Studio() {
  return <>
    <ambientLight intensity={0.5} />
    <directionalLight position={[4, 7, 6]} intensity={3} color="#ffffff" />
    <directionalLight position={[-5, 1, -3]} intensity={1.5} color="#71aadc" />
    <Environment resolution={256} frames={1}>
      <color attach="background" args={['#8f9dab']} />
      <Lightformer form="rect" intensity={4} position={[0, 5, -3]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 6, 1]} />
      <Lightformer form="rect" intensity={5} position={[-4, 1, 4]} rotation={[0, Math.PI / 3, 0]} scale={[3, 7, 1]} />
      <Lightformer form="rect" intensity={3} position={[5, 0, 2]} rotation={[0, -Math.PI / 3, 0]} scale={[2, 8, 1]} />
      <Lightformer form="rect" intensity={0.15} color="#22364c" position={[0, -3, 4]} scale={[8, 2, 1]} />
      <Lightformer form="rect" intensity={2} color="#b6d9ff" position={[1, -4, -3]} rotation={[Math.PI / 2, 0, 0]} scale={[7, 3, 1]} />
    </Environment>
  </>
}

function Core({ pointer, config, time, running }) {
  const core = useRef(null)
  const texture = useTexture(mtsLogo, prepareLogo)
  useFrame((_, delta) => {
    if (!running) return
    const dt = Math.min(delta, 0.05)
    // Keep the mark facing the visitor while the sphere gently turns.
    core.current.rotation.x = MathUtils.damp(core.current.rotation.x, 0.04 + pointer.current.y * config.parallax.vertical, config.parallax.coreInertia, dt)
    core.current.rotation.y = MathUtils.damp(core.current.rotation.y, -0.1 + Math.sin(time.current * 0.14) * 0.09 + pointer.current.x * 0.05, config.parallax.coreInertia, dt)
    const { arrival } = getSignalCycle(time.current)
    core.current.scale.setScalar(1 + arrival * 0.08)
  })
  return <group ref={core} rotation={[0.04, -0.1, -0.08]}>
    <mesh renderOrder={-1}>
      <sphereGeometry args={[config.coreRadius, 64, 48]} />
      <meshPhysicalMaterial color="#ff0032" metalness={0} roughness={0.3} clearcoat={0.8} clearcoatRoughness={0.22} envMapIntensity={0.5} {...sphereOccluderStencil} />
      <Decal position={[0, 0, config.coreRadius - 0.11]} rotation={[0, 0, 0]} scale={[0.95, 0.95, 0.85]} depthTest>
        <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} polygonOffset polygonOffsetFactor={-4} />
      </Decal>
    </mesh>
  </group>
}

function BrandModule({ brand, size, time, running }) {
  const plaque = useRef(null)
  const rim = useRef(null)
  const texture = useTexture(logos[brand], prepareLogo)
  useFrame(() => {
    if (!running) return
    const { launch } = getSignalCycle(time.current)
    plaque.current.scale.setScalar(1 + launch * 0.08)
    rim.current.emissiveIntensity = launch * 0.5
  })
  return <Billboard follow scale={size}>
    <group ref={plaque} rotation={[-0.09, 0.12, -0.055]}>
      <RoundedBox args={[0.96, 0.96, 0.22]} radius={0.21} smoothness={4} renderOrder={-1}>
        <meshPhysicalMaterial ref={rim} color="#d3dfea" emissive="#ff345b" emissiveIntensity={0} metalness={0.45} roughness={0.22} clearcoat={0.8} {...plaqueOccluderStencil} />
      </RoundedBox>
      <RoundedBox args={[0.92, 0.92, 0.12]} radius={0.19} smoothness={4} position={[0, 0, 0.09]} renderOrder={-1}>
        <meshPhysicalMaterial color="#ffffff" metalness={0.08} roughness={0.3} clearcoat={0.7} {...plaqueOccluderStencil} />
      </RoundedBox>
      <mesh position={[0, 0, 0.156]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  </Billboard>
}

function BrandSatellite({ module, radius, time, running }) {
  const carrier = useRef(null)
  useFrame(() => {
    if (!running) return
    // The anchor stays on its parent ring, including its animated tilt.
    // Only a short arc is used, keeping each plaque in its own outer sector.
    const angle = getChannelAngle(module, time.current)
    carrier.current.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0,
    )
  })
  return <group ref={carrier} position={[Math.cos(module.angle) * radius, Math.sin(module.angle) * radius, 0]}>
    <BrandModule brand={module.brand} size={module.size} time={time} running={running} />
  </group>
}

function ChannelModule({ module, radius, time, running }) {
  const carrier = useRef(null)
  useFrame(() => {
    if (running) carrier.current.rotation.z = module.phase + time.current * module.speed
  })
  return <group ref={carrier} rotation={[0, 0, module.phase]}>
    <mesh position={[radius, 0, 0]} scale={module.size}>
      <sphereGeometry args={[0.085, 32, 24]} />
      <meshPhysicalMaterial color={module.color} metalness={0.2} roughness={0.2}
        clearcoat={1} clearcoatRoughness={0.12} {...sphereStencil} />
    </mesh>
  </group>
}

function Orbit({ orbit, modules, brands, coreRadius, time, running }) {
  const group = useRef(null)
  const gradientFlow = useRef(null)
  useFrame(() => {
    if (!running) return
    getOrbitRotation(orbit, time.current, group.current.rotation)
    // A circular torus keeps the same silhouette as its colored surface turns.
    // Move only the gradient mesh, leaving channel anchors and signals in place.
    gradientFlow.current.rotation.z = time.current * orbit.gradientSpeed
  })
  return <group ref={group} rotation={orbit.tilt}>
    <mesh ref={gradientFlow} scale={[1, 1, 1.6]}>
      <torusGeometry args={[orbit.radius, orbit.thickness, 12, 192]}
        onUpdate={(geometry) => applyOrbitGradient(geometry, orbit.gradientOffset)} />
      <meshPhysicalMaterial vertexColors metalness={0.45} roughness={0.22}
        clearcoat={1} clearcoatRoughness={0.12} envMapIntensity={0.9} {...orbitStencil} />
    </mesh>
    {modules.map((module) => <ChannelModule key={module.id} module={module} radius={orbit.radius} time={time} running={running} />)}
    {brands.map((channel) => <ChannelSignals key={channel.id} channel={channel}
      radius={orbit.radius} coreRadius={coreRadius} time={time} running={running}
      stencil={sphereStencil} />)}
    {brands.map((module) => <BrandSatellite key={module.id} module={module} radius={orbit.radius} time={time} running={running} />)}
  </group>
}

function Sculpture({ config, pointer, running }) {
  const group = useRef(null)
  const time = useRef(0)
  const compact = useThree((state) => state.size.width < 600)
  useFrame((_, delta) => {
    if (!running) return
    const dt = Math.min(delta, 0.05)
    time.current += dt
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, pointer.current.x * config.parallax.horizontal, config.parallax.orbitInertia, dt)
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, pointer.current.y * config.parallax.vertical, config.parallax.orbitInertia, dt)
  })
  return <group ref={group} scale={compact ? config.mobileScale : 1}>
    <Core config={config} pointer={pointer} time={time} running={running} />
    {config.orbits.map((orbit) => <Orbit key={orbit.id} orbit={orbit} coreRadius={config.coreRadius}
      modules={config.modules.filter((module) => module.orbit === orbit.id)}
      brands={config.brands.filter((module) => module.orbit === orbit.id)} time={time} running={running} />)}
  </group>
}

export function OrbitalScene({ config, pointer, running }) {
  return <Canvas camera={{ ...config.camera, near: 0.1, far: 60 }} dpr={[1, config.maxPixelRatio]} frameloop={running ? 'always' : 'demand'}
    resize={{ offsetSize: true }}
    gl={{ antialias: true, alpha: true, stencil: true, powerPreference: 'low-power' }}
    fallback={<div className="orbital-hero__fallback">Для просмотра 3D-композиции включите WebGL в браузере.</div>}
    aria-hidden="true">
    <Studio />
    <Sculpture config={config} pointer={pointer} running={running} />
  </Canvas>
}
