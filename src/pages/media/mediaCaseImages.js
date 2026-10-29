const images = import.meta.glob('../../assets/figma/media/case-img/*.png', { eager: true, query: '?url', import: 'default' })

// Each image is a complete Figma `img` layer, including its masks and effects.
export function mediaCaseImage(name) {
  return images[`../../assets/figma/media/case-img/${name}.png`]
}
