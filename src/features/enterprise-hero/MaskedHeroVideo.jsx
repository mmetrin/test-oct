import { useEffect, useRef, useState } from 'react'

import leadershipGraphMatte from '../../assets/enterprise-hero/leadership-graph-matte.png'
import motherChildGraphMatte from '../../assets/enterprise-hero/mother-child-graph-matte.png'
import { drawImpressionsRevenueGraph, drawImpressionsToyGraph } from './drawBloggerGraphs'
import { drawInfoBarGraph, drawInfoGraph } from './drawInfoGraph'

const frameSize = 250
const frameRate = 24
const graphFadeSeconds = 1
const atlasColumns = 11
const graphScenes = {
  leadership: {
    matte: leadershipGraphMatte,
    lastFrameIndex: 144,
    scale: 0.82,
    fadeSeconds: 1.8,
    // The leadership atlas is cropped at these positions; update its generator when moving a card.
    positions: [
      [370, 449, drawInfoBarGraph],
      [776, 150, drawInfoGraph],
    ],
  },
  motherChild: {
    matte: motherChildGraphMatte,
    lastFrameIndex: 120,
    positions: [
      [644, 200, drawImpressionsRevenueGraph],
      [1040, 165, drawImpressionsToyGraph, 1.5],
    ],
  },
}

function colorRamp(value, start, end) {
  const progress = Math.min(1, Math.max(0, (value - start) / (end - start)))
  return progress * progress * (3 - 2 * progress)
}

function maskGraphBehindPeople(graphContext, matteContext, sourcePixels) {
  const graphFrame = graphContext.getImageData(0, 0, frameSize, frameSize)
  const matte = matteContext.getImageData(0, 0, frameSize, frameSize).data
  const pixels = graphFrame.data
  for (let index = 0; index < pixels.length; index += 4) {
    let personOpacity = Math.max(matte[index], matte[index + 1], matte[index + 2]) / 255
    if (sourcePixels) {
      const pixel = index / 4
      const x = pixel % frameSize
      const y = Math.floor(pixel / frameSize)
      if (x < 110 && y >= 65 && y < 145) {
        // The man's warm hair moves faster than the encoded matte at the left
        // edge of this card. Use the actual video pixel to remove stale blue
        // background from the matte and retain the hair without a wide halo.
        const red = sourcePixels[index]
        const blue = sourcePixels[index + 2]
        // The encoded person matte has a broad blue fringe around the hair.
        // The background is consistently cooler than the hair here, even in
        // its darker pixels, so key that fringe out using this source frame.
        const coolBackground = colorRamp(blue - red, 3, 14)
        const warmForeground = colorRamp(red - blue, 4, 14)
        personOpacity = Math.max(personOpacity * (1 - coolBackground), warmForeground)
      }
    }
    pixels[index + 3] = Math.round(pixels[index + 3] * (1 - personOpacity))
  }

  return graphFrame
}

export function MaskedHeroVideo({ sourceVideoRef, active, visible, graphTone = 'dark', scene = 'leadership', onFrameReady }) {
  const canvasRef = useRef(null)
  const matteAtlasRef = useRef(null)
  const [hasFrame, setHasFrame] = useState(false)
  const { matte, positions, lastFrameIndex, scale: graphScale = 1, fadeSeconds = graphFadeSeconds } = graphScenes[scene]

  useEffect(() => {
    const image = new Image()
    image.src = matte
    matteAtlasRef.current = image
    return () => { matteAtlasRef.current = null }
  }, [matte])

  useEffect(() => {
    const source = sourceVideoRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!source || !canvas || !context || !active || !visible) {
      // Keep the last composite frame while its video fades out.
      setHasFrame(false)
      return
    }

    const width = Math.round(canvas.clientWidth)
    const height = Math.round(canvas.clientHeight)
    if (!width || !height) return
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }
    context.clearRect(0, 0, width, height)
    setHasFrame(false)

    // Cache only this playback. A new cycle or hot reload rebuilds the full
    // composite from the current chart layout and current matte image.
    const frameCache = new Map()
    let cachedCardRadius = null
    const graphCanvas = document.createElement('canvas')
    const matteCanvas = document.createElement('canvas')
    const sourceTileCanvas = document.createElement('canvas')
    graphCanvas.width = matteCanvas.width = sourceTileCanvas.width = frameSize
    graphCanvas.height = matteCanvas.height = sourceTileCanvas.height = frameSize
    const graphContext = graphCanvas.getContext('2d', { willReadFrequently: true })
    const matteContext = matteCanvas.getContext('2d', { willReadFrequently: true })
    const sourceTileContext = sourceTileCanvas.getContext('2d', { willReadFrequently: true })
    if (!graphContext || !matteContext || !sourceTileContext) return

    const matteAtlas = matteAtlasRef.current
    let sourceFrameCallbackId = null
    let animationFrameId = null
    let frameReady = false
    let graphFadeStartTime = null
    let stopped = false

    function drawFrame(time) {
      if (
        stopped || !matteAtlas.complete || !matteAtlas.naturalWidth
        || source.readyState < 2 || source.seeking
        || Math.abs(time - source.currentTime) > 0.1
      ) return
      if (graphFadeStartTime === null) graphFadeStartTime = time
      const scale = Math.max(width / source.videoWidth, height / source.videoHeight)
      const videoWidth = source.videoWidth * scale
      const videoHeight = source.videoHeight * scale
      const cardRadius = parseFloat(getComputedStyle(canvas).getPropertyValue('--enterprise-metric-radius')) || 24
      if (cardRadius !== cachedCardRadius) {
        frameCache.clear()
        cachedCardRadius = cardRadius
      }
      const frameIndex = Math.max(0, Math.min(lastFrameIndex, Math.round(time * frameRate)))
      context.clearRect(0, 0, width, height)
      context.drawImage(
        source,
        (width - videoWidth) / 2,
        (height - videoHeight) / 2,
        videoWidth,
        videoHeight,
      )
      // The leadership card touches moving hair, so its matte must be checked
      // against the video pixels in this very frame rather than a cached frame.
      let frames = scene === 'leadership' ? null : frameCache.get(frameIndex)

      if (!frames) {
        frames = positions.map(([graphX, graphY, drawGraph, revealDelay = 0], graphIndex) => {
          const fadeProgress = Math.min(1, Math.max(0, (time - graphFadeStartTime - revealDelay) / fadeSeconds))
          const graphOpacity = fadeProgress * fadeProgress * (3 - 2 * fadeProgress)
          const tileIndex = frameIndex * positions.length + graphIndex
          matteContext.clearRect(0, 0, frameSize, frameSize)
          matteContext.drawImage(
            matteAtlas,
            (tileIndex % atlasColumns) * frameSize,
            Math.floor(tileIndex / atlasColumns) * frameSize,
            frameSize,
            frameSize,
            0,
            0,
            frameSize,
            frameSize,
          )
          graphContext.clearRect(0, 0, frameSize, frameSize)
          graphContext.save()
          graphContext.scale(graphScale, graphScale)
          drawGraph(graphContext, 0, 0, frameSize, Math.max(0, frameIndex / frameRate - revealDelay), graphTone, {
            source,
            x: ((width - videoWidth) / 2 - graphX) / graphScale,
            y: ((height - videoHeight) / 2 - graphY) / graphScale,
            width: videoWidth / graphScale,
            height: videoHeight / graphScale,
            radius: cardRadius,
          }, scene === 'leadership' ? graphOpacity : 1)
          graphContext.restore()
          let sourcePixels = null
          if (scene === 'leadership' && graphIndex === 1) {
            sourceTileContext.clearRect(0, 0, frameSize, frameSize)
            sourceTileContext.drawImage(canvas, graphX, graphY, frameSize, frameSize, 0, 0, frameSize, frameSize)
            sourcePixels = sourceTileContext.getImageData(0, 0, frameSize, frameSize).data
          }
          return maskGraphBehindPeople(graphContext, matteContext, sourcePixels)
        })
        if (scene !== 'leadership') frameCache.set(frameIndex, frames)
      }

      // Draw the source and its masked graphs into one frame. The browser can
      // no longer display a new video frame underneath graphs from an old one.
      context.save()
      frames.forEach((frame, index) => {
        if (scene !== 'leadership') {
          const revealDelay = positions[index][3] ?? 0
          const fadeProgress = Math.min(1, Math.max(0, (time - graphFadeStartTime - revealDelay) / fadeSeconds))
          const graphOpacity = fadeProgress * fadeProgress * (3 - 2 * fadeProgress)
          if (graphOpacity <= 0) return
          context.globalAlpha = graphOpacity
        }
        graphContext.putImageData(frame, 0, 0)
        context.drawImage(graphCanvas, positions[index][0], positions[index][1])
      })
      context.restore()
      if (!frameReady) {
        frameReady = true
        setHasFrame(true)
        onFrameReady?.(true)
      }
    }

    function onSourceFrame() {
      // drawImage(video) and currentTime describe the latest decoded frame;
      // callback metadata can trail it when the browser skips presentation.
      drawFrame(source.currentTime)
      sourceFrameCallbackId = source.requestVideoFrameCallback(onSourceFrame)
    }

    function onAnimationFrame() {
      drawFrame(source.currentTime)
      animationFrameId = window.requestAnimationFrame(onAnimationFrame)
    }

    function onSourceSeeking() {
      context.clearRect(0, 0, width, height)
      frameReady = false
      graphFadeStartTime = null
      frameCache.clear()
      setHasFrame(false)
      onFrameReady?.(false)
    }

    source.addEventListener('seeking', onSourceSeeking)
    if ('requestVideoFrameCallback' in source) {
      sourceFrameCallbackId = source.requestVideoFrameCallback(onSourceFrame)
    } else {
      animationFrameId = window.requestAnimationFrame(onAnimationFrame)
    }

    return () => {
      stopped = true
      source.removeEventListener('seeking', onSourceSeeking)
      if (sourceFrameCallbackId !== null) source.cancelVideoFrameCallback(sourceFrameCallbackId)
      if (animationFrameId !== null) window.cancelAnimationFrame(animationFrameId)
    }
  }, [active, visible, graphTone, sourceVideoRef, matte, positions, lastFrameIndex, graphScale, fadeSeconds, scene, onFrameReady])

  return (
    <canvas
      ref={canvasRef}
      className={`enterprise-hero__masked-layer${scene === 'motherChild' ? ' enterprise-hero__masked-layer--mother-child' : ''}${active && visible && hasFrame ? ' enterprise-hero__masked-layer--active' : ''}`}
      aria-hidden="true"
    />
  )
}
