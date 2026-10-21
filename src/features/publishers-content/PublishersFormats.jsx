import webDevice from '../../assets/figma/publishers/device-web-transparent.png'
import smartTvDevice from '../../assets/figma/publishers/device-smart-tv-transparent.png'
import inAppDevice from '../../assets/figma/publishers/device-in-app-transparent.png'
import nativeDevice from '../../assets/figma/publishers/device-native-transparent.png'
import inStreamShell from '../../assets/figma/publishers/device-instream-shell.png'
import outStreamTablet from '../../assets/figma/publishers/device-outstream-tablet.png'
import outStreamShell from '../../assets/figma/publishers/device-outstream-shell.png'
import fullscreenShell from '../../assets/figma/publishers/device-fullscreen-shell.png'
import inStreamVideo from '../../assets/figma/publishers/in-stream.mp4'
import outStreamVideo from '../../assets/figma/publishers/out-stream.mp4'
import fullscreenVideo from '../../assets/figma/publishers/fullscreen.mp4'
import './PublishersFormats.css'

const imageDevices = [
  { name: 'Web', className: 'web', image: webDevice, width: 960, height: 600 },
  { name: 'In-App', className: 'in-app', image: inAppDevice, width: 290, height: 600 },
  { name: 'Smart TV', className: 'smart-tv', image: smartTvDevice, width: 960, height: 600 },
  { name: 'Native', className: 'native', image: nativeDevice, width: 980, height: 490 },
]

function ImageDevice({ device }) {
  return (
    <article className={`publishers-formats__device publishers-formats__device--${device.className}`}>
      <img src={device.image} alt="" width={device.width} height={device.height} loading="lazy" draggable={false} />
      <h3>{device.name}</h3>
    </article>
  )
}

function LoopingVideo({ src, label, className }) {
  return (
    <video
      className={className}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
    />
  )
}

export function PublishersFormats() {
  return (
    <section className="publishers-formats" aria-labelledby="publishers-formats-title">
      <h2 id="publishers-formats-title">Все платформы и <span>форматы</span></h2>

      {imageDevices.map((device) => <ImageDevice key={device.name} device={device} />)}

      <article className="publishers-formats__device publishers-formats__device--in-stream">
        <div className="publishers-formats__media publishers-formats__media--in-stream">
          <img className="publishers-formats__shell publishers-formats__shell--in-stream" src={inStreamShell} alt="" aria-hidden="true" width="1013" height="511" loading="lazy" />
          <LoopingVideo className="publishers-formats__video publishers-formats__video--in-stream" src={inStreamVideo} label="Зацикленная видеореклама In-Stream" />
          <span className="publishers-formats__ad-time" aria-hidden="true">Реклама 0:15</span>
          <span className="publishers-formats__progress" aria-hidden="true" />
          <span className="publishers-formats__duration" aria-hidden="true">05:30</span>
        </div>
        <h3>In-Stream</h3>
      </article>

      <article className="publishers-formats__device publishers-formats__device--out-stream">
        <div className="publishers-formats__media publishers-formats__media--out-stream">
          <img className="publishers-formats__tablet--out-stream" src={outStreamTablet} alt="" aria-hidden="true" width="1755" height="896" loading="lazy" />
          <img className="publishers-formats__shell publishers-formats__shell--out-stream" src={outStreamShell} alt="" aria-hidden="true" width="720" height="420" loading="lazy" />
          <LoopingVideo className="publishers-formats__video publishers-formats__video--out-stream" src={outStreamVideo} label="Зацикленная видеореклама Out-Stream" />
        </div>
        <h3>Out-Stream</h3>
      </article>

      <article className="publishers-formats__device publishers-formats__device--fullscreen">
        <div className="publishers-formats__media publishers-formats__media--fullscreen">
          <img className="publishers-formats__shell publishers-formats__shell--fullscreen" src={fullscreenShell} alt="" aria-hidden="true" width="1017" height="513" loading="lazy" />
          <LoopingVideo className="publishers-formats__video publishers-formats__video--fullscreen" src={fullscreenVideo} label="Зацикленная видеореклама Fullscreen" />
          <span className="publishers-formats__fullscreen-title" aria-hidden="true">ЗАПУСТИТЕ<br />РЕКЛАМУ<br />С МТС ADS</span>
          <span className="publishers-formats__fullscreen-close" aria-hidden="true">×</span>
          <span className="publishers-formats__fullscreen-badge" aria-hidden="true">Реклама</span>
        </div>
        <h3>Fullscreen</h3>
      </article>
    </section>
  )
}
