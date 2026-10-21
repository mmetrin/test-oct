import richImage from '../../assets/figma/main-enterprises/case-source-2.png'
import metroImage from '../../assets/figma/main-enterprises/case-source-4.png'
import baikalImage from '../../assets/figma/main-enterprises/case-source-5.png'
import uvelkaImage from '../../assets/figma/main-enterprises/case-source-6.png'
import beautyImage from '../../assets/figma/main-enterprises/case-mini-1.png'
import clothesImage from '../../assets/figma/main-enterprises/case-mini-2.png'
import richLogo from '../../assets/figma/main-enterprises/case-rich-logo.svg'
import uvelkaLogo from '../../assets/figma/main-enterprises/case-uvelka-logo.svg'
import voisImage from '../../assets/figma/funnel-cases/vois.png'
import invitroImage from '../../assets/figma/funnel-cases/invitro.png'
import magnitImage from '../../assets/figma/funnel-cases/magnit.png'
import blockpostImage from '../../assets/figma/funnel-cases/blockpost.png'
import invitroLogo from '../../assets/figma/funnel-cases/invitro-logo.svg'
import magnitLogo from '../../assets/figma/funnel-cases/magnit-logo.svg'
import blockpostLogo from '../../assets/figma/funnel-cases/blockpost-logo.svg'
import baikalLogo from '../../assets/figma/funnel-cases/baikal-logo.png'
import metroLogoBackground from '../../assets/figma/funnel-cases/metro-logo-bg.svg'
import metroLogoText from '../../assets/figma/funnel-cases/metro-logo-text.svg'
import voisLogoV from '../../assets/figma/funnel-cases/vois-logo-v.svg'
import voisLogoO from '../../assets/figma/funnel-cases/vois-logo-o.svg'
import voisLogoI from '../../assets/figma/funnel-cases/vois-logo-i.svg'
import voisLogoS from '../../assets/figma/funnel-cases/vois-logo-s.svg'
import designRichLogo from '../../assets/figma/enterprise-funnel/rich-logo.svg'
import designUvelkaLogo from '../../assets/figma/enterprise-funnel/uvelka-logo.svg'
import designClothesImage from '../../assets/figma/enterprise-funnel/clothes.png'
import designBaikalImage from '../../assets/figma/enterprise-funnel/baikal.png'
import './FunnelCaseCards.css'

const casesByStage = [
  {
    cards: [
      { name: 'VOIS', image: voisImage, value: '+32%', detail: 'к плану по показам', logoType: 'vois' },
      { name: 'Увелка', image: uvelkaImage, logo: uvelkaLogo, value: '93% VTR', detail: 'при плане 70%', logoType: 'uvelka' },
    ],
    moreLabel: 'ещё 1',
  },
  {
    cards: [
      { name: 'Rich', image: richImage, logo: richLogo, value: '87% кликов', detail: 'стали сеансами', logoType: 'rich' },
      { name: 'INVITRO', image: invitroImage, logo: invitroLogo, value: '661 подписчик', detail: 'за три недели', logoType: 'invitro' },
    ],
    moreLabel: 'ещё 6',
  },
  {
    cards: [
      { name: 'METRO', image: metroImage, value: '+30% покупок', detail: 'к контрольной группе', logoType: 'metro' },
      { name: 'Legend of Baikal', image: baikalImage, logo: baikalLogo, value: '+60 п.п.', detail: 'к продажам', logoType: 'baikal' },
    ],
    moreLabel: 'ещё 4',
  },
  {
    cards: [
      { name: 'М.Косметик', image: magnitImage, logo: magnitLogo, value: '×2 ROMI', detail: 'к стандартным SMS', logoType: 'magnit' },
      { name: 'Блокпост', image: blockpostImage, logo: blockpostLogo, value: '×2 ROMI', detail: 'к стандартным SMS', logoType: 'blockpost' },
    ],
    moreLabel: 'ещё кейсы',
  },
]

function CaseLogo({ item }) {
  if (item.logoType === 'vois') {
    return (
      <div className="funnel-case-card__logo funnel-case-card__logo--vois" role="img" aria-label={item.name}>
        <img src={voisLogoV} alt="" />
        <img src={voisLogoO} alt="" />
        <img src={voisLogoI} alt="" />
        <img src={voisLogoS} alt="" />
      </div>
    )
  }

  if (item.logoType === 'metro') {
    return (
      <div className="funnel-case-card__logo funnel-case-card__logo--metro" role="img" aria-label={item.name}>
        <img src={metroLogoBackground} alt="" />
        <img src={metroLogoText} alt="" />
      </div>
    )
  }

  if (item.logoType === 'baikal') {
    return (
      <div className="funnel-case-card__logo funnel-case-card__logo--baikal" role="img" aria-label={item.name}>
        <img src={item.logo} alt="" />
      </div>
    )
  }

  return <img className={`funnel-case-card__logo funnel-case-card__logo--${item.logoType}`} src={item.logo} alt={item.name} />
}

export function FunnelCaseCards({ stage = 0, designLayout = false }) {
  const stageCases = casesByStage[stage]
  const cards = designLayout && stage === 0
    ? [
      { ...casesByStage[1].cards[0], logo: designRichLogo },
      { ...casesByStage[0].cards[1], logo: designUvelkaLogo },
    ]
    : stageCases.cards
  const { moreLabel } = stageCases

  return (
    <>
      {cards.map((item) => (
        <article className={`funnel-case-card funnel-case-card--${item.logoType}`} key={item.name} aria-label={`Кейс ${item.name}`}>
          <img className="funnel-case-card__image" src={item.image} alt="" />
          <span className="funnel-case-card__wash" aria-hidden="true" />
          <CaseLogo item={item} />
          <div className="funnel-case-card__result">
            <strong>{item.value}</strong>
            <span>{item.detail}</span>
          </div>
          <span className="funnel-case-card__arrow" aria-hidden="true">
            <span className="funnel-case-card__arrow-icon" />
          </span>
        </article>
      ))}
      <article className="funnel-case-card funnel-case-card--more" aria-label={moreLabel}>
        <div className="funnel-case-card__mini-grid" aria-hidden="true">
          <img src={metroImage} alt="" />
          <img src={beautyImage} alt="" />
          <img src={designLayout ? designClothesImage : clothesImage} alt="" />
          <img src={designLayout ? designBaikalImage : baikalImage} alt="" />
        </div>
        <span>{moreLabel}</span>
      </article>
    </>
  )
}
