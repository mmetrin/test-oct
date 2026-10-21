import { useEffect, useRef, useState } from 'react'

import hoursLine from '../../assets/figma/contacts/hours-line.svg'
import { SiteHeader } from '../../shared/ui/site-header'
import { SiteFooter } from '../../shared/ui/site-sections'
import './ContactsPage.css'

const address = 'Москва, Проектируемый проезд № 4062, 6, строение 16'
const markerCoordinates = '37.660548%2C55.693511%2Cpm2rdm'
const mapUrls = {
  wide: `https://yandex.ru/map-widget/v1/?ll=37.65655%2C55.69243&z=16&pt=${markerCoordinates}`,
  medium: `https://yandex.ru/map-widget/v1/?ll=37.65695%2C55.69395&z=16&pt=${markerCoordinates}`,
  tablet: `https://yandex.ru/map-widget/v1/?ll=37.66094%2C55.69493&z=16&pt=${markerCoordinates}`,
  mobile: `https://yandex.ru/map-widget/v1/?ll=37.65990%2C55.69675&z=16&pt=${markerCoordinates}`,
}
const placeUrl = `https://yandex.ru/maps/213/moscow/house/proyektiruyemy_proyezd_4062_6s16/Z04YcAFgTEEPQFtvfXp4cnliZA%3D%3D/`

const contactEmails = [
  { label: 'Рекламодателям', email: 'sales.ads@mts.ru' },
  { label: 'Паблишерам', email: 'publishers.ads@mts.ru' },
  { label: 'Общие вопросы', email: 'info@stream.ru' },
]

function ContactDetail({ label, children, href }) {
  return (
    <div className="contacts-detail">
      <span className="contacts-detail__label">{label}</span>
      {href ? <a href={href} className="contacts-detail__value contacts-detail__value--link">{children}</a> : <span className="contacts-detail__value">{children}</span>}
    </div>
  )
}

export function ContactsPage() {
  const mapSize = 'wide'
  const [readyMapSize, setReadyMapSize] = useState(null)
  const mapRevealTimer = useRef(null)

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Контакты — МТС Ads'
    return () => {
      document.title = previousTitle
    }
  }, [])

  useEffect(() => () => window.clearTimeout(mapRevealTimer.current), [mapSize])

  const handleMapLoad = () => {
    window.clearTimeout(mapRevealTimer.current)
    mapRevealTimer.current = window.setTimeout(() => setReadyMapSize(mapSize), 500)
  }

  const mapReady = readyMapSize === mapSize

  return (
    <div className="contacts-page">
      <SiteHeader contactMode />
      <main>
        <div className="contacts-page__intro"><h1>Контакты</h1></div>
        <section className="contacts-page__map-section" data-map-ready={mapReady} aria-label="Расположение офиса МТС Ads">
          <iframe key={mapSize} className="contacts-page__map" src={mapUrls[mapSize]} title={`Яндекс Карта: ${address}`} loading="eager" onLoad={handleMapLoad} allowFullScreen />
          <a className="contacts-page__place-label" href={placeUrl} target="_blank" rel="noreferrer" aria-label="Порт Плаза — открыть в Яндекс Картах">
            <span className="contacts-page__place-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M4 8h16v11H4V8Zm0 4c2.3 1.3 5 2 8 2s5.7-.7 8-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            <span><strong>Порт Плаза</strong><small>Бизнес-центр</small></span>
          </a>
          <div className="contacts-page__cards">
            <div className="contacts-card contacts-card--main">
              <p className="contacts-card__heading">По вопросам сотрудничества и заказу рекламы</p>
              <div className="contacts-card__columns">
                <div className="contacts-card__emails">
                  {contactEmails.map(({ label, email }) => <ContactDetail key={email} label={label} href={`mailto:${email}`}>{email}</ContactDetail>)}
                </div>
                <div className="contacts-card__office">
                  <ContactDetail label="Офис" href="tel:+74994290591">+7 (499) 429-05-91</ContactDetail>
                  <div className="contacts-detail">
                    <span className="contacts-detail__label">понедельник – пятница</span>
                    <span className="contacts-detail__value contacts-detail__hours"><span>10:00</span><img className="contacts-detail__rule" src={hoursLine} alt="" width="95" height="1" /><span>19:00</span></span>
                  </div>
                  <ContactDetail label="Бизнес-центр PortPlaza"><a className="contacts-detail__address" href={placeUrl} target="_blank" rel="noreferrer">Москва, Проектируемый проезд № 4062, 6, строение 16, 115432</a></ContactDetail>
                </div>
              </div>
            </div>
            <div className="contacts-card contacts-card--marketolog">
              <p className="contacts-card__heading">По вопросам инструментов МТС Маркетолог</p>
              <ContactDetail label="Бесплатная консультация" href="tel:88002501111">8 800 250 11-11</ContactDetail>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter className="contacts-footer" />
    </div>
  )
}
