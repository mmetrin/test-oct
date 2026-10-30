import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CubicBezierCurve3, Vector3 } from 'three'
import { getChannelAngle, getSignalProgress, signalDelays } from './channelMotion'

export function ChannelSignals({ channel, radius, coreRadius, time, running, stencil }) {
  const group = useRef(null)
  const particles = useRef([])
  // A tangent branch leads from the ring into the core. Its rotation follows
  // the plaque, so neither the path nor the signal detaches from the channel.
  const curve = useMemo(() => new CubicBezierCurve3(
    new Vector3(radius, 0, 0),
    new Vector3(radius, 0.8, 0),
    new Vector3(coreRadius * 1.2, coreRadius * 0.7, 0),
    new Vector3(coreRadius, 0, 0),
  ), [radius, coreRadius])

  useFrame(() => {
    if (!running) return
    group.current.rotation.z = getChannelAngle(channel, time.current)
    particles.current.forEach((particle, index) => {
      const progress = getSignalProgress(time.current, signalDelays[index])
      particle.visible = progress > 0 && progress < 1
      if (!particle.visible) return
      curve.getPointAt(progress, particle.position)
      particle.material.opacity = Math.min(1, progress * 16)
    })
  })

  return <group ref={group} rotation={[0, 0, getChannelAngle(channel, 0)]}>
    <mesh>
      <tubeGeometry args={[curve, 64, 0.024, 12, false]} />
      <meshPhysicalMaterial color="#94b7da" metalness={0.15} roughness={0.35}
        transparent opacity={0.58} depthWrite={false} {...stencil} />
    </mesh>
    {signalDelays.map((delay, index) => <mesh key={delay} visible={false} ref={(node) => { particles.current[index] = node }}>
      <sphereGeometry args={[0.075, 24, 16]} />
      <meshPhysicalMaterial color="#ff244b" metalness={0.22} roughness={0.2}
        clearcoat={1} clearcoatRoughness={0.12} emissive="#ff0032" emissiveIntensity={0.08}
        transparent opacity={0} depthWrite={false} {...stencil} />
    </mesh>)}
  </group>
}
