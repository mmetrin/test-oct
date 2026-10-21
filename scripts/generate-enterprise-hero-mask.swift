// Regenerate a hero person matte directly from its background video.
// Run: swift scripts/generate-enterprise-hero-mask.swift [source-video] [output-mask]

import AVFoundation
import CoreImage
import Vision

let projectRoot = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let sourcePath = CommandLine.arguments.count > 1
  ? CommandLine.arguments[1]
  : "src/assets/enterprise-hero/cinematic-business-background.mp4"
let outputPath = CommandLine.arguments.count > 2
  ? CommandLine.arguments[2]
  : "src/assets/enterprise-hero/leadership-person-mask.mp4"
let sourceURL = projectRoot.appendingPathComponent(sourcePath)
let outputURL = projectRoot.appendingPathComponent(outputPath)

try? FileManager.default.removeItem(at: outputURL)

let asset = AVURLAsset(url: sourceURL)
guard let track = asset.tracks(withMediaType: .video).first else {
  fatalError("The source video has no video track")
}
let outputWidth = Int(track.naturalSize.width / 2)
let outputHeight = Int(track.naturalSize.height / 2)

let reader = try AVAssetReader(asset: asset)
let trackOutput = AVAssetReaderTrackOutput(
  track: track,
  outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA]
)
reader.add(trackOutput)

let writer = try AVAssetWriter(outputURL: outputURL, fileType: .mp4)
let writerInput = AVAssetWriterInput(
  mediaType: .video,
  outputSettings: [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: outputWidth,
    AVVideoHeightKey: outputHeight,
    AVVideoCompressionPropertiesKey: [
      AVVideoAverageBitRateKey: 4_000_000,
      AVVideoMaxKeyFrameIntervalKey: 24,
    ],
  ]
)
writerInput.expectsMediaDataInRealTime = false
writer.add(writerInput)

let adaptor = AVAssetWriterInputPixelBufferAdaptor(
  assetWriterInput: writerInput,
  sourcePixelBufferAttributes: [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
    kCVPixelBufferWidthKey as String: outputWidth,
    kCVPixelBufferHeightKey as String: outputHeight,
    kCVPixelBufferIOSurfacePropertiesKey as String: [:],
  ]
)

guard reader.startReading(), writer.startWriting() else {
  fatalError("Could not start reading or writing the hero video")
}
writer.startSession(atSourceTime: .zero)

let segmentation = VNGeneratePersonSegmentationRequest()
segmentation.qualityLevel = .accurate
segmentation.outputPixelFormat = kCVPixelFormatType_OneComponent8
let sequence = VNSequenceRequestHandler()
let ciContext = CIContext()
let colorSpace = CGColorSpaceCreateDeviceRGB()
var frameCount = 0

while let sample = trackOutput.copyNextSampleBuffer() {
  guard let sourceFrame = CMSampleBufferGetImageBuffer(sample) else { continue }
  try sequence.perform([segmentation], on: sourceFrame)
  guard let maskFrame = segmentation.results?.first?.pixelBuffer,
        let pool = adaptor.pixelBufferPool else {
    fatalError("Could not generate a person mask for frame \(frameCount)")
  }

  var outputFrame: CVPixelBuffer?
  guard CVPixelBufferPoolCreatePixelBuffer(kCFAllocatorDefault, pool, &outputFrame) == kCVReturnSuccess,
        let outputFrame else {
    fatalError("Could not allocate output frame \(frameCount)")
  }

  let scaledMask = CIImage(cvPixelBuffer: maskFrame).transformed(
    by: CGAffineTransform(
      scaleX: CGFloat(outputWidth) / CGFloat(CVPixelBufferGetWidth(maskFrame)),
      y: CGFloat(outputHeight) / CGFloat(CVPixelBufferGetHeight(maskFrame))
    )
  )
  ciContext.render(
    scaledMask,
    to: outputFrame,
    bounds: CGRect(x: 0, y: 0, width: outputWidth, height: outputHeight),
    colorSpace: colorSpace
  )

  while !writerInput.isReadyForMoreMediaData {
    Thread.sleep(forTimeInterval: 0.005)
  }
  guard adaptor.append(outputFrame, withPresentationTime: CMSampleBufferGetPresentationTimeStamp(sample)) else {
    fatalError("Could not write person mask frame \(frameCount): \(writer.error?.localizedDescription ?? "unknown error")")
  }

  frameCount += 1
  if frameCount.isMultiple(of: 24) {
    print("Generated \(frameCount) mask frames")
  }
}

guard reader.status == .completed else {
  fatalError("Video reading failed: \(reader.error?.localizedDescription ?? "unknown error")")
}

writerInput.markAsFinished()
let finished = DispatchSemaphore(value: 0)
writer.finishWriting { finished.signal() }
finished.wait()

guard writer.status == .completed else {
  fatalError("Mask writing failed: \(writer.error?.localizedDescription ?? "unknown error")")
}
print("Wrote \(frameCount) frames to \(outputURL.path)")
