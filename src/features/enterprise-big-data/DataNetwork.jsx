import diksiLogo from '../../assets/enterprise-big-data/diksi.svg'
import khlLogo from '../../assets/enterprise-big-data/khl.svg'
import magnitLogo from '../../assets/enterprise-big-data/magnit.svg'
import mvideoLogo from '../../assets/enterprise-big-data/mvideo.svg'
import ofdLogo from '../../assets/enterprise-big-data/ofd.svg'
import x5Logo from '../../assets/enterprise-big-data/x5.svg'
import bigDataLogo from '../../assets/enterprise-big-data/big-data-mts.png'
import './DataNetwork.css'

const LOGOS = [
  { name: 'Дикси', source: diksiLogo, position: 'top-left' },
  { name: 'КХЛ', source: khlLogo, position: 'middle-left' },
  { name: 'Магнит', source: magnitLogo, position: 'bottom-left' },
  { name: 'М.Видео', source: mvideoLogo, position: 'top-right' },
  { name: 'ОФД', source: ofdLogo, position: 'middle-right' },
  { name: 'X5', source: x5Logo, position: 'bottom-right' },
]

const TRACKS = [
  'M324 108 H1596',
  'M324 108 V415',
  'M1596 108 V415',
  'M280 258 H856',
  'M1064 258 H1640',
  'M960 108 V226',
]

const ROUTES = [
  { path: 'M324 108 H960 V226', duration: '7.4s', delay: '-1.8s' },
  { path: 'M1596 108 H960 V226', duration: '8.3s', delay: '-4.8s' },
  { path: 'M280 258 H856', duration: '6.2s', delay: '-3.2s' },
  { path: 'M1640 258 H1064', duration: '6.9s', delay: '-1.0s' },
  { path: 'M324 415 V258 H856', duration: '8.0s', delay: '-6.1s' },
  { path: 'M1596 415 V258 H1064', duration: '8.6s', delay: '-2.9s' },
]

function Pulse({ path, duration, delay }) {
  return (
    <g className="data-network__pulse">
      <circle r="13" fill="#6F98C2" opacity=".32" filter="url(#data-network-glow)" />
      <rect x="-13" y="-2.5" width="26" height="5" rx="2.5" fill="#6F98C2" />
      <rect x="-6" y="-1" width="12" height="2" rx="1" fill="#fff" opacity=".92" />
      <animateMotion path={path} dur={duration} begin={delay} repeatCount="indefinite" rotate="auto" />
    </g>
  )
}

export function DataNetwork() {
  return (
    <div className="data-network" role="group" aria-label="Данные партнёров поступают в Big Data МТС">
      <svg className="data-network__tracks" viewBox="0 0 1920 500" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id="data-network-glow" x="-180%" y="-180%" width="460%" height="460%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        <g className="data-network__track-lines">
          {TRACKS.map((path) => (
            <g key={path}>
              <path d={path} className="data-network__track-bed" />
              <path d={path} className="data-network__track-core" />
              <path d={path} className="data-network__track-highlight" />
            </g>
          ))}
        </g>
        {[ [324, 258], [1596, 258], [960, 108] ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="5" className="data-network__junction" />
        ))}
        {ROUTES.map((route) => <Pulse key={route.path} {...route} />)}
      </svg>
      {LOGOS.map((logo) => (
        <div key={logo.name} className={`data-network__logo data-network__logo--${logo.position}`}>
          <img src={logo.source} alt={logo.name} />
        </div>
      ))}
      <div className="data-network__hub">
        <img src={bigDataLogo} alt="Big Data МТС — 65+ млн абонентов" />
      </div>
    </div>
  )
}
