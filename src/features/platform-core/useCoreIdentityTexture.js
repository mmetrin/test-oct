import { useEffect, useState } from 'react'
import { CanvasTexture, ClampToEdgeWrapping, LinearFilter, LinearMipmapLinearFilter, SRGBColorSpace } from 'three'
import identityMark from '../../assets/platform-core/identity-mark.svg'

export function useCoreIdentityTexture() {
  const [identity, setIdentity] = useState(null)
  useEffect(() => {
    let active = true
    let texture
    const image = new Image()
    image.onload = () => {
      if (!active) return
      // Transparent gutters prevent filtering from carrying ink to the image boundary.
      const padding = 64
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth + padding * 2
      canvas.height = image.naturalHeight + padding * 2
      const context = canvas.getContext('2d')
      if (!context) return
      context.drawImage(image, padding, padding)
      texture = new CanvasTexture(canvas)
      texture.colorSpace = SRGBColorSpace
      texture.wrapS = texture.wrapT = ClampToEdgeWrapping
      texture.minFilter = LinearMipmapLinearFilter
      texture.magFilter = LinearFilter
      texture.anisotropy = 8
      setIdentity({ texture, uvBounds: [padding / canvas.width, padding / canvas.height, image.naturalWidth / canvas.width, image.naturalHeight / canvas.height] })
    }
    image.src = identityMark
    return () => { active = false; image.onload = null; texture?.dispose() }
  }, [])
  return identity
}
