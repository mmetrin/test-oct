import { useEffect, useState } from 'react'
import { SRGBColorSpace, TextureLoader } from 'three'
import vkLogo from '../../assets/orbital-hero/vk-ads.svg'
import telegramLogo from '../../assets/orbital-hero/telegram.svg'
import avitoLogo from '../../assets/orbital-hero/avito.svg'
import mtsLogo from '../../assets/platform-core/mts-header-mark.svg'
import telegramMark from '../../assets/platform-core/telegram-mark.svg'
import vkMark from '../../assets/platform-core/vk-ads-mark.svg'
import mtsMark from '../../assets/platform-core/mts-letter-mark.svg'

const logos = { vk: vkLogo, telegram: telegramLogo, avito: avitoLogo, mts: mtsLogo }
const surfaceMarks = { vk: vkMark, telegram: telegramMark, mts: mtsMark }

function useOwnedLogo(source) {
  const [texture, setTexture] = useState(null)
  useEffect(() => {
    let active = true
    const loaded = new TextureLoader().load(source, (value) => {
      value.colorSpace = SRGBColorSpace
      value.anisotropy = 8
      if (active) setTexture(value)
      else value.dispose()
    })
    return () => { active = false; loaded.dispose() }
  }, [source])
  return texture
}

// Printed flush on the lid: the mark shares its parent's axes, with no billboard correction.
export function CoreBrandMark({ brand, size, position, onBrandSurface = false }) {
  const texture = useOwnedLogo(onBrandSurface ? surfaceMarks[brand] ?? logos[brand] : logos[brand])
  if (!texture) return null
  return <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
    <planeGeometry args={[size, size]} />
    <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false}
      polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-1} />
  </mesh>
}
