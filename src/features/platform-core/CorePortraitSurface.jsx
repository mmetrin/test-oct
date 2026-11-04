import { useCallback, useLayoutEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector2, Vector3, Vector4 } from 'three'
import { usePortraitAtlas } from './usePortraitAtlas'
import { portraitFrame } from './corePortraitMotion'
import { portraitColor, portraitDeclarations } from './corePortraitShader'

const mobileLayout = [
  [-0.33, 0.4, 0.145], [0, 0.42, 0.155], [0.33, 0.4, 0.14],
  [-0.49, 0.09, 0.15], [-0.165, 0.1, 0.16], [0.165, 0.1, 0.16], [0.49, 0.09, 0.15],
  [-0.35, -0.23, 0.155], [0, -0.23, 0.165], [0.35, -0.23, 0.15],
  [-0.17, -0.53, 0.14], [0.17, -0.53, 0.14],
]
const normal = new Vector3(0.3, 0.82, 0.48).normalize()
const right = new Vector3().crossVectors(new Vector3(0, 1, 0), normal).normalize()
const up = new Vector3().crossVectors(normal, right).normalize()
const programKey = () => 'core-mobile-portraits-v1'
const plainProgramKey = () => 'core-ceramic'

function placePortrait(uniforms, index, x, y, radius) {
  const area = uniforms.uPortraitPatches.value[index]
  area.set(normal.x + right.x * x * 1.25 + up.x * y, normal.y + right.y * x * 1.25 + up.y * y, normal.z + right.z * x * 1.25 + up.z * y, radius)
  const length = Math.hypot(area.x, area.y, area.z)
  area.x /= length; area.y /= length; area.z /= length
  const tangent = uniforms.uPortraitRight.value[index]
  tangent.copy(right).addScaledVector(area, -right.dot(area)).normalize()
  uniforms.uPortraitUp.value[index].crossVectors(area, tangent).normalize()
}

function updatePortraits(uniforms, modules, time, config, count) {
  const states = uniforms.uPortraitState.value
  if (!count) { states.forEach((state) => state.set(0, 0, 0, 0)); return }
  states.forEach((state, index) => {
    const module = modules[index % modules.length]
    const frame = module ? portraitFrame(index, module, time, config.connection, config.portraits, count, states.length) : null
    state.set(frame?.opacity ?? 0, frame?.from ?? 0, frame?.to ?? 0, frame?.blend ?? 0)
    const [x, y, radius] = mobileLayout[index]
    placePortrait(uniforms, index, x, y, radius * 1.12)
  })
}

export function CorePortraitSurface({ config, modules, time, running }) {
  const atlas = usePortraitAtlas()
  const invalidate = useThree((state) => state.invalidate)
  const uniforms = useMemo(() => ({
    uPortraitAtlas: { value: atlas?.texture ?? null },
    uPortraitGrid: { value: new Vector2(atlas?.columns ?? 4, atlas?.rows ?? 5) },
    uPortraitPatches: { value: mobileLayout.map(() => new Vector4()) },
    uPortraitRight: { value: mobileLayout.map(() => new Vector3()) },
    uPortraitUp: { value: mobileLayout.map(() => new Vector3()) },
    uPortraitState: { value: mobileLayout.map(() => new Vector4()) },
  }), [atlas])
  useLayoutEffect(() => {
    updatePortraits(uniforms, modules, time.current, config, atlas?.count)
    invalidate()
  }, [atlas, config, modules, time, uniforms, invalidate])
  useFrame(() => {
    if (running && atlas) updatePortraits(uniforms, modules, time.current, config, atlas.count)
  })
  const onBeforeCompile = useCallback((shader) => {
    if (!atlas) return
    Object.assign(shader.uniforms, uniforms)
    shader.vertexShader = `varying vec3 vCoreSurface;\n${shader.vertexShader}`.replace('#include <begin_vertex>', '#include <begin_vertex>\nvCoreSurface = position;')
    shader.fragmentShader = portraitDeclarations + shader.fragmentShader
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>\n${portraitColor}`)
  }, [atlas, uniforms])
  return <mesh castShadow receiveShadow scale={[1, 0.7, 1]} position={[0, 0.12, 0]}>
    <sphereGeometry args={[1.045, 80, 48]} />
    <meshPhysicalMaterial key={atlas ? 'portraits' : 'ceramic'} {...config.materials.ceramic}
      roughness={0.23} clearcoat={0.5} onBeforeCompile={onBeforeCompile} customProgramCacheKey={atlas ? programKey : plainProgramKey} />
  </mesh>
}
