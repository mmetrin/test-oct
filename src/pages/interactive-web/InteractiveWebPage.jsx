import { useRef } from 'react'
import peopleShadows from '../../assets/cursor-grid/people-shadows.png'
import diksiLogo from '../../assets/interactive-web/logos/diksi.svg'
import khlLogo from '../../assets/interactive-web/logos/khl.svg'
import magnitLogo from '../../assets/interactive-web/logos/magnit.svg'
import mvideoLogo from '../../assets/interactive-web/logos/mvideo.svg'
import ofdLogo from '../../assets/interactive-web/logos/ofd.svg'
import x5Logo from '../../assets/interactive-web/logos/x5.svg'
import { InteractiveWebCanvas } from '../../features/interactive-web'
import { SiteHeader } from '../../shared/ui/site-header'
import './InteractiveWebPage.css'

const logos = {
  left: [
    { src: magnitLogo, alt: 'Магнит' },
    { src: diksiLogo, alt: 'Дикси' },
    { src: khlLogo, alt: 'КХЛ' },
  ],
  right: [
    { src: mvideoLogo, alt: 'М.Видео' },
    { src: x5Logo, alt: 'X5' },
    { src: ofdLogo, alt: 'ОФД' },
  ],
}

export function InteractiveWebPage() {
  const photoRef = useRef(null)

  return (
    <>
    <SiteHeader />
    <main className="interactive-web-page" id="top">
      <div className="interactive-web-page__effect" aria-hidden="true">
        <InteractiveWebCanvas staticAreaRef={photoRef} />
      </div>

      <div className="interactive-web-page__layout">
        <h1 className="interactive-web-page__title">
          <span>Анализируем больше данных —</span>
          <strong>точнее находим ваших клиентов</strong>
        </h1>

        <div className="interactive-web-page__visual">
          <div className="interactive-web-page__logos interactive-web-page__logos--left">
            {logos.left.map(({ src, alt }) => (
              <img key={alt} src={src} alt={alt} draggable={false} />
            ))}
          </div>
          <img
            className="interactive-web-page__people"
            ref={photoRef}
            src={peopleShadows}
            alt="Люди идут по диагонали, отбрасывая длинные голубые тени"
            draggable={false}
          />
          <div className="interactive-web-page__logos interactive-web-page__logos--right">
            {logos.right.map(({ src, alt }) => (
              <img key={alt} src={src} alt={alt} draggable={false} />
            ))}
          </div>
        </div>

        <div className="interactive-web-page__captions">
          <p>Подберём точную аудиторию среди&nbsp;65+&nbsp;млн абонентов МТС на&nbsp;основе их интересов, геоданных, интернет-поведения и звонков</p>
          <p>Обогащаем выборку данными партнёров — знаем детали о&nbsp;реальных покупках товаров вашей категории или бренда</p>
        </div>
      </div>
    </main>
    </>
  )
}
