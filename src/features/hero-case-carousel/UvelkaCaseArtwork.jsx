import familyPhoto from '../../assets/figma/hero-cards-design/uvelka-photo.png'
import familyOverlay from '../../assets/figma/hero-cards-design/uvelka-overlay.png'
import uvelkaLogo from '../../assets/figma/hero-cards-design/uvelka-logo.svg'
import buzzoolaIcon from '../../assets/figma/hero-cards-design/buzzoola-icon.svg'

export function UvelkaCaseArtwork() {
  return (
    <span className="case-design-artwork uvelka-case-artwork" aria-hidden="true">
      <span className="layered-case-artwork__visual">
        <span className="layered-case-artwork__photo-position">
          <span className="layered-case-artwork__photo-rotation">
            <img src={familyPhoto} alt="" draggable="false" />
          </span>
        </span>
        <img className="uvelka-case-artwork__family" src={familyOverlay} alt="" draggable="false" />
        <span className="layered-case-artwork__shade" />
      </span>
      <span className="uvelka-case-artwork__logo"><img src={uvelkaLogo} alt="" /></span>
      <span className="case-design-artwork__badge uvelka-case-artwork__badge">
        <img src={buzzoolaIcon} alt="" />
        <span>DSP Buzzoola</span>
      </span>
      <span className="case-design-artwork__metrics uvelka-case-artwork__metrics">
        <span className="case-design-artwork__metric">
          <strong>93% VTR</strong>
          <span>при плане 70%</span>
        </span>
        <span className="case-design-artwork__metric">
          <strong>+58% CTR</strong>
          <span>выше плана</span>
        </span>
      </span>
    </span>
  )
}
