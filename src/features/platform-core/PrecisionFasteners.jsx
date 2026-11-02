import { useLayoutEffect, useRef } from 'react'
import { Euler, Matrix4, Quaternion, Vector3 } from 'three'

// Repeated hardware is batched into three draws, regardless of the number of fasteners.
export function PrecisionFasteners({ positions, size = 0.025, material }) {
  const rims = useRef(null)
  const heads = useRef(null)
  const sockets = useRef(null)
  useLayoutEffect(() => {
    const matrix = new Matrix4()
    const position = new Vector3()
    const face = new Quaternion().setFromEuler(new Euler(-Math.PI / 2, 0, 0))
    const upright = new Quaternion()
    const scale = new Vector3(1, 1, 1)
    positions.forEach((point, index) => {
      position.fromArray(point)
      rims.current.setMatrixAt(index, matrix.compose(position, face, scale))
      position.y += 0.002
      heads.current.setMatrixAt(index, matrix.compose(position, upright, scale))
      position.y += 0.0025
      sockets.current.setMatrixAt(index, matrix.compose(position, face, scale))
    })
    for (const ref of [rims, heads, sockets]) {
      ref.current.instanceMatrix.needsUpdate = true
      ref.current.computeBoundingSphere()
    }
  }, [positions])
  return <group>
    <instancedMesh ref={rims} args={[undefined, undefined, positions.length]}>
      <ringGeometry args={[size * 0.82, size * 1.2, 20]} />
      <meshStandardMaterial color="#657788" metalness={0.75} roughness={0.38} />
    </instancedMesh>
    <instancedMesh ref={heads} args={[undefined, undefined, positions.length]}>
      <cylinderGeometry args={[size * 0.82, size * 0.82, 0.004, 20]} />
      <meshPhysicalMaterial {...material} />
    </instancedMesh>
    <instancedMesh ref={sockets} args={[undefined, undefined, positions.length]}>
      <circleGeometry args={[size * 0.32, 6]} />
      <meshStandardMaterial color="#46586a" metalness={0.5} roughness={0.52} />
    </instancedMesh>
  </group>
}
