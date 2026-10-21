import partnersMask from '../../assets/figma/dcp/big-data/partners-mask.svg'
import './AudiencePartnerLogos.css'

// Crop the original mask atlas to retain each logo's artwork, color and position.
const partners = [
  { id: 'magnit', label: 'Магнит', x: 118, y: 11, width: 234, height: 73, duration: 8, delay: 0, driftX: 2, driftY: -3 },
  { id: 'khl', label: 'КХЛ', x: 429, y: 0, width: 64, height: 73, duration: 9.4, delay: 0.7, driftX: -2, driftY: 3 },
  { id: 'ofd', label: 'Платформа О-Ф-Д', x: 26, y: 111, width: 169, height: 74, duration: 10.2, delay: 1.1, driftX: 3, driftY: 2 },
  { id: 'mvideo', label: 'М.Видео', x: 252, y: 111, width: 208, height: 74, duration: 8.7, delay: 0.4, driftX: -2, driftY: -3 },
  { id: 'x5', label: 'X5 Group', x: 4, y: 212, width: 198, height: 73, duration: 11, delay: 1.5, driftX: 2, driftY: -2 },
  { id: 'dixy', label: 'Дикси', x: 277, y: 207, width: 203, height: 74, duration: 9.8, delay: 0.9, driftX: -3, driftY: 2 },
]

export function AudiencePartnerLogos() {
  return (
    <div className="audience-data-scene__partners" role="group" aria-label="Партнёры MTS Ads" style={{ '--partners-mask': `url(${partnersMask})` }}>
      {partners.map((partner) => (
        <div
          className="audience-data-scene__partner"
          role="img"
          aria-label={partner.label}
          key={partner.id}
          style={{
            '--partner-x': `${partner.x}px`,
            '--partner-y': `${partner.y}px`,
            '--float-duration': `${partner.duration}s`,
            '--float-delay': `${partner.delay}s`,
            '--float-x': `${partner.driftX}px`,
            '--float-y': `${partner.driftY}px`,
            width: `${partner.width}px`,
            height: `${partner.height}px`,
          }}
        >
          <span className="audience-data-scene__partner-artwork" />
        </div>
      ))}
    </div>
  )
}
