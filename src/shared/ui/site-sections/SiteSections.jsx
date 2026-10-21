import platformsImage from '../../../assets/figma/shared/platforms.png'
import footerImage from '../../../assets/figma/shared/footer.png'
import './SiteSections.css'

export function SitePlatforms({ className = '', id }) {
  return (
    <section className={`site-platforms ${className}`} id={id} aria-label="Платформы МТС Ads">
      <img src={platformsImage} alt="Платформы МТС Ads" width="1440" height="876" loading="lazy" draggable={false} />
    </section>
  )
}

export function SiteFooter({ className = '', id }) {
  return (
    <footer className={`site-footer ${className}`} id={id}>
      <img src={footerImage} alt="МТС Маркетолог 2.0 и МТС Ads. Рекламные инструменты, документы и контакты." width="1960" height="602" loading="lazy" draggable={false} />
    </footer>
  )
}
