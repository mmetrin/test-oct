import { useState } from 'react'
import { PlatformInterfaceSection } from './PlatformInterfaceSection'
import { PlatformFaqSection } from './PlatformFaqSection'
import { PlatformBudgetCalculator } from './PlatformBudgetCalculator'
import { platformChannels } from './platformChannels'
import brandsImage from '../../assets/figma/platform-sections/audience-brands-2x.png'
import agenciesImage from '../../assets/figma/platform-sections/audience-agencies-2x.png'
import platformsBackground from '../../assets/figma/platform-sections/platforms-background.png'
import connectionOffice from '../../assets/figma/platform-sections/connection-office@2x.webp'
import connectionGradient from '../../assets/figma/platform-sections/connection-gradient@2x.webp'
import connectionForm from '../../assets/figma/platform-sections/connection-form@2x.png'
import vkIcon from '../../assets/figma/platform-sections/publishers-vk.svg'
import telegramIcon from '../../assets/figma/platform-sections/publishers-telegram.svg'
import avitoIcon from '../../assets/figma/platform-sections/publishers-avito.svg'
import './PlatformCoreSections.css'

const audiences = [
  {
    id: 'brands', image: brandsImage,
    title: 'Брендам',
    description: <>Управление частотой на всех площадках помогает перераспределять бюджет в пользу нового охвата</>,
  },
  {
    id: 'agencies', image: agenciesImage,
    title: 'Агенствам',
    description: <>Запуск кампаний с дополнительным охватом Big Data МТС, автоматическими ставками и контролем частоты сокращает ручную работу и усиливает кампании</>,
  },
]

const platformIcons = { vk: vkIcon, telegram: telegramIcon, avito: avitoIcon }

export function PlatformCoreSections() {
  const [dialogHost, setDialogHost] = useState(null)
  return <div className="platform-sections" ref={setDialogHost}>
    <div className="platform-sections__canvas platform-sections__canvas--intro">
      <section className="platform-use-cases" id="who-it-is-for" aria-labelledby="platform-use-cases-title">
        <div className="platform-sections__heading">
          <h2 id="platform-use-cases-title">Кому подходит</h2>
          <p>Рекламодателям и агентствам, которые запускают рекламу сразу на нескольких площадках</p>
        </div>
        <div className="platform-use-cases__cards">
          {audiences.map(({ id, image, title, description }) => <article className="platform-use-cases__card" key={id}>
            <div className="platform-use-cases__copy"><h3>{title}</h3><p>{description}</p></div>
            <div className="platform-use-cases__image-wrap"><img className={`platform-use-cases__image platform-use-cases__image--${id}`} src={image} alt="" loading="lazy" decoding="async" /></div>
          </article>)}
        </div>
      </section>

      <section className="platform-publishers" id="platforms" aria-labelledby="platform-publishers-title">
        <img className="platform-publishers__background" src={platformsBackground} alt="" width="3838" height="1216" loading="lazy" decoding="async" />
        <div className="platform-sections__heading">
          <h2 id="platform-publishers-title">Все популярные форматы<br />ведущих площадок<br />в <span>одном</span> кабинете</h2>
        </div>
        <div className="platform-publishers__cards">
          {platformChannels.map(({ id, title, monthlyAudience }) => <article className="platform-publishers__card" key={id}>
            <div className="platform-publishers__brand"><img src={platformIcons[id]} alt="" width="40" height="40" loading="lazy" /><h3>{title}</h3></div>
            <p className="platform-publishers__audience">{(monthlyAudience / 1_000_000).toLocaleString('ru-RU')}{' '}<span>млн MAU</span></p>
          </article>)}
        </div>
        <a className="platform-sections__cta" href="#connection">Оставить заявку</a>
      </section>

    </div>
    <section className="platform-budget" id="budget" aria-labelledby="platform-budget-title">
      <div className="platform-sections__heading">
        <h2 id="platform-budget-title">Оценка охвата<br />и бюджета кампании</h2>
      </div>
      <PlatformBudgetCalculator dialogHost={dialogHost} />
    </section>

    <div className="platform-sections__canvas platform-sections__canvas--connection">
      <section className="platform-connection" id="connection" aria-labelledby="platform-connection-title">
        <h2 id="platform-connection-title" className="platform-sections__sr-only">Оставьте заявку на подключение</h2>
        <img className="platform-connection__office" src={connectionOffice} width="3840" height="2040" alt="" loading="lazy" decoding="async" />
        <img className="platform-connection__gradient" src={connectionGradient} width="3840" height="2849" alt="" loading="lazy" decoding="async" />
        <img className="platform-connection__form" src={connectionForm} width="1480" height="1384" alt="Форма заявки: телефон, рабочая почта, имя и фамилия, компания, рекламный бюджет в год" loading="lazy" decoding="async" />
      </section>

      <PlatformInterfaceSection />
      <PlatformFaqSection />
    </div>
  </div>
}
