import leadForm from '../../assets/figma/enterprise-content/lead-form@2x.png'
import './EnterpriseContentSection.css'

export function EnterpriseLead() {
  return (
    <section className="enterprise-content__lead" aria-label="Запустите рекламу с МТС ADS">
      <img src={leadForm} alt="Запустите рекламу с МТС ADS. Макет формы заявки на рекламную кампанию." width="1920" height="2028" loading="lazy" />
    </section>
  )
}
