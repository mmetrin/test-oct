import { useRef } from 'react'
import { AmbientParticles } from '../enterprise-big-data'
import { AudienceConnector } from './AudienceConnector'
import { AudienceTechnologyGraphic } from './AudienceTechnologyGraphic'
import { useAudienceReveal } from './useAudienceReveal'
import network from '../../assets/figma/platform-audience/network.png'
import background from '../../assets/figma/platform-audience/background.png'
import backgroundMask from '../../assets/figma/platform-audience/background-mask.svg'
import audienceArc from '../../assets/figma/platform-audience/audience-arc.svg'
import audienceConnector from '../../assets/figma/platform-audience/audience-connector.svg'
import stableConnector from '../../assets/figma/platform-audience/stable-connector.svg'
import loopConnector from '../../assets/figma/platform-audience/loop-connector.svg'
import resultConnector from '../../assets/figma/platform-audience/result-connector.svg'
import telegram from '../../assets/figma/platform-audience/channel-telegram.svg'
import vk from '../../assets/figma/platform-audience/channel-vk.svg'
import avitoGreen from '../../assets/figma/platform-audience/avito-green.svg'
import avitoRed from '../../assets/figma/platform-audience/avito-red.svg'
import avitoPurple from '../../assets/figma/platform-audience/avito-purple.svg'
import avitoBlue from '../../assets/figma/platform-audience/avito-blue.svg'
import './PlatformAudienceSection.css'

function AudienceSphere({ blurred = false }) {
  return <div className={`platform-audience__hemisphere${blurred ? ' platform-audience__hemisphere--blurred' : ''}`} aria-hidden="true">
    <div className="platform-audience__sphere">
      <div className="platform-audience__gradient" />
      <div className="platform-audience__network platform-audience__network--lower"><img src={network} alt="" /></div>
      <div className="platform-audience__network platform-audience__network--upper"><img src={network} alt="" /></div>
    </div>
  </div>
}

function AudienceDataIllustration() {
  return <div className="platform-audience__data">
    <AudienceSphere />
    <AudienceSphere blurred />
    <div className="platform-audience__glass-shadow" aria-hidden="true" />
    <div className="platform-audience__glass">
      <ul className="platform-audience__sources">
        <li>Данные<br />партнёров</li>
        <li>Big Data МТС</li>
        <li>Ваша CRM</li>
      </ul>
    </div>
    <div className="platform-audience__arc"><img src={audienceArc} alt="" /></div>
    <div className="platform-audience__fact">
      <p className="platform-audience__number"><span className="platform-audience__digits">65<span className="platform-audience__number-space"> </span>+</span><span className="platform-audience__unit">млн</span></p>
      <p>активной аудитории и 5 000 параметров</p>
    </div>
  </div>
}

function AudienceChannels() {
  return <div className="platform-audience__channels">
    <img src={telegram} alt="Telegram" data-audience-channel="telegram" />
    <span className="platform-audience__vk" data-audience-channel="vk"><img src={vk} alt="VK Реклама" /></span>
    <span className="platform-audience__avito" role="img" aria-label="Avito" data-audience-channel="avito">
      <span className="platform-audience__avito-mark" aria-hidden="true">
        <img className="platform-audience__avito-green" src={avitoGreen} alt="" />
        <img className="platform-audience__avito-red" src={avitoRed} alt="" />
        <img className="platform-audience__avito-purple" src={avitoPurple} alt="" />
        <img className="platform-audience__avito-blue" src={avitoBlue} alt="" />
      </span>
    </span>
  </div>
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
          <AudienceConnector className="platform-audience__loop-line" src={loopConnector} width={476} height={262} trace="M0 20Q0 0.5 20 0.5H436A39.5 39.5 0 0 1 475.5 40V222A39.5 39.5 0 0 1 436 261.5H0" />
          <AudienceConnector className="platform-audience__result-line" src={resultConnector} width={184} height={212} trace="M0 20Q0 0.5 20 0.5H137A39.5 39.5 0 0 1 176.5 40V210">
            <path className="platform-audience__arrow-trace" d="M169 204.25L174.5 210.2Q176 212 177.5 210.2L183 204.25" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </AudienceConnector>
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
          <h3><span>Запуск на площадках</span></h3>
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
