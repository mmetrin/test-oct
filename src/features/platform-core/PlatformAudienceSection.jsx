import { useRef } from 'react'
import { AmbientParticles } from '../enterprise-big-data'
import { AudienceConnector } from './AudienceConnector'
import { AudienceTechnologyGraphic } from './AudienceTechnologyGraphic'
import { useAudienceReveal } from './useAudienceReveal'
import khl from '../../assets/enterprise-big-data/khl.svg'
import dixy from '../../assets/enterprise-big-data/diksi.svg'
import magnit from '../../assets/enterprise-big-data/magnit.svg'
import mvideo from '../../assets/enterprise-big-data/mvideo.svg'
import x5 from '../../assets/enterprise-big-data/x5.svg'
import ofd from '../../assets/enterprise-big-data/ofd.svg'
import background from '../../assets/figma/platform-audience/background.png'
import backgroundMask from '../../assets/figma/platform-audience/background-mask.svg'
import audienceArc from '../../assets/figma/platform-audience/audience-arc-ellipse.svg'
import audienceConnector from '../../assets/figma/platform-audience/audience-connector.svg'
import stableConnector from '../../assets/figma/platform-audience/stable-connector.svg'
import loopConnector from '../../assets/figma/platform-audience/loop-connector.svg'
import resultConnector from '../../assets/figma/platform-audience/result-connector.svg'
import channels from '../../assets/figma/platform-audience/channels.svg'
import lineeeCircle from '../../assets/figma/platform-audience/lineee-plus-circle.svg'
import lineeePlus from '../../assets/figma/platform-audience/lineee-plus.svg'
import lineeeStroke from '../../assets/figma/platform-audience/lineee-stroke.svg'
import './PlatformAudienceSection.css'

function AudienceSphere() {
  return <div className="platform-audience__hemisphere" aria-hidden="true">
    <div className="platform-audience__sphere">
      <div className="platform-audience__gradient" />
      <div className="platform-audience__sphere-motion"><AmbientParticles variant="sphere" /></div>
    </div>
  </div>
}

function AudienceDataIllustration() {
  return <div className="platform-audience__data">
    <AudienceSphere />
    <p className="platform-audience__crm">Ваша CRM</p>
    <p className="platform-audience__partners-label">Данные партнёров</p>
    <div className="platform-audience__partner-logos" aria-hidden="true">
      <span className="platform-audience__partner-logo--khl" style={{ maskImage: `url("${khl}")` }} />
      <span className="platform-audience__partner-logo--dixy" style={{ maskImage: `url("${dixy}")` }} />
      <span className="platform-audience__partner-logo--magnit" style={{ maskImage: `url("${magnit}")` }} />
      <span className="platform-audience__partner-logo--mvideo" style={{ maskImage: `url("${mvideo}")` }} />
      <span className="platform-audience__partner-logo--x5" style={{ maskImage: `url("${x5}")` }} />
      <span className="platform-audience__partner-logo--ofd" style={{ maskImage: `url("${ofd}")` }} />
    </div>
    <div className="platform-audience__arc"><img src={audienceArc} alt="" /></div>
    <div className="platform-audience__fact">
      <h3>Big Data МТС</h3>
      <p className="platform-audience__number"><span className="platform-audience__digits">65<span className="platform-audience__number-space"> </span>+</span><span className="platform-audience__unit">млн</span></p>
      <p>активной аудитории</p>
    </div>
  </div>
}

function AudienceChannels() {
  return <img className="platform-audience__channels" src={channels} width="152" height="56" alt="Telegram Ads, VK Реклама и Авито" />
}

export function PlatformAudienceSection() {
  const sectionRef = useRef(null)
  const ambientMotionRef = useRef(false)
  useAudienceReveal(sectionRef, ambientMotionRef)

  return <section ref={sectionRef} className="platform-audience" id="how-it-works" aria-labelledby="platform-audience-title">
    <div className="platform-audience__layout">
      <div className="platform-audience__backdrop" aria-hidden="true">
        <div className="platform-audience__background" style={{ maskImage: `url("${backgroundMask}")` }}><div><img src={background} alt="" /></div></div>
      </div>
      <header className="platform-audience__intro">
        <h2 id="platform-audience-title">Единая система, которая<br />находит <span className="platform-audience__title-accent">целевую аудиторию</span></h2>
      </header>
      <AudienceDataIllustration />
      <div className="platform-audience__flow">
        <div className="platform-audience__connectors" aria-hidden="true">
          <AudienceConnector className="platform-audience__input-line" src={audienceConnector} width={102} height={16} trace="M16 7.5H102">
            <circle className="platform-audience__line-marker" cx="8" cy="8" r="8" fill="white" />
          </AudienceConnector>
          <AudienceConnector className="platform-audience__stable-line" src={stableConnector} width={253} height={1} trace="M0 0.5H253" />
          <AudienceConnector className="platform-audience__loop-line" src={loopConnector} width={476} height={262} trace="M0 20Q0 0.5 20 0.5H436A39.5 39.5 0 0 1 475.5 40V222A39.5 39.5 0 0 1 436 261.5H78" />
          <AudienceConnector className="platform-audience__result-line" src={resultConnector} width={184} height={212} trace="M0 20Q0 0.5 20 0.5H137A39.5 39.5 0 0 1 176.5 40V210">
            <path className="platform-audience__arrow-trace" d="M169 204.25L174.5 210.2Q176 212 177.5 210.2L183 204.25" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </AudienceConnector>
          <div className="platform-audience__lineee">
            <span className="platform-audience__lineee-marker"><img src={lineeeCircle} alt="" /><img src={lineeePlus} alt="" /></span>
            <img src={lineeeStroke} alt="" />
          </div>
        </div>
        <div className="platform-audience__technologies">
          <article className="platform-audience__technology" data-audience-stage="stable">
            <h3><span>Stable ID</span></h3>
            <p>Связываем данные об одном человеке из разных источников в единый профиль</p>
            <AudienceTechnologyGraphic variant="stable" />
          </article>
          <article className="platform-audience__technology" data-audience-stage="smart">
            <h3><span>Smart Target</span></h3>
            <p>ML-модель подбирает креатив для каждого сегмента с учётом вероятности клика</p>
            <AudienceTechnologyGraphic variant="smart" />
          </article>
        </div>
        <div className="platform-audience__launch">
          <h3><span>Запуск на всех площадках</span></h3>
          <AudienceChannels />
        </div>
        <div className="platform-audience__optimization">
          <h3>Повышение эффективности после запуска</h3>
          <p>Пока идёт реклама, RecSys и Bidder автоматически повышают её эффективность — меняют ставки, корректируют сегменты и направляют бюджет на объявления с лучшим откликом</p>
        </div>
      </div>
      <div className="platform-audience__result">
        <AmbientParticles variant="banner" motionActiveRef={ambientMotionRef} />
        <p className="platform-audience__result-copy"><span>Результат:</span> <strong>Ваша целевая аудитория по оптимальной цене</strong></p>
      </div>
    </div>
  </section>
}
