import registrationVideo from '../../assets/figma/smb/step-register.mp4'
import registrationPoster from '../../assets/figma/smb/step-video-poster.png'
import campaignIllustration from '../../assets/figma/smb/step-campaign.png'
import clientsIllustration from '../../assets/figma/smb/step-clients.png'
import './SmallBusinessSteps.css'

export function SmallBusinessSteps() {
  return (
    <section className="small-business-steps" aria-labelledby="small-business-steps-title">
      <h2 id="small-business-steps-title">Три простых шага до результата</h2>
      <div className="small-business-steps__cards">
        <article className="small-business-steps__card small-business-steps__card--video">
          <video
            className="small-business-steps__video"
            src={registrationVideo}
            poster={registrationPoster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="Анимация регистрации на платформе"
          />
          <h3>Зарегистрируйтесь<br />на платформе</h3>
        </article>
        <article className="small-business-steps__card">
          <h3>Создайте кампанию<br />за 5 минут</h3>
          <img src={campaignIllustration} alt="Пример запроса к ИИ-маркетологу" width="395" height="120" loading="lazy" />
        </article>
        <article className="small-business-steps__card">
          <h3>Получайте<br />новых клиентов</h3>
          <img src={clientsIllustration} alt="Пример результатов рекламной кампании" width="395" height="120" loading="lazy" />
        </article>
      </div>
      <a className="small-business-steps__button" href="https://marketolog.mts.ru/">Зарегистрироваться</a>
    </section>
  )
}
