import { useEffect, useState } from 'react'
import { SRGBColorSpace, TextureLoader } from 'three'

export function useCoreLogoTexture(source) {
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
