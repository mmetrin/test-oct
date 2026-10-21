import getbloggerImage from '../../assets/figma/hero-cards-design/getblogger-image-2x.png'
import getbloggerLogo from '../../assets/figma/hero-cards-design/getblogger-logo.svg'

export function GetbloggerCaseArtwork() {
  return (
    <span className="case-design-artwork" aria-hidden="true">
      <img className="case-design-artwork__image" src={getbloggerImage} alt="" draggable="false" />
      <span className="getblogger-case-artwork__logo"><img src={getbloggerLogo} alt="" /></span>
      <span className="case-design-artwork__badge getblogger-case-artwork__badge">От 1000 подписчиков</span>
      <span className="case-design-artwork__metrics getblogger-case-artwork__metrics">
        <span className="case-design-artwork__metric getblogger-case-artwork__headline">
          <strong>Монетизируйте свою аудиторию</strong>
        </span>
        <span className="case-design-artwork__metric">
          <strong>+67% рост</strong>
          <span>среднего чека блогеров</span>
        </span>
      </span>
    </span>
  )
}
