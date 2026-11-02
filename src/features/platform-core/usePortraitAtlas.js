import { useEffect, useState } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'

// The same original photographs used by the homepage's Big Data section.
const sources = Object.entries(import.meta.glob('../../assets/enterprise-big-data/portraits-white/*.jpg', {
  eager: true, query: '?url', import: 'default',
})).sort(([first], [second]) => first.localeCompare(second)).map(([, source]) => source)

export function usePortraitAtlas() {
  const [atlas, setAtlas] = useState(null)
  useEffect(() => {
    let active = true
    let texture
    const images = sources.map(() => new Image())
    Promise.all(images.map((image, index) => new Promise((resolve, reject) => {
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = sources[index]
    }))).then((loaded) => {
      if (!active) return
      const columns = 4
      const rows = Math.ceil(loaded.length / columns)
      const size = 256
      const canvas = document.createElement('canvas')
      canvas.width = columns * size
      canvas.height = rows * size
      const context = canvas.getContext('2d')
      if (!context) return
      loaded.forEach((image, index) => context.drawImage(image, index % columns * size, Math.floor(index / columns) * size, size, size))
      texture = new CanvasTexture(canvas)
      texture.colorSpace = SRGBColorSpace
      texture.anisotropy = 4
      setAtlas({ texture, columns, rows, count: loaded.length })
    }).catch(() => {
      // The original ceramic stays visible if a photograph cannot be loaded.
    })
    return () => {
      active = false
      images.forEach((image) => { image.onload = null; image.onerror = null })
      texture?.dispose()
    }
  }, [])
  return atlas
}
