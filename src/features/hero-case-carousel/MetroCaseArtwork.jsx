import backgroundPhoto from '../../assets/figma/hero-cards-design/metro-background.png'
import peoplePhoto from '../../assets/figma/hero-cards-design/metro-people.png'
import metroLogo from '../../assets/figma/hero-cards-design/metro-logo.svg'

export function MetroCaseArtwork() {
  return (
    <span className="case-design-artwork metro-case-artwork" aria-hidden="true">
      <span className="layered-case-artwork__visual">
        <span className="layered-case-artwork__photo-position">
          <span className="layered-case-artwork__photo-rotation">
            <img src={backgroundPhoto} alt="" draggable="false" />
          </span>
        </span>
        <span className="metro-case-artwork__people-position">
          <span className="metro-case-artwork__people-rotation">
            <img src={peoplePhoto} alt="" draggable="false" />
          </span>
        </span>
        <span className="layered-case-artwork__shade" />
      </span>
      <span className="metro-case-artwork__logo">
        <img src={metroLogo} alt="" draggable="false" />
      </span>
      <span className="case-design-artwork__badge metro-case-artwork__badge">DCP Программатик-реклама</span>
      <span className="case-design-artwork__metrics metro-case-artwork__metrics">
        <span className="case-design-artwork__metric">
          <strong>+11,8 п.п.</strong>
          <span>рост транзакций</span>
        </span>
        <span className="case-design-artwork__metric">
          <strong>+5,7 п.п.</strong>
          <span>рост оборота</span>
        </span>
      </span>
    </span>
  )
}
