import { useEffect, useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import { CanvasTexture, MeshPhysicalMaterial, SRGBColorSpace } from 'three'
import vkLogo from '../../assets/orbital-hero/vk-ads.svg'
import telegramLogo from '../../assets/orbital-hero/telegram.svg'
import avitoLogo from '../../assets/orbital-hero/avito.svg'
import mtsLogo from '../../assets/ecosystem-builder/mts-badge.svg'
import { Fasteners, Panel, Part } from './ModuleParts'

const logos = { vk: vkLogo, telegram: telegramLogo, avito: avitoLogo, mts: mtsLogo }

function CeramicFace({ brand, size, materials, position }) {
  const image = useTexture(logos[brand]).image
  const [w, h] = size
  const { texture, material } = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = Math.round(1024 * h / w)
    const context = canvas.getContext('2d')
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    const logoSize = Math.min(canvas.width, canvas.height) * 0.69
    // All four marks share a centred, square print area and equal margins.
    // The image is baked into the opaque face; there is no floating decal,
    // transparent sorting, coplanar plane or independent logo rotation.
    context.drawImage(image, (canvas.width - logoSize) / 2, (canvas.height - logoSize) / 2, logoSize, logoSize)
    const texture = new CanvasTexture(canvas)
    texture.colorSpace = SRGBColorSpace
    texture.anisotropy = 8
    const material = new MeshPhysicalMaterial({ map: texture, roughness: 0.5, metalness: 0, clearcoat: 0.12, clearcoatRoughness: 0.35, envMapIntensity: 0.18, toneMapped: false })
    return { texture, material }
  }, [image, w, h])
  useEffect(() => () => { texture.dispose(); material.dispose() }, [texture, material])
  return <Panel size={size} radius={0.115} position={position} material={[material, materials.ceramic]} />
}

export function BrandCartridge({ module, materials }) {
  const [w, h, d] = module.size
  return <>
    {/* A real seam separates the machined shell and the rear cap. */}
    <Part size={[w, h, d * 0.72]} position={[0, 0, d * 0.14]} material={materials.silver} radius={0.105} />
    <Part size={[w - 0.014, h - 0.014, d * 0.25]} position={[0, 0, -d * 0.375]} material={materials.silver} radius={0.08} />
    <Part size={[w - 0.032, h - 0.032, d * 0.04]} position={[0, 0, -d * 0.235]} material={materials.gasket} radius={0.075} />
    <Panel size={[w - 0.038, h - 0.038, 0.024]} position={[0, 0, d / 2 + 0.008]} material={materials.gasket} radius={0.13} />
    <Panel size={[w - 0.018, h - 0.018, 0.042]} position={[0, 0, d / 2 + 0.034]} material={materials.chrome} radius={0.13} />
    <CeramicFace brand={module.brand} size={[w - 0.084, h - 0.084, 0.038]} position={[0, 0, d / 2 + 0.069]} materials={materials} />
    <Fasteners size={[w, h, d + 0.174]} inset={0.104} radius={0.016} materials={materials} />
    <group position={[w / 2 + 0.003, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      {Array.from({ length: 5 }, (_, i) => <Panel key={i} size={[0.016, h * 0.44, 0.006]} radius={0.008}
        position={[(i - 2) * d * 0.105, 0, 0]} material={materials.graphite} />)}
    </group>
  </>
}
