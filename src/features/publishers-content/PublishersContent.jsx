import heroImage from '../../assets/figma/publishers/hero-image.png'
import partnerForm from '../../assets/figma/publishers/partner-form.png'
import integration from '../../assets/figma/publishers/integration.png'
import maskGroup from '../../assets/figma/publishers/mask-group-overlay@2x.png'
import { SiteCases, SiteFooter, SitePlatforms } from '../../shared/ui/site-sections'
import { PublishersFormats } from './PublishersFormats'
import './PublishersContent.css'

export function PublishersContent() {
  return (
    <div className="publishers-content" id="publishers-content">
      <section className="publishers-content__hero" aria-label="Монетизация трафика на ваших площадках">
        <img className="publishers-content__hero-image" src={heroImage} alt="Монетизация трафика на ваших площадках. 90 млн уникальных пользователей в месяц, популярные форматы и поддержка партнёров." width="1440" height="848" draggable={false} />
        <a className="publishers-content__hero-cta" href="#publishers-partner">Стать партнёром Buzzoola</a>
      </section>
      <section className="publishers-content__partner" id="publishers-partner" aria-label="Стать партнёром Buzzoola">
        <img src={partnerForm} alt="Стать партнёром Buzzoola. Макет формы подключения." width="1920" height="970" loading="lazy" draggable={false} />
      </section>
      <img className="publishers-content__mask" src={maskGroup} alt="" aria-hidden="true" width="1920" height="2200" loading="lazy" draggable={false} />
      <PublishersFormats />
      <section className="publishers-content__integration" aria-label="Методы интеграции">
        <img src={integration} alt="Методы интеграции: JavaScript, VAST / VPAID, Header Bidding, In-App SDK и OpenRTB." width="1440" height="876" loading="lazy" draggable={false} />
      </section>
      <SiteCases className="publishers-content__cases" />
      <SitePlatforms className="publishers-content__platforms" />
      <SiteFooter className="publishers-content__footer" />
    </div>
  )
}
