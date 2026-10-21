import blick from '../../assets/figma/blick.png'
import blick2 from '../../assets/figma/blick-2.png'
import heroPoster from '../../assets/figma/hero-video.png'
import heroVideo from '../../assets/figma/hero-video.mp4'
import logo from '../../assets/figma/logo.svg'
import { typographText } from '../../shared/lib/typographText'
import { useHeroParallax } from './useHeroParallax'

export function HeroSection() {
  const sectionRef = useHeroParallax()

  return (
    <section ref={sectionRef} className="hero-section" aria-label="MTS Ads Premium Video">
      <video
        className="hero-section__visual reveal-item"
        src={heroVideo}
        poster={heroPoster}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <img className="hero-section__blick hero-section__blick--main reveal-item" src={blick} alt="" />
      <img className="hero-section__blick hero-section__blick--soft reveal-item" src={blick2} alt="" />

      <div className="page-container hero-section__content">
        <a
          className="hero-section__logo-link reveal-item"
          href={`${import.meta.env.BASE_URL}enterprise-hero/`}
          aria-label="МТС Ads — главная"
        >
          <img className="hero-section__logo" src={logo} alt="MTS Ads Premium Video" />
        </a>

        <div className="hero-section__copy reveal-group">
          <h1 className="hero-section__title">
            {typographText('Видеореклама на больших экранах — точное попадание в вашу аудиторию')}
          </h1>
          <p className="hero-section__lead">
            {typographText('Эксклюзивное размещение в онлайн-кинотеатрах')}
            <br />
            {typographText('и на тематическом ТВ. Поможем найти клиентов по всей России')}
          </p>
          <a className="premium-video-button hero-section__button" href="#lead-form">
            Обсудить кампанию
          </a>
        </div>
      </div>
    </section>
  )
}
