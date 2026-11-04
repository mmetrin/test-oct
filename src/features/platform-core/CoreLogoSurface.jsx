import { useCallback, useLayoutEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import mtsLogo from '../../assets/platform-core/mts-letter-mark.svg'
import { useCoreLogoTexture } from './useCoreLogoTexture'

const normal = new Vector3(0.3, 0.82, 0.48).normalize()
const right = new Vector3().crossVectors(new Vector3(0, 1, 0), normal).normalize()
const up = new Vector3().crossVectors(normal, right).normalize()
const programKey = () => 'core-mts-surface-v1'
const plainProgramKey = () => 'core-ceramic'

// The print belongs to the dome material, so it follows its curvature and lighting.
export function CoreLogoSurface({ config }) {
  const texture = useCoreLogoTexture(mtsLogo)
  const invalidate = useThree((state) => state.invalidate)
  const uniforms = useMemo(() => ({
    uCoreLogo: { value: texture },
    uLogoNormal: { value: normal },
    uLogoRight: { value: right },
    uLogoUp: { value: up },
  }), [texture])
  useLayoutEffect(() => { invalidate() }, [texture, invalidate])
  const onBeforeCompile = useCallback((shader) => {
    if (!texture) return
    Object.assign(shader.uniforms, uniforms)
    shader.vertexShader = `varying vec3 vCoreSurface;\n${shader.vertexShader}`.replace('#include <begin_vertex>', '#include <begin_vertex>\nvCoreSurface = position;')
    shader.fragmentShader = /* glsl */`
      varying vec3 vCoreSurface;
      uniform sampler2D uCoreLogo;
      uniform vec3 uLogoNormal;
      uniform vec3 uLogoRight;
      uniform vec3 uLogoUp;
    ` + shader.fragmentShader
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', /* glsl */`
      #include <map_fragment>
      vec3 surface = normalize(vCoreSurface);
      vec2 logoUv = vec2(dot(surface, uLogoRight), dot(surface, uLogoUp)) / 0.9 + 0.5;
      if (dot(surface, uLogoNormal) > 0.0 && all(greaterThanEqual(logoUv, vec2(0.0))) && all(lessThanEqual(logoUv, vec2(1.0)))) {
        vec2 edge = min(logoUv, 1.0 - logoUv);
        float coverage = smoothstep(0.0, max(fwidth(logoUv.x), fwidth(logoUv.y)), min(edge.x, edge.y));
        vec4 ink = texture2D(uCoreLogo, logoUv);
        diffuseColor.rgb = mix(diffuseColor.rgb, ink.rgb, ink.a * coverage);
      }
    `)
  }, [texture, uniforms])
  return <mesh castShadow receiveShadow scale={[1, 0.7, 1]} position={[0, 0.12, 0]}>
    <sphereGeometry args={[1.045, 80, 48]} />
    <meshPhysicalMaterial key={texture ? 'mts' : 'ceramic'} {...config.materials.ceramic} color={config.colors.red}
      roughness={0.23} clearcoat={0.5} onBeforeCompile={onBeforeCompile} customProgramCacheKey={texture ? programKey : plainProgramKey} />
  </mesh>
}
