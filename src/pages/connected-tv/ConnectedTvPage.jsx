import { ConnectedTvHero } from '../../features/enterprise-hero/ConnectedTvHero'
import { ConnectedTvAudience } from '../../features/connected-tv-audience/ConnectedTvAudience'
import { ConnectedTvFormats } from '../../features/connected-tv-formats/ConnectedTvFormats'
import { SiteHeader } from '../../shared/ui/site-header'
import { SiteFooter } from '../../shared/ui/site-sections'
import placements from '../../assets/figma/connected-tv/placements@2x.png'
import targeting from '../../assets/figma/connected-tv/targeting@2x.png'
import lead from '../../assets/figma/connected-tv/lead@2x.png'
import '../enterprise-hero/EnterpriseFigmaVariables.css'
import '../enterprise-hero/EnterpriseHeroPage.css'
import './ConnectedTvPage.css'

export function ConnectedTvPage() {
  return (
    <main className="enterprise-hero-page connected-tv-page">
      <SiteHeader homeNavigation actionHref="#connected-tv-lead" />
      <ConnectedTvHero />
      <section className="connected-tv-placements" aria-label="Две среды для размещения рекламы — вас увидят">
        <img src={placements} width="1920" height="795" loading="lazy" alt="Онлайн-кинотеатры: фильмы, сериалы и другой контент популярных видеосервисов. Онлайн-ТВ: трансляция телеканалов через интернет." />
        <a className="connected-tv-raster-link connected-tv-placements__cta" href="#connected-tv-lead" aria-label="Оставить заявку" />
      </section>
      <ConnectedTvAudience />
      <ConnectedTvAudience id="ctv-audience-redesign" variant="sculpted" />
      <ConnectedTvFormats />
      <section className="connected-tv-targeting" aria-labelledby="connected-tv-targeting-title">
        <h2 id="connected-tv-targeting-title">Настраивайте показы<br />на <span>целевого</span> зрителя</h2>
        <img src={targeting} width="1917.5" height="960" loading="lazy" alt="Настройка показов по интересам и поведению: каналы, жанры и типы контента. По параметрам аудитории: география, пол, возраст, доход и наличие детей. По техническим параметрам: диагональ экрана и частота показов." />
        <a className="connected-tv-raster-link connected-tv-targeting__cta" href="#connected-tv-lead" aria-label="Запустить рекламу" />
      </section>
      <section className="connected-tv-lead" id="connected-tv-lead" aria-label="Запустите рекламу с МТС ADS">
        <img src={lead} width="1920" height="2008" loading="lazy" alt="Запустите рекламу с МТС ADS. Форма заявки: телефон, почта, имя и фамилия, сфера бизнеса, рекламный бюджет." />
      </section>
      <SiteFooter />
    </main>
  )
}
