import './RasterCaseStrip.css'

const CARD_WIDTH = 460
const CARDS_TOP = 124

export function RasterCaseStrip({ src, sourceWidth, cardStarts }) {
  const toContainerWidth = (value) => `${(value / sourceWidth) * 100}cqw`

  return (
    <div
      className="raster-case-strip"
      style={{
        '--case-width': toContainerWidth(CARD_WIDTH),
        '--cases-top': toContainerWidth(CARDS_TOP),
        '--first-case-left': toContainerWidth(cardStarts[0]),
      }}
    >
      <img className="raster-case-strip__heading" src={src} alt="" loading="lazy" draggable={false} />
      <div className="raster-case-strip__cards" aria-hidden="true">
        {cardStarts.map((sourceX) => (
          <span className="raster-case-strip__card" key={sourceX} style={{ '--source-x': toContainerWidth(sourceX) }}>
            <img src={src} alt="" loading="lazy" draggable={false} />
          </span>
        ))}
      </div>
    </div>
  )
}
