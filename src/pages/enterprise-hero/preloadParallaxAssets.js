import { preload } from 'react-dom'

import funnelBackground from '../../assets/figma/main-enterprises/funnel-bg-2x.png'
import funnelImage from '../../assets/enterprise-hero/sales-funnel-full.png'
import voisImage from '../../assets/figma/funnel-cases/vois.png'
import uvelkaImage from '../../assets/figma/main-enterprises/case-source-6.png'
import orbitImage from '../../assets/figma/audience-data/orbit-light.png'
import whiteBackground from '../../assets/figma/white-solutions-2026/background.png'
import whiteIllustration from '../../assets/figma/white-solutions-2026/illustration.png'
import richImage from '../../assets/figma/main-enterprises/case-source-2.png'
import invitroImage from '../../assets/figma/funnel-cases/invitro.png'
import leadBackground from '../../assets/figma/lead-showcase/background-source.png'
import leadCube from '../../assets/figma/lead-showcase/cube.png'
import metroImage from '../../assets/figma/main-enterprises/case-source-4.png'
import baikalImage from '../../assets/figma/main-enterprises/case-source-5.png'
import magnitImage from '../../assets/figma/funnel-cases/magnit.png'
import blockpostImage from '../../assets/figma/funnel-cases/blockpost.png'
const firstScrollImages = [funnelBackground, funnelImage, voisImage, uvelkaImage]
const nextSectionImages = [orbitImage, whiteBackground, whiteIllustration, richImage, invitroImage]
const laterSectionImages = [leadBackground, leadCube, metroImage, baikalImage, magnitImage, blockpostImage]
const dynamicCardImages = new Set([richImage, invitroImage, metroImage, baikalImage, magnitImage, blockpostImage])
const decodedImages = new Map()

function prepareImage(src, priority) {
  preload(src, { as: 'image', fetchPriority: priority })
  const image = new Image()
  image.fetchPriority = priority
  image.src = src
  if (dynamicCardImages.has(src)) decodedImages.set(src, image)
  return image
}

async function decodeImages(images) {
  for (const image of images) {
    if (image.decode) await image.decode().catch(() => undefined)
  }
}

export function preloadParallaxAssets() {
  // Start the first two sections immediately, then decode farther sections
  // after they cannot compete with the first scroll.
  const firstImages = firstScrollImages.map((src) => prepareImage(src, 'high'))
  const nextImages = nextSectionImages.map((src) => prepareImage(src, 'auto'))

  void decodeImages(firstImages)
    .then(() => decodeImages(nextImages))
    .then(() => {
      const laterImages = laterSectionImages.map((src) => prepareImage(src, 'low'))
      const decodeLater = () => { void decodeImages(laterImages) }
      if ('requestIdleCallback' in window) window.requestIdleCallback(decodeLater, { timeout: 3000 })
      else window.setTimeout(decodeLater, 1200)
    })
}
