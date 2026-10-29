import { useId } from 'react'
import diksiLogo from '../../assets/enterprise-big-data/diksi.svg'
import khlLogo from '../../assets/enterprise-big-data/khl.svg'
import magnitLogo from '../../assets/enterprise-big-data/magnit.svg'
import mvideoLogo from '../../assets/enterprise-big-data/mvideo.svg'
import ofdLogo from '../../assets/enterprise-big-data/ofd.svg'
import x5Logo from '../../assets/enterprise-big-data/x5.svg'
import bigDataLogo from '../../assets/enterprise-big-data/big-data-mts.png'
import dataFolderIcon from '../../assets/enterprise-big-data/data-folder.png'
import './DataNetwork.css'

const LOGOS = [
  { name: 'Дикси', source: diksiLogo, position: 'top-left' },
  { name: 'КХЛ', source: khlLogo, position: 'middle-left' },
  { name: 'Магнит', source: magnitLogo, position: 'bottom-left' },
  { name: 'М.Видео', source: mvideoLogo, position: 'top-right' },
  { name: 'ОФД', source: ofdLogo, position: 'middle-right' },
  { name: 'X5', source: x5Logo, position: 'bottom-right' },
]

const ROUTES = [
  { path: 'M324 108 H936 Q960 108 960 132 V226', duration: '11.4s', delay: '-1.8s' },
  { path: 'M1596 108 H984 Q960 108 960 132 V226', duration: '12.8s', delay: '-4.8s' },
  { path: 'M280 258 H856', duration: '9.5s', delay: '-3.2s' },
  { path: 'M1640 258 H1064', duration: '10.6s', delay: '-1.0s' },
  { path: 'M324 415 V282 Q324 258 348 258 H856', duration: '12.3s', delay: '-6.1s' },
  { path: 'M1596 415 V282 Q1596 258 1572 258 H1064', duration: '13.2s', delay: '-2.9s' },
]

const TRACKS = [
  ...ROUTES.map(({ path }) => path),
  'M324 108 H1596',
  'M324 108 V258',
  'M1596 108 V258',
]

const CENTRAL_JUNCTION = 'M936 108 H984 Q960 108 960 132 Q960 108 936 108 Z'

const FOLDER_ROUTES = [
  { path: ROUTES[0].path, duration: '23s', delay: '-3s' },
  { path: ROUTES[5].path, duration: '26s', delay: '-12s' },
]

function Pulse({ path, duration, delay }) {
  return (
    <g className="data-network__pulse">
      <circle className="data-network__pulse-dot" r="4" />
      <animateMotion path={path} dur={duration} begin={delay} keyPoints="0;1;1" keyTimes="0;0.65;1" calcMode="linear" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.03;0.62;0.65;1" dur={duration} begin={delay} repeatCount="indefinite" />
    </g>
  )
}

function FolderPulse({ path, duration, delay }) {
  return (
    <g className="data-network__folder-pulse">
      <image className="data-network__folder-icon" href={dataFolderIcon} x="-18" y="-18" width="36" height="36" />
      <animateMotion path={path} dur={duration} begin={delay} keyPoints="0;1;1" keyTimes="0;0.4;1" calcMode="linear" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.04;0.36;0.4;1" dur={duration} begin={delay} repeatCount="indefinite" />
    </g>
  )
}

export function DataNetwork() {
  const insetShadowId = useId()

  return (
    <div className="data-network" role="group" aria-label="Данные партнёров поступают в Big Data МТС">
      <svg className="data-network__tracks" viewBox="0 0 1920 500" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={insetShadowId} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            <feOffset in="SourceAlpha" dx="1" dy="2.5" result="offset" />
            <feGaussianBlur in="offset" stdDeviation="1.4" result="softOffset" />
            <feComposite in="SourceAlpha" in2="softOffset" operator="out" result="innerEdge" />
            <feFlood floodColor="#6d849f" floodOpacity="0.46" result="shadowColor" />
            <feComposite in="shadowColor" in2="innerEdge" operator="in" result="innerShadow" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="innerShadow" />
            </feMerge>
          </filter>
        </defs>
        <g className="data-network__track-rim" transform="translate(1 2)">
          {TRACKS.map((path) => <path key={path} d={path} />)}
          <path className="data-network__track-junction" d={CENTRAL_JUNCTION} />
        </g>
        <g className="data-network__track-bed" filter={`url(#${insetShadowId})`}>
          {TRACKS.map((path) => <path key={path} d={path} />)}
          <path className="data-network__track-junction" d={CENTRAL_JUNCTION} />
        </g>
        {ROUTES.map((route) => <Pulse key={route.path} {...route} />)}
        {FOLDER_ROUTES.map((route) => <FolderPulse key={route.path} {...route} />)}
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
