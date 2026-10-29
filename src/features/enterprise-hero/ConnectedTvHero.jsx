import { EnterpriseHero } from './EnterpriseHero'
import connectedTvVideo from '../../assets/enterprise-hero/connected-tv-background.mp4'
import './ConnectedTvHero.css'

function ConnectedTvFacts() {
  return (
    <div className="enterprise-hero__facts" aria-label="Connected TV в цифрах">
      <div className="enterprise-hero__fact">
        <p className="enterprise-hero__number">63+ <span>млн</span></p>
        <p>зрителей онлайн-кинотеатров<br />и 46 млн в digital-TV</p>
      </div>
      <div className="enterprise-hero__fact">
        <p className="enterprise-hero__number">100%</p>
        <p>brand safety — безопасная<br />среда для продвижения</p>
      </div>
      <div className="enterprise-hero__fact">
        <p className="enterprise-hero__number"><span className="connected-tv-hero__number-prefix">от</span>85%</p>
        <p>досмотров рекламы — VTR<br />при 0% рекламного фрода</p>
      </div>
    </div>
  )
}

export function ConnectedTvHero() {
  return (
    <EnterpriseHero
      className="connected-tv-hero"
      leadershipOnly
      singleVideo
      loopVideo={false}
      videoSrc={connectedTvVideo}
      showVideoMetrics={false}
      showHeader={false}
      title="Connected TV — премиальный ТВ‑формат с digital‑таргетингом"
      description="Без скролла и конкурирующего контента. Показывайте рекламу нужной аудитории на большом экране через Smart TV, ТВ‑приставки, медиаплееры и игровые консоли"
      ctaLabel="Оставить заявку"
      ctaHref="#connected-tv-lead"
      facts={<ConnectedTvFacts />}
    />
  )
}
