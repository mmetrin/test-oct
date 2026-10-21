// Export the graph-sized areas of every person-matte frame as one image.
// Run: swift scripts/generate-enterprise-graph-matte.swift [leadership|mother-child]

import AppKit
import AVFoundation
import CoreImage

let projectRoot = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let scene = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "leadership"
guard scene == "leadership" || scene == "mother-child" else {
  fatalError("Unknown graph scene: \(scene)")
}
let assetName = scene == "leadership" ? "leadership" : "mother-child"
let maskURL = projectRoot.appendingPathComponent("src/assets/enterprise-hero/\(assetName)-person-mask.mp4")
let outputURL = projectRoot.appendingPathComponent("src/assets/enterprise-hero/\(assetName)-graph-matte.png")
let asset = AVURLAsset(url: maskURL)
guard let track = asset.tracks(withMediaType: .video).first else {
  fatalError("The person mask has no video track")
}

let graphSize = 250
// Keep these crop origins in sync with graphScenes positions in MaskedHeroVideo.jsx.
let graphPositions = scene == "leadership"
  ? [(370, 449), (776, 150)]
  : [(644, 200), (1040, 165)]
let stageWidth = CGFloat(1584)
let stageHeight = CGFloat(897)
let sourceWidth = CGFloat(track.naturalSize.width)
let sourceHeight = CGFloat(track.naturalSize.height)
let scale = max(stageWidth / sourceWidth, stageHeight / sourceHeight)
let imageWidth = sourceWidth * scale
let imageHeight = sourceHeight * scale
let imageX = (stageWidth - imageWidth) / 2
let imageY = (stageHeight - imageHeight) / 2

// Render a source or matte frame in exactly the same stage coordinates as the browser.
func imageTilePixels(image: CGImage, position: (Int, Int)) -> [UInt8] {
  let bytesPerRow = graphSize * 4
  let bitmapInfo = CGBitmapInfo.byteOrder32Big.rawValue | CGImageAlphaInfo.premultipliedLast.rawValue
  var pixels = [UInt8](repeating: 0, count: graphSize * bytesPerRow)
  pixels.withUnsafeMutableBytes { buffer in
    guard let tile = CGContext(
      data: buffer.baseAddress,
      width: graphSize,
      height: graphSize,
      bitsPerComponent: 8,
      bytesPerRow: bytesPerRow,
      space: colorSpace,
      bitmapInfo: bitmapInfo
    ) else { fatalError("Could not create a graph-sized tile") }
    tile.translateBy(x: 0, y: CGFloat(graphSize))
    tile.scaleBy(x: 1, y: -1)
    let frameScale = max(stageWidth / CGFloat(image.width), stageHeight / CGFloat(image.height))
    let frameWidth = CGFloat(image.width) * frameScale
    let frameHeight = CGFloat(image.height) * frameScale
    let drawRect = CGRect(
      x: (stageWidth - frameWidth) / 2 - CGFloat(position.0),
      y: (stageHeight - frameHeight) / 2 - CGFloat(position.1),
      width: frameWidth,
      height: frameHeight
    )
    tile.translateBy(x: 0, y: drawRect.minY * 2 + drawRect.height)
    tile.scaleBy(x: 1, y: -1)
    tile.draw(image, in: drawRect)
  }
  return pixels
}

// Vision drops the sleeve below the laptop's upper edge. Recover that small
// area from its warm colour, rather than widening the whole person silhouette.
func personTileWithSleeve(mask: CGImage, source: CGImage, position: (Int, Int)) -> CGImage {
  let bytesPerRow = graphSize * 4
  let bitmapInfo = CGBitmapInfo.byteOrder32Big.rawValue | CGImageAlphaInfo.premultipliedLast.rawValue
  let maskPixels = imageTilePixels(image: mask, position: position)
  let sourcePixels = imageTilePixels(image: source, position: position)
  var completed = maskPixels
  for y in 65..<132 {
    var sleeveEdge: Int? = nil
    for x in 70..<185 {
      let sample = (y * graphSize + x) * 4
      let next = sample + 4
      let isWarm = Int(sourcePixels[sample]) - Int(sourcePixels[sample + 2]) > 3
      let nextIsWarm = Int(sourcePixels[next]) - Int(sourcePixels[next + 2]) > 3
      if isWarm && nextIsWarm {
        sleeveEdge = x
        break
      }
    }
    guard let sleeveEdge else { continue }
    let opacity = UInt8(min(255, (y - 65) * 32))
    for x in sleeveEdge..<graphSize {
      let target = (y * graphSize + x) * 4
      let edgeOpacity = x == sleeveEdge ? opacity / 2 : opacity
      let value = max(completed[target], completed[target + 1], completed[target + 2], edgeOpacity)
      completed[target] = value
      completed[target + 1] = value
      completed[target + 2] = value
      completed[target + 3] = 255
    }
  }
  guard let provider = CGDataProvider(data: Data(completed) as CFData),
        let result = CGImage(
          width: graphSize,
          height: graphSize,
          bitsPerComponent: 8,
          bitsPerPixel: 32,
          bytesPerRow: bytesPerRow,
          space: colorSpace,
          bitmapInfo: CGBitmapInfo(rawValue: bitmapInfo),
          provider: provider,
          decode: nil,
          shouldInterpolate: false,
          intent: .defaultIntent
        ) else { fatalError("Could not create the sleeve mask") }
  return result
}

// Vision's person matte leaves the laptop transparent. Track its top edge in
// stage coordinates so the left graph card passes behind the screen as well.
let laptopKeyframes: [(frame: CGFloat, left: CGFloat, right: CGFloat, topLeft: CGFloat, topRight: CGFloat)] = [
  (0, 523, 692, 525, 527),
  (24, 517, 687, 525, 528),
  (48, 504, 678, 526, 529),
  (72, 501, 680, 527, 530),
  (96, 498, 682, 529, 531),
  (120, 500, 684, 529, 531),
  (144, 500, 684, 529, 531),
]

func laptopEdge(at frame: Int) -> (left: CGFloat, right: CGFloat, topLeft: CGFloat, topRight: CGFloat) {
  let nextIndex = laptopKeyframes.firstIndex { $0.frame >= CGFloat(frame) } ?? laptopKeyframes.count - 1
  let next = laptopKeyframes[nextIndex]
  let previous = laptopKeyframes[max(0, nextIndex - 1)]
  let span = max(1, next.frame - previous.frame)
  let progress = (CGFloat(frame) - previous.frame) / span
  func blend(_ start: CGFloat, _ end: CGFloat) -> CGFloat { start + (end - start) * progress }
  return (
    blend(previous.left, next.left),
    blend(previous.right, next.right),
    blend(previous.topLeft, next.topLeft),
    blend(previous.topRight, next.topRight)
  )
}

let tilesPerRow = 11
let expectedFrames = scene == "leadership" ? 145 : 121
let rows = Int(ceil(Double(expectedFrames * graphPositions.count) / Double(tilesPerRow)))
let atlasWidth = tilesPerRow * graphSize
let atlasHeight = rows * graphSize
let colorSpace = CGColorSpaceCreateDeviceRGB()
guard let canvas = CGContext(
  data: nil,
  width: atlasWidth,
  height: atlasHeight,
  bitsPerComponent: 8,
  bytesPerRow: 0,
  space: colorSpace,
  bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
) else {
  fatalError("Could not create the graph mask atlas")
}

// Work in CSS/canvas coordinates, with the origin at the upper-left.
canvas.translateBy(x: 0, y: CGFloat(atlasHeight))
canvas.scaleBy(x: 1, y: -1)
canvas.setFillColor(NSColor.black.cgColor)
canvas.fill(CGRect(x: 0, y: 0, width: atlasWidth, height: atlasHeight))

let reader = try AVAssetReader(asset: asset)
let videoOutput = AVAssetReaderTrackOutput(
  track: track,
  outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA]
)
reader.add(videoOutput)
guard reader.startReading() else {
  fatalError("Could not read the person mask")
}

var sourceReader: AVAssetReader? = nil
var sourceOutput: AVAssetReaderTrackOutput? = nil
if scene == "leadership" {
  let sourceURL = projectRoot.appendingPathComponent("src/assets/enterprise-hero/cinematic-business-5928.mp4")
  let sourceAsset = AVURLAsset(url: sourceURL)
  guard let sourceTrack = sourceAsset.tracks(withMediaType: .video).first else {
    fatalError("The leadership video has no video track")
  }
  let nextReader = try AVAssetReader(asset: sourceAsset)
  let nextOutput = AVAssetReaderTrackOutput(
    track: sourceTrack,
    outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA]
  )
  nextReader.add(nextOutput)
  guard nextReader.startReading() else { fatalError("Could not read the leadership video") }
  sourceReader = nextReader
  sourceOutput = nextOutput
}

let ciContext = CIContext()
var frameIndex = 0
while let sample = videoOutput.copyNextSampleBuffer() {
  guard let pixelBuffer = CMSampleBufferGetImageBuffer(sample),
        let image = ciContext.createCGImage(CIImage(cvPixelBuffer: pixelBuffer), from: CGRect(
          x: 0, y: 0, width: sourceWidth, height: sourceHeight
        )) else {
    fatalError("Could not decode mask frame \(frameIndex)")
  }
  var sourceImage: CGImage? = nil
  if let sourceOutput {
    guard let sourceSample = sourceOutput.copyNextSampleBuffer(),
          let sourceBuffer = CMSampleBufferGetImageBuffer(sourceSample),
          let decoded = ciContext.createCGImage(CIImage(cvPixelBuffer: sourceBuffer), from: CGRect(
            x: 0, y: 0,
            width: CVPixelBufferGetWidth(sourceBuffer),
            height: CVPixelBufferGetHeight(sourceBuffer)
          )) else { fatalError("Could not decode leadership frame \(frameIndex)") }
    let maskTime = CMTimeGetSeconds(CMSampleBufferGetPresentationTimeStamp(sample))
    let sourceTime = CMTimeGetSeconds(CMSampleBufferGetPresentationTimeStamp(sourceSample))
    guard abs(maskTime - sourceTime) < 1.0 / 48 else {
      fatalError("Leadership video and person mask are out of sync at frame \(frameIndex)")
    }
    sourceImage = decoded
  }

  for (graphIndex, position) in graphPositions.enumerated() {
    let tileIndex = frameIndex * graphPositions.count + graphIndex
    let tileX = CGFloat(tileIndex % tilesPerRow * graphSize)
    let tileY = CGFloat(tileIndex / tilesPerRow * graphSize)
    canvas.saveGState()
    canvas.clip(to: CGRect(x: tileX, y: tileY, width: CGFloat(graphSize), height: CGFloat(graphSize)))
    let drawRect = CGRect(
      x: tileX - CGFloat(position.0) + imageX,
      y: tileY - CGFloat(position.1) + imageY,
      width: imageWidth,
      height: imageHeight
    )
    // Quartz draws a CGImage upside-down in the top-left coordinate system.
    canvas.saveGState()
    if scene == "leadership" && graphIndex == 0 {
      guard let sourceImage else { fatalError("Missing leadership frame \(frameIndex)") }
      let tile = personTileWithSleeve(mask: image, source: sourceImage, position: position)
      let tileRect = CGRect(x: tileX, y: tileY, width: CGFloat(graphSize), height: CGFloat(graphSize))
      canvas.translateBy(x: 0, y: tileRect.minY * 2 + tileRect.height)
      canvas.scaleBy(x: 1, y: -1)
      canvas.draw(tile, in: tileRect)
    } else {
      canvas.translateBy(x: 0, y: drawRect.minY * 2 + drawRect.height)
      canvas.scaleBy(x: 1, y: -1)
      canvas.draw(image, in: drawRect)
    }
    canvas.restoreGState()

    if scene == "leadership" && graphIndex == 0 {
      let laptop = laptopEdge(at: frameIndex)
      let path = CGMutablePath()
      func point(_ x: CGFloat, _ y: CGFloat) -> CGPoint {
        CGPoint(x: tileX + x - CGFloat(position.0), y: tileY + y - CGFloat(position.1))
      }
      path.move(to: point(laptop.left, laptop.topLeft))
      path.addLine(to: point(laptop.right, laptop.topRight))
      path.addLine(to: point(laptop.right + 110, laptop.topRight + 260))
      path.addLine(to: point(laptop.left + 110, laptop.topLeft + 260))
      path.closeSubpath()
      canvas.setFillColor(NSColor.white.cgColor)
      canvas.addPath(path)
      canvas.fillPath()
    }
    canvas.restoreGState()
  }
  frameIndex += 1
}

guard reader.status == .completed, frameIndex == expectedFrames,
      let atlas = canvas.makeImage(),
      let png = NSBitmapImageRep(cgImage: atlas).representation(using: .png, properties: [:]) else {
  fatalError("Could not finish the graph mask atlas (\(frameIndex) frames)")
}
sourceReader?.cancelReading()
try png.write(to: outputURL)
print("Wrote \(frameIndex) frames to \(outputURL.path)")
