import { partnerLogoSets } from './partnerLogos'
import './EnterprisePartnerLogos.css'

export function EnterprisePartnerLogos({ videoChangeCount = 0, visible = true }) {
  const activeSet = videoChangeCount % partnerLogoSets.length

  return (
    <section className={`enterprise-partner-logos${visible ? ' enterprise-partner-logos--visible' : ''}`} aria-label="Компании, которые доверяют МТС ADS">
      <div className="enterprise-partner-logos__inner">
        <p className="enterprise-partner-logos__title">5 000+ компаний доверяют продвижение инструментам МТС ADS</p>
        <div className="enterprise-partner-logos__artwork">
          {partnerLogoSets.map((logos, setIndex) => (
            <div
              className={`enterprise-partner-logos__set${activeSet === setIndex ? ' enterprise-partner-logos__set--active' : ''}`}
              aria-hidden={activeSet !== setIndex}
              key={logos[0].name}
            >
              {logos.map((logo) => (
                <span className="enterprise-partner-logos__slot" style={{ width: logo.width }} role="img" aria-label={logo.name} key={logo.name}>
                  {logo.layers.map((layer) => (
                    <img src={layer.image} alt="" style={{ left: layer.left, top: layer.top }} key={layer.image} />
                  ))}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
