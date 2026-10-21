import { caseArrow, caseArtwork } from './artworkData'

export function CaseArtwork({ id }) {
  const artwork = caseArtwork[id]
  const [left, top, width, height] = artwork.rect
  return (
    <span className="case-artwork" aria-hidden="true">
      <span className="case-artwork__photo">
        <img src={artwork.image} alt="" draggable="false" style={{ left, top, width, height, transform: artwork.flip ? 'scaleX(-1)' : undefined }} />
        <span className="case-artwork__soften" />
      </span>
      <span className="case-artwork__header">
        <span className="case-artwork__logo" style={{ width: artwork.logoWidth ?? 305 }}>
          {id === 'global-functional-drinks' && <span style={{ position: 'absolute', left: 4, top: 9, width: 23, height: 22, background: 'white', opacity: .9 }} />}
          {artwork.logo.map((part) => <img key={part.src} src={part.src} alt="" draggable="false" style={{ left: part.x, top: part.y, width: part.width, height: part.height }} />)}
        </span>
        <span className="case-artwork__arrow" style={{ '--arrow-icon': `url("${caseArrow}")` }}><img src={caseArrow} alt="" draggable="false" /></span>
      </span>
    </span>
  )
}
