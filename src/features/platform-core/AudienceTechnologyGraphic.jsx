import { useId } from 'react'
import stableId from '../../assets/figma/platform-audience/stable-id.png'
import smartTarget from '../../assets/figma/platform-audience/smart-target.png'
import stableTelegram from '../../assets/figma/platform-audience/stable-telegram.svg'
import stableVk from '../../assets/figma/platform-audience/stable-vk.svg'
import stableAvito from '../../assets/figma/platform-audience/stable-avito.svg'
import stableBrand from '../../assets/figma/platform-audience/stable-brand.svg'
import './AudienceTechnologyGraphics.css'

// Keep the original Figma portraits, cropped into independently animated SVG layers.
const STABLE_SPRITE = { src: stableId, x: -11.41, y: -13.443, scale: 0.120013, width: 1609, height: 977 }
const SMART_SPRITE = { src: smartTarget, x: 0, y: -10.209, scale: 181.69 / 1586, width: 1586, height: 992 }
const STABLE_SOURCES = [
  { id: 'first', cx: 282, cy: 313, rx: 178, ry: 182 },
  { id: 'second', cx: 624, cy: 460, rx: 176, ry: 178 },
  { id: 'third', cx: 357, cy: 711, rx: 171, ry: 175 },
]
const STABLE_LINKS = [
  'M41.5 14.5C75 13 78 41 97 47.5',
  'M84.5 47H97',
  'M52 73C76 74 83 54 97 47.5',
]
const SMART_SELECTED = [
  { id: 'man-top', cx: 664, cy: 350, rx: 152, ry: 153, fromX: -6, fromY: -5 },
  { id: 'woman-top', cx: 1011, cy: 351, rx: 155, ry: 156, fromX: 7, fromY: -5 },
  { id: 'man-bottom', cx: 512, cy: 654, rx: 155, ry: 156, fromX: -7, fromY: 6 },
  { id: 'woman-bottom', cx: 852, cy: 651, rx: 156, ry: 158, fromX: 6, fromY: 7 },
]
const SMART_OTHER = [
  { id: 'top-left', cx: 337, cy: 240, rx: 90, ry: 91 },
  { id: 'left', cx: 185, cy: 485, rx: 85, ry: 86 },
  { id: 'bottom-left', cx: 190, cy: 782, rx: 91, ry: 92 },
  { id: 'top-right', cx: 1355, cy: 211, rx: 88, ry: 89 },
  { id: 'right', cx: 1388, cy: 566, rx: 87, ry: 88 },
]

function PortraitSprite({ sprite, portrait, className }) {
  const clipId = useId()
  const { cx, cy, rx, ry, fromX, fromY } = portrait
  const x = sprite.x + cx * sprite.scale
  const y = sprite.y + cy * sprite.scale
  const radiusX = rx * sprite.scale
  const radiusY = ry * sprite.scale

  return <g transform={`translate(${x} ${y})`}>
    <g className={`audience-technology-graphic__portrait ${className}`} data-from-x={fromX} data-from-y={fromY}>
      <defs><clipPath id={clipId}><ellipse rx={radiusX} ry={radiusY} /></clipPath></defs>
      <image href={sprite.src} x={sprite.x - x} y={sprite.y - y} width={sprite.width * sprite.scale} height={sprite.height * sprite.scale} clipPath={`url(#${clipId})`} />
      <ellipse className="audience-technology-graphic__portrait-rim" rx={radiusX} ry={radiusY} />
    </g>
  </g>
}

function StableIdGraphic() {
  return <svg className="audience-technology-graphic audience-technology-graphic--stable" viewBox="0 0 177.475 93" aria-hidden="true">
    <g className="stable-id__connections">
      {STABLE_LINKS.map((d) => <path key={d} className="stable-id__link" d={d} />)}
      {STABLE_LINKS.map((d) => <path key={d} className="stable-id__signal" d={d} />)}
    </g>
    {STABLE_SOURCES.map((portrait) => <PortraitSprite key={portrait.id} sprite={STABLE_SPRITE} portrait={portrait} className="stable-id__source" />)}
    <PortraitSprite sprite={STABLE_SPRITE} portrait={{ cx: 1206, cy: 508, rx: 299, ry: 305 }} className="stable-id__resolved" />
    <g transform="translate(133.326 47.524)">
      <ellipse className="stable-id__result-ring" rx="36.15" ry="36.88" />
      <ellipse className="stable-id__confirmation" rx="36.15" ry="36.88" />
    </g>
    <image href={stableTelegram} x="24" y="33" width="16" height="16" />
    <image href={stableVk} x="66" y="50" width="16" height="16" />
    <image href={stableAvito} x="34" y="81" width="16" height="16" />
    <image className="stable-id__mts-logo" href={stableBrand} x="144" y="62" width="24" height="25" />
  </svg>
}

function SmartTargetGraphic() {
  return <svg className="audience-technology-graphic audience-technology-graphic--smart" viewBox="0 0 177.475 93" aria-hidden="true">
    <g transform="translate(88.45 48.55) rotate(-31.5)">
      <ellipse className="smart-target__selection" rx="61.3" ry="35.4" />
      <ellipse className="smart-target__confirmation" rx="61.3" ry="35.4" />
    </g>
    {SMART_OTHER.map((portrait) => <PortraitSprite key={portrait.id} sprite={SMART_SPRITE} portrait={portrait} className="smart-target__other" />)}
    {SMART_SELECTED.map((portrait) => <PortraitSprite key={portrait.id} sprite={SMART_SPRITE} portrait={portrait} className="smart-target__selected" />)}
  </svg>
}

export function AudienceTechnologyGraphic({ variant }) {
  return variant === 'stable' ? <StableIdGraphic /> : <SmartTargetGraphic />
}
