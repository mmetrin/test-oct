import voisImage from '../../assets/figma/hero-cards-design/vois-image-2x.png'
import inAppIcon from '../../assets/figma/hero-cards-design/vois-in-app-icon.svg'
import logoV from '../../assets/figma/hero-cards-design/vois-logo-v.svg'
import logoO from '../../assets/figma/hero-cards-design/vois-logo-o.svg'
import logoI from '../../assets/figma/hero-cards-design/vois-logo-i.svg'
import logoS from '../../assets/figma/hero-cards-design/vois-logo-s.svg'

export function VoisCaseArtwork() {
  return (
    <span className="case-design-artwork" aria-hidden="true">
      <img className="case-design-artwork__image" src={voisImage} alt="" draggable="false" />
      <span className="vois-case-artwork__logo">
        <img className="vois-case-artwork__logo-v" src={logoV} alt="" />
        <img className="vois-case-artwork__logo-o" src={logoO} alt="" />
        <img className="vois-case-artwork__logo-i" src={logoI} alt="" />
        <img className="vois-case-artwork__logo-s" src={logoS} alt="" />
      </span>
      <span className="case-design-artwork__badge">
        <img src={inAppIcon} alt="" />
        <span>In-app реклама</span>
      </span>
      <span className="case-design-artwork__metrics">
        <span className="case-design-artwork__metric">
          <strong>5,34 млн показов</strong>
          <span>на 32% выше плана</span>
        </span>
        <span className="case-design-artwork__metric">
          <strong>−25% CRM</strong>
          <span>ниже плана</span>
        </span>
      </span>
    </span>
  )
}
