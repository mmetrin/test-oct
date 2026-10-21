import clatchSymbol from '../../assets/figma/white-solutions/clatch-symbol.svg'
import clatchLogo from '../../assets/figma/white-solutions/clatch.svg'
import kionLogo from '../../assets/figma/white-solutions/kion.svg'
import lightLineBottom from '../../assets/figma/white-solutions/light-line-bottom.svg'
import lightLineTop from '../../assets/figma/white-solutions/light-line-top.svg'
import lightLineVertical from '../../assets/figma/white-solutions/light-line-vertical.svg'
import mtsLogo from '../../assets/figma/white-solutions/mts-logo.svg'
import mtsMusicLogo from '../../assets/figma/white-solutions/mts-music.svg'
import ostrovokLogo from '../../assets/figma/white-solutions/ostrovok.svg'
import premiumInventoryImage from '../../assets/figma/white-solutions/premium-inventory.png'
import tonkostiLogo from '../../assets/figma/white-solutions/tonkosti.svg'
import './WhiteSolutionsSection.css'

export function WhiteSolutionsSection({ className = '' }) {
  return (
    <section className={`white-solutions-section ${className}`.trim()} aria-labelledby="white-solutions-title">
      <h2 id="white-solutions-title"><span>Используем</span> белые решения</h2>

      <div className="white-solutions-section__content">
        <div className="white-solutions-section__benefits">
          <article className="white-solutions-section__benefit">
            <h3>Свой ОРД</h3>
            <p>Сами зарегистрируем вашу рекламу в ЕРИР</p>
          </article>
          <img className="white-solutions-section__benefits-divider" src={lightLineTop} alt="" />
          <article className="white-solutions-section__benefit">
            <h3>Удобные рекламные интерфейсы</h3>
            <p><span>Автоматическое создание объявлений, </span>перераспределение бюджетов и ещё преимущества</p>
          </article>
        </div>

        <article className="white-solutions-section__premium-card">
          <img className="white-solutions-section__premium-background" src={premiumInventoryImage} alt="" />
          <img className="white-solutions-section__premium-divider" src={lightLineVertical} alt="" />
          <div className="white-solutions-section__premium-copy">
            <h3>Премиальный инвентарь</h3>
            <p>Площадки экосистемы МТС, онлайн-кинотеатры, ритейл-медиа</p>
          </div>

          <div className="white-solutions-section__logos" aria-label="Партнёрские площадки">
            <div className="white-solutions-section__logo-row">
              <div className="white-solutions-section__logo white-solutions-section__logo--media">
                <img src={mtsLogo} alt="МТС" />
                <span>МЕДИА</span>
              </div>
              <img className="white-solutions-section__logo white-solutions-section__logo--tonkosti" src={tonkostiLogo} alt="Тонкости туризма" />
              <img className="white-solutions-section__logo white-solutions-section__logo--kion" src={kionLogo} alt="KION" />
            </div>
            <img className="white-solutions-section__logos-divider" src={lightLineBottom} alt="" />
            <div className="white-solutions-section__logo-row">
              <img className="white-solutions-section__logo white-solutions-section__logo--music" src={mtsMusicLogo} alt="МТС Музыка" />
              <span className="white-solutions-section__logo white-solutions-section__logo--clatch" aria-label="Clatch">
                <img src={clatchSymbol} alt="" />
                <img src={clatchLogo} alt="" />
              </span>
              <img className="white-solutions-section__logo white-solutions-section__logo--ostrovok" src={ostrovokLogo} alt="Островок" />
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
