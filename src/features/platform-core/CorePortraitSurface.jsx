import { useCallback, useLayoutEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector2, Vector3, Vector4 } from 'three'
import { usePortraitAtlas } from './usePortraitAtlas'
import { portraitFrame } from './corePortraitMotion'
import { identityFrame } from './coreIdentityMotion'
import { useCoreIdentityTexture } from './useCoreIdentityTexture'

const layout = [
  [-0.33, 0.4, 0.145], [0, 0.42, 0.155], [0.33, 0.4, 0.14],
  [-0.49, 0.09, 0.15], [-0.165, 0.1, 0.16], [0.165, 0.1, 0.16], [0.49, 0.09, 0.15],
  [-0.35, -0.23, 0.155], [0, -0.23, 0.165], [0.35, -0.23, 0.15],
  [-0.17, -0.53, 0.14], [0.17, -0.53, 0.14],
]
const normal = new Vector3(0.3, 0.82, 0.48).normalize()
const right = new Vector3().crossVectors(new Vector3(0, 1, 0), normal).normalize()
const up = new Vector3().crossVectors(normal, right).normalize()
const patches = layout.map(([x, y, radius]) => {
  const center = normal.clone().addScaledVector(right, x * 1.25).addScaledVector(up, y).normalize()
  const tangent = right.clone().addScaledVector(center, -right.dot(center)).normalize()
  return { center: new Vector4(...center.toArray(), radius * 1.12), right: tangent, up: new Vector3().crossVectors(center, tangent).normalize() }
})

const portraitDeclarations = /* glsl */`
varying vec3 vCoreSurface;
uniform sampler2D uPortraitAtlas;
uniform vec2 uPortraitGrid;
uniform vec4 uPortraitPatches[12];
uniform vec3 uPortraitRight[12];
uniform vec3 uPortraitUp[12];
uniform vec4 uPortraitState[12];
uniform sampler2D uIdentityMark;
uniform vec3 uIdentityNormal;
uniform vec3 uIdentityRight;
uniform vec3 uIdentityUp;
uniform vec2 uIdentitySize;
uniform vec2 uIdentityState;
uniform vec4 uIdentityUvBounds;
vec3 corePortrait(float index, vec2 point) {
  vec2 cell = vec2(mod(index, uPortraitGrid.x), floor(index / uPortraitGrid.x));
  vec2 uv = (cell + vec2(point.x * 0.48 + 0.5, 0.5 - point.y * 0.48)) / uPortraitGrid;
  uv.y = 1.0 - uv.y;
  return texture2D(uPortraitAtlas, uv).rgb;
}
`
const portraitColor = /* glsl */`
vec3 surface = normalize(vCoreSurface);
for (int i = 0; i < 12; i++) {
  vec4 portraitArea = uPortraitPatches[i];
  vec4 state = uPortraitState[i];
  if (state.x > 0.001 && dot(surface, portraitArea.xyz) > 0.0) {
    vec2 point = vec2(dot(surface, uPortraitRight[i]), dot(surface, uPortraitUp[i])) / portraitArea.w;
    float distanceToEdge = length(point);
    if (distanceToEdge < 1.0) {
      float coverage = (1.0 - smoothstep(0.86, 1.0, distanceToEdge)) * state.x;
      vec3 photograph = mix(corePortrait(state.y, point), corePortrait(state.z, point), state.w);
      diffuseColor.rgb = mix(diffuseColor.rgb, photograph, coverage);
    }
  }
}
if (uIdentityState.x > 0.001) {
  vec2 markPoint = vec2(dot(surface, uIdentityRight), dot(surface, uIdentityUp)) / (uIdentitySize * uIdentityState.y);
  vec2 markUv = (markPoint * 0.5 + 0.5) * uIdentityUvBounds.zw + uIdentityUvBounds.xy;
  vec4 identityInk = texture2D(uIdentityMark, markUv);
  float frontCoverage = smoothstep(0.0, 0.08, dot(surface, uIdentityNormal));
  diffuseColor.rgb = mix(diffuseColor.rgb, identityInk.rgb, identityInk.a * frontCoverage * uIdentityState.x);
}
`
const programKey = () => 'core-portraits-identity-v3'
const plainProgramKey = () => 'core-ceramic'

function updatePortraits(uniforms, modules, time, config, count, desktop, reduced, identityReady) {
  const states = uniforms.uPortraitState.value
  const transition = identityFrame(modules, time, config.connection, config.desktopIdentity, desktop && identityReady, reduced)
  uniforms.uIdentityState.value.set(transition.markOpacity, transition.markScale)
  states.forEach((state, index) => {
    // Three portraits per connection, distributed over the whole dome.
    const module = modules[index % modules.length]
    if (!module || !count) { state.set(0, 0, 0, 0); return }
    const frame = portraitFrame(index, module, transition.portraitTime, config.connection, config.portraits, count, states.length, desktop)
    state.set(frame.opacity * transition.portraitOpacity, frame.from, frame.to, frame.blend)
    const original = patches[index].center
    const area = uniforms.uPortraitPatches.value[index]
    const merge = transition.merge
    area.set(
      original.x + (normal.x - original.x) * merge,
      original.y + (normal.y - original.y) * merge,
      original.z + (normal.z - original.z) * merge,
      original.w * (desktop ? config.portraits.desktopScale : 1) * (1 - merge * 0.75),
    )
    const length = Math.hypot(area.x, area.y, area.z)
    area.x /= length; area.y /= length; area.z /= length
    const tangent = uniforms.uPortraitRight.value[index]
    tangent.copy(right).addScaledVector(area, -right.dot(area)).normalize()
    uniforms.uPortraitUp.value[index].crossVectors(area, tangent).normalize()
  })
}

export function CorePortraitSurface({ config, modules, time, running, desktop, reduced }) {
  const atlas = usePortraitAtlas()
  const identity = useCoreIdentityTexture()
  const invalidate = useThree((state) => state.invalidate)
  const uniforms = useMemo(() => {
    const states = patches.map(() => new Vector4())
    return {
      uPortraitAtlas: { value: atlas?.texture ?? null },
      uPortraitGrid: { value: new Vector2(atlas?.columns ?? 4, atlas?.rows ?? 5) },
      uPortraitPatches: { value: patches.map((patch) => patch.center.clone()) },
      uPortraitRight: { value: patches.map((patch) => patch.right.clone()) },
      uPortraitUp: { value: patches.map((patch) => patch.up.clone()) },
      uPortraitState: { value: states },
      uIdentityMark: { value: null },
      uIdentityNormal: { value: normal },
      uIdentityRight: { value: right },
      uIdentityUp: { value: up },
      uIdentitySize: { value: new Vector2() },
      uIdentityState: { value: new Vector2(0, 1) },
      uIdentityUvBounds: { value: new Vector4(0, 0, 1, 1) },
    }
  }, [atlas])
  useLayoutEffect(() => {
    uniforms.uIdentityMark.value = identity?.texture ?? null
    if (identity) uniforms.uIdentityUvBounds.value.fromArray(identity.uvBounds)
    uniforms.uIdentitySize.value.set(config.desktopIdentity.width / 2, config.desktopIdentity.width / (2 * config.desktopIdentity.aspect))
    updatePortraits(uniforms, modules, time.current, config, atlas?.count, desktop, reduced, Boolean(identity))
    invalidate()
  }, [atlas, config, modules, time, uniforms, invalidate, desktop, reduced, identity])
  useFrame(() => {
    if (running && atlas) updatePortraits(uniforms, modules, time.current, config, atlas.count, desktop, reduced, Boolean(identity))
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
