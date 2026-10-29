import platformsImage from '../../../assets/figma/shared/platforms.png'
import footerImage from '../../../assets/figma/shared/footer.png'
import './SiteSections.css'

export function SitePlatforms({ className = '', id, image = platformsImage, imageHeight = 876 }) {
  return (
    <section className={`site-platforms ${className}`} id={id} aria-label="Платформы МТС Ads">
      <img src={image} alt="Платформы МТС Ads" width="1440" height={imageHeight} loading="lazy" draggable={false} />
    </section>
  )
}

export function SiteFooter({ className = '', id }) {
  return (
    <footer className={`site-footer ${className}`} id={id}>
      <img src={footerImage} alt="МТС ADS. Рекламные инструменты, документы и контакты." width="1960" height="602" loading="lazy" draggable={false} />
      <a className="site-footer__media-link" href={`${import.meta.env.BASE_URL}media/`} aria-label="Медиа МТС ADS: кейсы, новости" />
      <a className="site-footer__contacts-link" href={`${import.meta.env.BASE_URL}contacts/`} aria-label="Контакты" />
      <a className="site-footer__calls-link" href={`${import.meta.env.BASE_URL}targeted-calls/`} aria-label="Таргетированный обзвон" />
    </footer>
  )
}
