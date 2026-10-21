import vkusnoImage from '../../assets/figma/hero-cards-design/vkusno-image-2x.png'
import vkusnoLogo from '../../assets/figma/hero-cards-design/vkusno-logo.svg'
import telegramIcon from '../../assets/figma/hero-cards-design/vkusno-telegram-icon.svg'

export function VkusnoCaseArtwork() {
  return (
    <span className="case-design-artwork vkusno-case-artwork" aria-hidden="true">
      <img className="case-design-artwork__image" src={vkusnoImage} alt="" draggable="false" />
      <span className="vkusno-case-artwork__logo"><img src={vkusnoLogo} alt="" /></span>
      <span className="case-design-artwork__badge vkusno-case-artwork__badge">
        <img src={telegramIcon} alt="" />
        <span>Telegram Ads</span>
      </span>
      <span className="case-design-artwork__metrics vkusno-case-artwork__metrics">
        <span className="case-design-artwork__metric">
          <strong>+95% CR</strong>
          <span>конверсия объявления</span>
        </span>
        <span className="case-design-artwork__metric">
          <strong>−35%</strong>
          <span>бюджета</span>
        </span>
      </span>
    </span>
  )
}
