import { extend } from '@react-three/fiber'
import { PrecisionPlateGeometry } from './precisionGeometry'

extend({ PrecisionPlateGeometry })

export function PrecisionPlate({ size, radius = 0.14, bevel = 0.02, material, children, ...props }) {
  return <mesh castShadow={size[1] > 0.05} receiveShadow {...props}>
    <precisionPlateGeometry args={[...size, radius, bevel]} />
    {children ?? <meshPhysicalMaterial {...material} />}
  </mesh>
}
