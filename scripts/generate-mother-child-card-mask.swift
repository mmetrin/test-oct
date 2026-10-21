// Export inverse person mattes for a responsive CSS-masked glass card.
// Run from the project root: swift scripts/generate-mother-child-card-mask.swift
import AppKit
import AVFoundation
import CoreImage

let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let asset = AVURLAsset(url: root.appendingPathComponent("src/assets/enterprise-hero/mother-child-person-mask.mp4"))
let columns = 11
let frameCount = 121
let width = 704
let height = 399
let rows = Int(ceil(Double(frameCount) / Double(columns)))
let reader = try AVAssetReader(asset: asset)
guard let track = asset.tracks(withMediaType: .video).first else { fatalError("Missing mask track") }
let output = AVAssetReaderTrackOutput(track: track, outputSettings: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
])
reader.add(output)
guard reader.startReading(), let atlas = CGContext(
  data: nil, width: columns * width, height: rows * height,
  bitsPerComponent: 8, bytesPerRow: 0, space: CGColorSpaceCreateDeviceRGB(),
  bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
) else { fatalError("Could not create mask atlas") }

let context = CIContext()
var frame = 0
while let sample = output.copyNextSampleBuffer() {
  guard let buffer = CMSampleBufferGetImageBuffer(sample) else { fatalError("Missing frame") }
  let input = CIImage(cvPixelBuffer: buffer)
  // The atlas matches object-fit: cover in the 1584 × 896.83 video box.
  let scale = max(CGFloat(width) / input.extent.width, CGFloat(height) / input.extent.height)
  let scaled = input.transformed(by: CGAffineTransform(scaleX: scale, y: scale))
  let centered = scaled.transformed(by: CGAffineTransform(
    translationX: (CGFloat(width) - scaled.extent.width) / 2,
    y: (CGFloat(height) - scaled.extent.height) / 2
  ))
  let inverse = centered.applyingFilter("CIColorInvert").applyingFilter("CIMaskToAlpha")
  guard frame < frameCount, let image = context.createCGImage(inverse, from: CGRect(x: 0, y: 0, width: width, height: height)) else {
    fatalError("Invalid mask frame")
  }
  atlas.draw(image, in: CGRect(
    x: frame % columns * width,
    y: (rows - 1 - frame / columns) * height,
    width: width, height: height
  ))
  frame += 1
}
guard reader.status == .completed, frame == frameCount,
      let image = atlas.makeImage(),
      let png = NSBitmapImageRep(cgImage: image).representation(using: .png, properties: [:]) else {
  fatalError("Incomplete mask atlas: \(frame) frames")
}
let destination = root.appendingPathComponent("src/assets/enterprise-hero/mother-child-card-mask.png")
try png.write(to: destination)
print("Wrote \(frame) inverse person masks to \(destination.lastPathComponent)")
