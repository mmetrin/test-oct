import whiteSolutions from '../../assets/figma/enterprise-content/white-solutions@2x.png'
import leadForm from '../../assets/figma/enterprise-content/lead-form@2x.png'
import { SiteCases, SiteFooter, SitePlatforms } from '../../shared/ui/site-sections'
import './EnterpriseContentSection.css'

export function EnterpriseContentSection() {
  return (
    <div className="enterprise-content" id="enterprise-content">
      <section className="enterprise-content__solutions" aria-label="Используем белые решения">
        <img src={whiteSolutions} alt="Используем белые решения. Размещаем рекламу на проверенных сайтах. Свой ОРД Медиаскаут. Эксклюзивный инвентарь." width="1440" height="547" loading="eager" />
      </section>

      <section className="enterprise-content__lead" aria-label="Запустите рекламу с МТС ADS">
        <img src={leadForm} alt="Запустите рекламу с МТС ADS. Макет формы заявки на рекламную кампанию." width="1920" height="2028" loading="lazy" />
      </section>

      <SiteCases />
      <SitePlatforms />
      <SiteFooter />
    </div>
  )
}
