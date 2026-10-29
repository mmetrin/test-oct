import whiteSolutions from '../../assets/figma/enterprise-content/white-solutions@2x.png'
import { EnterpriseLead } from './EnterpriseLead'
import { SiteCases, SiteFooter, SitePlatforms } from '../../shared/ui/site-sections'
import './EnterpriseContentSection.css'

export function EnterpriseContentSection() {
  return (
    <div className="enterprise-content" id="enterprise-content">
      <section className="enterprise-content__solutions" aria-label="Используем белые решения">
        <img src={whiteSolutions} alt="Используем белые решения. Размещаем рекламу на проверенных сайтах. Свой ОРД Медиаскаут. Эксклюзивный инвентарь." width="1440" height="547" loading="eager" />
      </section>

      <EnterpriseLead />

      <SiteCases />
      <SitePlatforms />
      <SiteFooter />
    </div>
  )
}
