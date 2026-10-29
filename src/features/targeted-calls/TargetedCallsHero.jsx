import { EnterpriseHero } from '../enterprise-hero/EnterpriseHero'
import background from '../../assets/figma/targeted-calls/hero-imgImage2090007933.png'
import operator from '../../assets/figma/targeted-calls/hero-imgRectangle240662691.png'
import operatorOverlay from '../../assets/figma/targeted-calls/hero-imgRectangle240662693.png'

function CallsBackground() {
  return <div className="calls-hero__background">
    <img className="calls-hero__office" src={background} alt="" width="1920" height="871" fetchPriority="high" />
    <img className="calls-hero__operator" src={operator} alt="" width="607" height="592" />
    <img className="calls-hero__operator calls-hero__operator--overlay" src={operatorOverlay} alt="" width="607" height="592" />
  </div>
}

function CallsFacts() {
  return <div className="enterprise-hero__facts" aria-label="Таргетированный обзвон в цифрах">
    <div className="enterprise-hero__fact"><p className="enterprise-hero__number">65+ <span>млн</span></p><p>абонентов — потенциальная<br />аудитория для привлечения</p></div>
    <div className="enterprise-hero__fact"><p className="enterprise-hero__number">200+</p><p>готовых сегментов — от соцдема<br />до поведенческих триггеров</p></div>
    <div className="enterprise-hero__fact"><p className="enterprise-hero__number"><span>до </span>10</p><p>номеров с разными<br />офферами в одной кампании</p></div>
  </div>
}

export function TargetedCallsHero() {
  return <EnterpriseHero className="calls-hero" leadershipOnly singleVideo showHeader={false} showVideoMetrics={false}
    background={<CallsBackground />}
    title="Таргетированный обзвон по сегментам МТС"
    description="Аудитория формируется автоматически на основе Big Data МТС — вы выбираете сегменты и запускаете обзвон в личном кабинете"
    ctaLabel="Оставить заявку" ctaHref="#calls-lead" facts={<CallsFacts />} />
}
