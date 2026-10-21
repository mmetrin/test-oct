import backgroundPhoto from '../../assets/figma/hero-cards-design/uvelka-photo.png'
import kosmetikPortrait from '../../assets/figma/hero-cards-design/m-kosmetik-portrait.png'
import kosmetikLogo from '../../assets/figma/hero-cards-design/m-kosmetik-logo.svg'
import telegramIcon from '../../assets/figma/hero-cards-design/vkusno-telegram-icon.svg'

export function MKosmetikCaseArtwork() {
  return (
    <span className="case-design-artwork m-kosmetik-case-artwork" aria-hidden="true">
      <span className="layered-case-artwork__visual">
        <span className="layered-case-artwork__photo-position">
          <span className="layered-case-artwork__photo-rotation">
            <img src={backgroundPhoto} alt="" draggable="false" />
          </span>
        </span>
        <span className="m-kosmetik-case-artwork__portrait-position">
          <img className="m-kosmetik-case-artwork__portrait" src={kosmetikPortrait} alt="" draggable="false" />
        </span>
        <span className="layered-case-artwork__shade" />
      </span>
      <span className="m-kosmetik-case-artwork__logo"><img src={kosmetikLogo} alt="" /></span>
      <span className="case-design-artwork__badge m-kosmetik-case-artwork__badge">
        <img src={telegramIcon} alt="" />
        <span>Telegram Ads</span>
      </span>
      <span className="case-design-artwork__metrics m-kosmetik-case-artwork__metrics">
        <span className="case-design-artwork__metric">
          <strong>+20 п.п. продаж</strong>
          <span>у реактивированной аудитории</span>
        </span>
        <span className="case-design-artwork__metric">
          <strong>250% ROI</strong>
          <span>окупаемость РК</span>
        </span>
      </span>
    </span>
  )
}
