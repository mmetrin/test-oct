import { useEffect } from 'react'

import maskAtlas from '../../assets/enterprise-hero/mother-child-card-mask.png'

const columns = 11
const tileWidth = 704
const tileHeight = 399
const lastFrame = 120
const framesPerSecond = 24

export function useMotherChildCardMask(cardRef, videoRef, visible) {
  useEffect(() => {
    const card = cardRef.current
    const video = videoRef.current
    if (!card || !video || !visible) return undefined

    const image = new Image()
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) return undefined
    const frameCache = new Map()
    const resolution = Math.min(window.devicePixelRatio || 1, 2)
    let videoCallback = null
    let animationCallback = null
    let disposed = false
    let geometry = null
    let mediaTime = video.currentTime
    let appliedMask = null
    const hasVideoFrameCallback = 'requestVideoFrameCallback' in video

    function measure() {
      const cardBox = card.getBoundingClientRect()
      const videoBox = video.getBoundingClientRect()
      const scaleX = cardBox.width / card.offsetWidth
      const scaleY = cardBox.height / card.offsetHeight
      if (!scaleX || !scaleY) return

      const nextGeometry = {
        width: videoBox.width / scaleX,
        height: videoBox.height / scaleY,
        x: (videoBox.left - cardBox.left) / scaleX,
        y: (videoBox.top - cardBox.top) / scaleY,
      }
      const width = Math.round(card.offsetWidth * resolution)
      const height = Math.round(card.offsetHeight * resolution)
      const hasChanged = !geometry || Object.keys(nextGeometry).some((key) => (
        Math.abs(nextGeometry[key] - geometry[key]) > .01
      ))
      if (hasChanged || canvas.width !== width || canvas.height !== height) {
        geometry = nextGeometry
        if (canvas.width !== width) canvas.width = width
        if (canvas.height !== height) canvas.height = height
        frameCache.clear()
      }
      draw(mediaTime)
    }

    function draw(time) {
      if (disposed || !geometry || !image.complete || !image.naturalWidth || video.seeking) return
      const frame = Math.min(lastFrame, Math.max(0, Math.round(time * framesPerSecond)))
      let mask = frameCache.get(frame)
      if (!mask) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        // Crop before CSS compositing: avoid a 17,424px-wide scaled GPU mask.
        context.drawImage(
          image,
          (frame % columns) * tileWidth, Math.floor(frame / columns) * tileHeight,
          tileWidth, tileHeight,
          geometry.x * resolution, geometry.y * resolution,
          geometry.width * resolution, geometry.height * resolution,
        )
        mask = `url("${canvas.toDataURL('image/png')}")`
        frameCache.set(frame, mask)
      }
      if (mask !== appliedMask) {
        card.style.maskImage = mask
        card.style.setProperty('-webkit-mask-image', mask)
        appliedMask = mask
      }
      card.dataset.maskReady = ''
    }

    function onVideoFrame(_now, metadata) {
      mediaTime = metadata.mediaTime
      // Match the mask to the frame that has just been presented, rather than
      // leaving the ponytail under the previous mask until the next animation tick.
      measure()
      videoCallback = video.requestVideoFrameCallback(onVideoFrame)
    }

    function onAnimationFrame() {
      if (!hasVideoFrameCallback) mediaTime = video.currentTime
      // CSS bounce changes position and scale without triggering ResizeObserver.
      // Reproject the matte each display frame so the silhouettes stay on people.
      measure()
      animationCallback = window.requestAnimationFrame(onAnimationFrame)
    }

    function onSeeking() {
      delete card.dataset.maskReady
    }

    image.onload = () => draw(video.currentTime)
    image.src = maskAtlas
    const observer = new ResizeObserver(measure)
    observer.observe(card)
    observer.observe(video)
    window.addEventListener('resize', measure)
    video.addEventListener('seeking', onSeeking)
    measure()
    if (hasVideoFrameCallback) {
      videoCallback = video.requestVideoFrameCallback(onVideoFrame)
    }
    animationCallback = window.requestAnimationFrame(onAnimationFrame)

    return () => {
      disposed = true
      image.onload = null
      observer.disconnect()
      window.removeEventListener('resize', measure)
      video.removeEventListener('seeking', onSeeking)
      if (videoCallback !== null) video.cancelVideoFrameCallback(videoCallback)
      if (animationCallback !== null) window.cancelAnimationFrame(animationCallback)
    }
  }, [cardRef, videoRef, visible])
}
