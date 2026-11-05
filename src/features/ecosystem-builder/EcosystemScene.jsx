import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, SoftShadows } from '@react-three/drei'
import { ACESFilmicToneMapping, MathUtils, MeshPhysicalMaterial, MeshStandardMaterial } from 'three'
import { DockHardware, DockReceivers, EcosystemModule } from './EcosystemModule'

function StudioLighting({ compact }) {
  return <>
    <SoftShadows size={70} samples={16} />
    <ambientLight intensity={0.16} />
    <hemisphereLight args={['#eaf4ff', '#8c99a9', 0.55]} />
    <directionalLight position={[-3, 9, 6]} intensity={3.2} color="#fff7ee" castShadow
      shadow-mapSize={[compact ? 1024 : 2048, compact ? 1024 : 2048]}
      shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={6} shadow-camera-bottom={-5}
      shadow-camera-near={1} shadow-camera-far={25} shadow-bias={-0.00008} shadow-normalBias={0.018} />
    <directionalLight position={[6, 3, -4]} intensity={2.1} color="#b6d6fa" />
    <directionalLight position={[1, -1, 7]} intensity={0.45} color="#f4f8ff" />
    <Environment resolution={512} frames={1} environmentIntensity={0.8}>
      <color attach="background" args={['#657789']} />
      {/* Large softboxes define body gradients; narrow strips trace the bevels.
          Dark studio flags keep the silver distinct from the ceramic. */}
      <Lightformer form="rect" intensity={5.5} color="#fff9f3" position={[-4, 6, 4]} target={[0, 0, 0]} scale={[4, 7, 1]} />
      <Lightformer form="rect" intensity={4} position={[5, 2, 3]} target={[0, 0, 0]} scale={[0.85, 7, 1]} />
      <Lightformer form="rect" intensity={3.5} position={[0, 7, -3]} target={[0, 0, 0]} scale={[7, 3, 1]} />
      <Lightformer form="rect" intensity={2.5} color="#b8d8ff" position={[-4, 1, -5]} target={[0, 0, 0]} scale={[2, 6, 1]} />
      <Lightformer form="rect" intensity={1.3} color="#f6eade" position={[1, -3, 4]} target={[0, 0, 0]} scale={[5, 2, 1]} />
      <Lightformer form="rect" intensity={0.02} color="#14202c" position={[0, 0, 6]} target={[0, 0, 0]} scale={[2.3, 8, 1]} />
      <Lightformer form="rect" intensity={0.03} color="#122332" position={[-6, 0, 1]} target={[0, 0, 0]} scale={[2, 8, 1]} />
      <Lightformer form="rect" intensity={0.015} color="#172838" position={[5, -1, -2]} target={[0, 0, 0]} scale={[3, 5, 1]} />
    </Environment>
  </>
}

function useMaterials() {
  const materials = useMemo(() => ({
    ceramic: new MeshPhysicalMaterial({ color: '#fbfcff', metalness: 0, roughness: 0.29, clearcoat: 0.3, clearcoatRoughness: 0.28 }),
    silver: new MeshPhysicalMaterial({ color: '#d2dae4', metalness: 1, roughness: 0.23, clearcoat: 0.15, anisotropy: 0.35 }),
    chrome: new MeshPhysicalMaterial({ color: '#e1e7ee', metalness: 1, roughness: 0.12, clearcoat: 0.3 }),
    glass: new MeshPhysicalMaterial({ color: '#d7eaf6', metalness: 0, roughness: 0.085, transmission: 0.94, thickness: 0.12, ior: 1.45, clearcoat: 0.5, attenuationColor: '#90bde0', attenuationDistance: 2.8 }),
    milk: new MeshPhysicalMaterial({ color: '#e4eff7', metalness: 0.12, roughness: 0.25, clearcoat: 0.4 }),
    blue: new MeshPhysicalMaterial({ color: '#1863d5', metalness: 0.45, roughness: 0.22, clearcoat: 0.8 }),
    red: new MeshPhysicalMaterial({ color: '#ff0032', metalness: 0.18, roughness: 0.23, clearcoat: 0.9 }),
    graphite: new MeshStandardMaterial({ color: '#283745', metalness: 0.7, roughness: 0.38 }),
    gasket: new MeshStandardMaterial({ color: '#536170', metalness: 0.25, roughness: 0.65 }),
    etch: new MeshStandardMaterial({ color: '#83a7c4', metalness: 0.25, roughness: 0.45 }),
  }), [])
  useEffect(() => () => Object.values(materials).forEach((material) => material.dispose()), [materials])
  return materials
}

function Sculpture({ config, pointer, running, expanded, reducedMotion }) {
  const root = useRef(null)
  const time = useRef(0)
  const expansion = useRef({ current: 0, target: 0 }).current
  const materials = useMaterials()
  const { viewport, invalidate } = useThree()
  const scale = Math.min(0.95, viewport.width / 8.4, viewport.height / 8.2)
  useEffect(() => { expansion.target = expanded ? 1 : 0; invalidate() }, [expanded, expansion, invalidate])
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    if (running) {
      time.current += dt
      root.current.rotation.x = MathUtils.damp(root.current.rotation.x, config.rotation[0] + pointer.current.y * 0.07 + Math.sin(time.current * 0.21) * 0.018, 2.3, dt)
      root.current.rotation.y = MathUtils.damp(root.current.rotation.y, config.rotation[1] + pointer.current.x * 0.12 + Math.sin(time.current * 0.16) * 0.065, 2.3, dt)
      root.current.position.y = Math.sin(time.current * 0.38) * 0.035
    }
    if (Math.abs(expansion.current - expansion.target) > 0.0001) {
      expansion.current = reducedMotion ? expansion.target : MathUtils.damp(expansion.current, expansion.target, 4, dt)
      invalidate()
    }
  }, -1)
  return <group scale={scale} position={[-0.05, -0.15, 0]}>
    <group ref={root} rotation={config.rotation}>
      {config.modules.map((module) => <EcosystemModule key={module.id} module={module} materials={materials}
        time={time} expansion={expansion} reducedMotion={reducedMotion} cycle={config.cycle} />)}
      <DockReceivers config={config} time={time} running={running} />
      <DockHardware config={config} materials={materials} />
    </group>
    <ContactShadows position={[0.2, -2.15, 0]} opacity={0.25} scale={10} blur={3.3} far={6} resolution={256} frames={Infinity} color="#72879d" />
  </group>
}

function Lifecycle({ onReady, onContextLost, onContextRestored }) {
  const { gl, camera } = useThree()
  // Contact shadows and transmission also render the scene. Refresh the real
  // shadow map once per frame, rather than rebuilding it for each extra pass.
  useFrame(() => { gl.shadowMap.needsUpdate = true }, -2)
  useEffect(() => {
    const previousAutoUpdate = gl.shadowMap.autoUpdate
    gl.shadowMap.autoUpdate = false
    gl.transmissionResolutionScale = 0.75
    camera.lookAt(0, 0.15, 0)
    camera.updateProjectionMatrix()
    const canvas = gl.domElement
    const lost = (event) => { event.preventDefault(); onContextLost() }
    canvas.addEventListener('webglcontextlost', lost)
    canvas.addEventListener('webglcontextrestored', onContextRestored)
    onReady()
    return () => {
      gl.shadowMap.autoUpdate = previousAutoUpdate
      canvas.removeEventListener('webglcontextlost', lost)
      canvas.removeEventListener('webglcontextrestored', onContextRestored)
    }
  }, [gl, camera, onReady, onContextLost, onContextRestored])
  return null
}

export function EcosystemScene({ config, pointer, running, expanded, reducedMotion, onReady, onContextLost, onContextRestored, fallback }) {
  const [compact, setCompact] = useState(() => matchMedia('(max-width: 760px)').matches)
  useEffect(() => {
    const query = matchMedia('(max-width: 760px)')
    const update = () => setCompact(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return <Canvas camera={config.camera} shadows="basic" dpr={compact ? 1.5 : 1.75} frameloop={running ? 'always' : 'demand'} fallback={fallback}
    gl={{ alpha: true, antialias: true, powerPreference: 'high-performance', toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1 }} aria-hidden="true">
    <color attach="background" args={[config.background]} />
    <StudioLighting compact={compact} />
    <Sculpture config={config} pointer={pointer} running={running} expanded={expanded} reducedMotion={reducedMotion} />
    <Lifecycle onReady={onReady} onContextLost={onContextLost} onContextRestored={onContextRestored} />
  </Canvas>
}
