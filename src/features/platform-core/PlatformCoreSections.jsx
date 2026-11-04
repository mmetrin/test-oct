import { PlatformInterfaceSection } from './PlatformInterfaceSection'
import { PlatformFaqSection } from './PlatformFaqSection'
import brandsImage from '../../assets/figma/platform-sections/audience-brands.png'
import agenciesImage from '../../assets/figma/platform-sections/audience-agencies.png'
import platformsBackground from '../../assets/figma/platform-sections/platforms-background.png'
import connectionComposition from '../../assets/figma/platform-sections/connection-composition.png'
import vkIcon from '../../assets/figma/platform-audience/channel-vk.svg'
import telegramIcon from '../../assets/figma/platform-audience/channel-telegram.svg'
import avitoIcon from '../../assets/figma/platform-sections/platforms-avito.png'
import './PlatformCoreSections.css'

const audiences = [
  {
    id: 'brands', image: brandsImage,
    title: 'Брендам: бюджет — в новый охват',
    description: <>Управляйте частотой на трёх площадках, чтобы деньги шли на новых людей, а не на десятый показ тем же</>,
  },
  {
    id: 'agencies', image: agenciesImage,
    title: 'Агентствам: медиаплан проще защитить',
    description: <>Мультиплатформенная кампания из одного кабинета и данные<br />МТС как аргумент для клиента. Кабинет агентства — с ролями для команды</>,
  },
]

const platforms = [
  { name: 'VK Реклама', icon: vkIcon, audience: '95,6 млн MAU' },
  { name: 'Telegram Ads', icon: telegramIcon, audience: '75,7 млн MAU' },
  { name: 'Avito Реклама', icon: avitoIcon, audience: '63 млн MAU' },
]

export function PlatformCoreSections() {
  return <div className="platform-sections">
    <div className="platform-sections__canvas">
      <section className="platform-use-cases" id="who-it-is-for" aria-labelledby="platform-use-cases-title">
        <div className="platform-sections__heading">
          <h2 id="platform-use-cases-title">Для тех, кто считает охват в людях</h2>
          <p>Рекламодателям и агентствам, которые запускают рекламу сразу на нескольких площадках</p>
        </div>
        <div className="platform-use-cases__cards">
          {audiences.map(({ id, image, title, description }) => <article className="platform-use-cases__card" key={id}>
            <img className="platform-use-cases__image" src={image} width="475" height="170" alt="" loading="lazy" decoding="async" />
            <div className="platform-use-cases__copy"><h3>{title}</h3><p>{description}</p></div>
          </article>)}
        </div>
      </section>

      <section className="platform-publishers" id="platforms" aria-labelledby="platform-publishers-title">
        <img className="platform-publishers__background" src={platformsBackground} alt="" width="1919" height="616.5" loading="lazy" decoding="async" />
        <div className="platform-sections__heading">
          <h2 id="platform-publishers-title">Крупнейшие площадки —<br />в <span>одном</span> кабинете</h2>
          <p>Нативные форматы площадок-партнёров</p>
        </div>
        <div className="platform-publishers__cards">
          {platforms.map(({ name, icon, audience }) => <article className="platform-publishers__card" key={name}>
            <div className="platform-publishers__brand"><img src={icon} alt="" width="44" height="44" loading="lazy" /><h3>{name}</h3></div>
            <p>{audience}</p>
          </article>)}
        </div>
        <a className="platform-sections__cta" href="#connection">Оставить заявку</a>
      </section>

      <section className="platform-budget" id="budget" aria-labelledby="platform-budget-title">
        <div className="platform-sections__heading">
          <h2 id="platform-budget-title">Оценка охвата<br />и бюджета кампании</h2>
          <p>Подберите аудиторию, чтобы получить предварительную оценку кампании</p>
        </div>
        {/* The calculator is intentionally a visual placeholder at this stage. */}
        <div className="platform-budget__placeholder" aria-hidden="true" />
      </section>

      <section className="platform-connection" id="connection" aria-labelledby="platform-connection-title">
        <h2 id="platform-connection-title" className="platform-sections__sr-only">Оставьте заявку на подключение</h2>
        {/* The complete form is a Figma image, as requested, until integration. */}
        <img className="platform-connection__composition" src={connectionComposition} width="1920" height="1546" alt="Форма заявки: телефон, рабочая почта, имя и фамилия, компания, рекламный бюджет в год" loading="lazy" decoding="async" />
      </section>

      <PlatformInterfaceSection />
      <PlatformFaqSection />
    </div>
  </div>
}
