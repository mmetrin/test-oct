import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { ACESFilmicToneMapping, MathUtils } from 'three'
import { CoreAssembly } from './CoreAssembly'
import { CoreModule } from './CoreModule'
import { dockingScale } from './coreMotion'

function Studio({ config, compact, desktop }) {
  const lights = desktop ? { ...config.lights, ...config.desktopLights } : config.lights
  return <>
    <ambientLight intensity={lights.ambient} />
    <directionalLight position={[-3, 7, 5]} intensity={lights.key} color={lights.keyColor ?? '#fff9f2'} castShadow
      shadow-mapSize={[compact ? 1024 : lights.shadowResolution, compact ? 1024 : lights.shadowResolution]}
      shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5}
      shadow-camera-near={0.5} shadow-camera-far={20} shadow-bias={-0.00008} shadow-normalBias={0.012} />
    <directionalLight position={[3, 3, 7]} intensity={lights.fill} color={lights.fillColor ?? '#e8f1ff'} />
    <directionalLight position={[4, 2, -5]} intensity={lights.rim} color={lights.rimColor ?? '#bddbff'} />
    {desktop && <directionalLight position={[-4, 2, -2]} intensity={lights.accent} color={lights.accentColor} />}
    <Environment key={desktop ? 'desktop' : 'base'} frames={1} resolution={lights.environmentResolution} environmentIntensity={lights.environment}>
      <color attach="background" args={[lights.environmentColor ?? '#607184']} />
      {lights.cards.map(({ id, ...card }) => <Lightformer key={id} form="rect" target={[0, 0, 0]} {...card} />)}
    </Environment>
  </>
}

function SoftShadow() {
  return <mesh position={[0, -2.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
    <planeGeometry args={[8.5, 6]} />
    <shaderMaterial transparent depthWrite={false}
      vertexShader={'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }'}
      fragmentShader={'varying vec2 vUv; void main() { vec2 p = (vUv - 0.5) * 2.0; float a = exp(-dot(p, p) * 5.5) * (1.0 - smoothstep(0.6, 1.0, length(p))); gl_FragColor = vec4(0.38, 0.46, 0.56, a * 0.15); }'} />
  </mesh>
}

function Sculpture({ config, pointer, running, reduced, compact, desktop }) {
  const sculpture = useRef(null)
  const carrier = useRef(null)
  const system = useRef(null)
  // Start the desktop intro ahead without resetting it on resize.
  const time = useRef(reduced ? config.connection.cycleStart : desktop ? config.desktopMotion.timelineOffset : 0)
  const viewport = useThree((state) => state.viewport)
  const size = useThree((state) => state.size)
  const modules = config.modules.slice(0, Math.max(0, config.moduleCount))
  const interaction = desktop ? config.desktopMotion : config.motion
  const padding = desktop ? config.desktopFocus.renderPadding : 0
  const heightRatio = Math.max(1, size.height - padding * 2) / size.height
  const frameWidth = viewport.width * Math.max(1, size.width - padding * 2) / size.width
  const frameHeight = viewport.height * heightRatio
  // Extra render space prevents clipping without inflating the fitted composition again.
  const scale = Math.min(1.2 * heightRatio, frameWidth / (compact ? config.sculpture.mobileWidth : config.sculpture.width), frameHeight / (compact ? config.sculpture.mobileHeight : config.sculpture.height)) * (desktop ? config.desktopFocus.baseScale : 1)
  useFrame((_, delta) => {
    if (!running) return
    const dt = Math.min(delta, 0.05)
    time.current += dt * config.motion.speed
    sculpture.current.scale.setScalar(scale * dockingScale(modules, time.current, config.connection, config.desktopFocus, desktop))
    // A slow, bounded turn preserves the composition and keeps each brand face readable.
    system.current.rotation.y = config.sculpture.rotation[1] + Math.sin(time.current * config.motion.rotation) * config.motion.turnAmplitude
    carrier.current.rotation.x = MathUtils.damp(carrier.current.rotation.x, pointer.current.y * interaction.parallax, interaction.inertia, dt)
    carrier.current.rotation.y = MathUtils.damp(carrier.current.rotation.y, pointer.current.x * interaction.parallax, interaction.inertia, dt)
  }, -1)
  return <group ref={sculpture} scale={scale * dockingScale(modules, time.current, config.connection, config.desktopFocus, desktop)} position={[0, -0.12, 0]}>
    <group ref={carrier}>
      <group ref={system} rotation={config.sculpture.rotation}>
        <group position={config.sculpture.corePosition}>
          <CoreAssembly config={config} modules={modules} time={time} running={running} desktop={desktop} reduced={reduced} />
        </group>
        {modules.map((module) => <CoreModule key={module.id} module={module} config={config} time={time} running={running} reduced={reduced} desktop={desktop} />)}
      </group>
    </group>
    <SoftShadow />
  </group>
}

function Lifecycle({ onLost, onRestored }) {
  const gl = useThree((state) => state.gl)
  useEffect(() => {
    // Refractions can render at a lower resolution without softening the metal silhouette.
    gl.transmissionResolutionScale = 0.65
    const canvas = gl.domElement
    const lost = (event) => { event.preventDefault(); onLost() }
    canvas.addEventListener('webglcontextlost', lost)
    canvas.addEventListener('webglcontextrestored', onRestored)
    return () => {
      canvas.removeEventListener('webglcontextlost', lost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
    }
  }, [gl, onLost, onRestored])
  return null
}

export function CoreScene({ config, motion, onLost, onRestored, fallback }) {
  return <Canvas camera={{ ...config.camera, near: 0.1, far: 40 }}
    dpr={[1, motion.compact ? config.pixelRatio.mobile : config.pixelRatio.desktop]}
    frameloop={motion.running ? 'always' : 'demand'} fallback={fallback}
    shadows
    gl={{ alpha: true, antialias: true, powerPreference: 'high-performance', toneMapping: ACESFilmicToneMapping, toneMappingExposure: config.lights.exposure }}
    aria-hidden="true">
    <Studio config={config} compact={motion.compact} desktop={motion.desktop} />
    <Sculpture key={String(motion.reduced)} config={config} pointer={motion.pointer} running={motion.running} reduced={motion.reduced} compact={motion.compact} desktop={motion.desktop} />
    <Lifecycle onLost={onLost} onRestored={onRestored} />
  </Canvas>
}
