import { mediaArtwork } from './mediaArtwork'
import { mediaCaseImage } from './mediaCaseImages'
import { mediaArticleHref } from './mediaData'

export function MediaArrow({ className = '' }) {
  return <span className={`media-arrow ${className}`} aria-hidden="true"><img src={mediaArtwork.hero.imgBox} alt="" /></span>
}

export function MediaLabel({ children }) {
  return <span className="media-label">{children}</span>
}

export function MediaCarousel({ children, label }) {
  const handleKeyDown = (event) => {
    if (event.target !== event.currentTarget || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return
    event.preventDefault()
    event.currentTarget.scrollBy({ left: event.key === 'ArrowRight' ? 374.333 : -374.333, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  return <div className="media-carousel" role="region" aria-label={label} tabIndex={0} onKeyDown={handleKeyDown}><div className="media-carousel__track">{children}</div></div>
}

export function MediaArticleCard({ article, compact = false, featured = false }) {
  const className = ['media-article', compact && 'media-article--compact', featured && 'media-article--featured', article.image && 'media-article--illustrated'].filter(Boolean).join(' ')
  return (
    <a className={className} href={mediaArticleHref}>
      {article.image && <div className="media-article__image"><img src={article.image} alt="" loading="lazy" />{article.overlay && <img className="media-article__image-overlay" src={article.overlay} alt="" loading="lazy" />}{article.layers?.map((layer, index) => <img key={`${layer.src}-${index}`} className={`media-article__image-layer${layer.crop ? ' media-article__image-layer--crop' : ''}`} src={layer.src} alt="" loading="lazy" />)}</div>}
      <span className="media-article__content">
        <span className="media-article__top"><MediaLabel>{article.label}</MediaLabel><MediaArrow /></span>
        <span className="media-article__copy"><span className="media-article__title">{article.lines ? article.lines.map((line) => <span className="media-article__title-line" key={line}>{line}</span>) : article.title}</span><span className="media-date">{article.date}</span></span>
      </span>
    </a>
  )
}

const caseArtwork = [
  { logo: 'vois', secondary: [['−25%', 'CPM', 'ниже плана']], primary: ['5,34 млн', 'показов', 'на 32% выше плана'] },
  { logo: 'detmir', secondary: [['1,06%', 'CTR', 'при плане до 0,8%'], ['>55%', 'PI', 'при цели выше 50%']], primary: ['+30%', 'покупок', 'к контрольной группе'] },
  { logo: 'baikal', secondary: [['−7,8%', 'CPC', 'к плану'], ['+62 п.п.', '', 'рост числа покупателей']], primary: ['+60 п.п.', '', 'к продажам'] },
]

function MediaCaseLogo({ kind, image, imageStyle }) {
  const assets = mediaArtwork.cases
  if (image) return <span className={`media-case-logo media-case-logo--custom media-case-logo--${kind}`}><img src={image} alt={kind} style={imageStyle} /></span>
  if (kind === 'vois') return <span className="media-case-logo media-case-logo--vois" aria-label="VOIS">{[assets.imgVector1, assets.imgVector2, assets.imgVector3, assets.imgVector4].map((src, index) => <img key={src} className={`media-case-logo__letter media-case-logo__letter--${index}`} src={src} alt="" />)}</span>
  if (kind === 'detmir') return <span className="media-case-logo media-case-logo--detmir"><img src={assets.imgGroup} alt="Детский мир" /></span>
  if (kind === 'baikal') return <span className="media-case-logo media-case-logo--baikal"><img src={assets.imgImage2090007957} alt="Baikal" /></span>
  return <span className="media-case-logo media-case-logo--metro"><img src={assets.imgFrame} alt="" /><img src={assets.imgVector} alt="METRO" /></span>
}

export function MediaFact({ value, unit, caption, primary = false }) {
  return <span className={`media-fact${primary ? ' media-fact--primary' : ''}`}><span className="media-fact__number"><strong>{value}</strong>{unit && <span>{unit}</span>}</span><span className="media-fact__caption">{caption}</span></span>
}

export function MediaCaseCard({ article, index, artwork }) {
  const art = artwork ?? caseArtwork[index]
  if (!art) return <a className="media-case media-case--export" href={mediaArticleHref} aria-label={article.title}><img src={article.image} alt={article.title} width="460" height="540" loading="lazy" /></a>
  const image = mediaCaseImage(article.id.startsWith('selected-') ? article.id : `carousel-${art.logo}`)
  return (
    <a className="media-case" href={mediaArticleHref}>
      <img className="media-case__image" src={image} alt="" loading="lazy" />
      <span className="media-case__shade" aria-hidden="true" />
      <span className="media-case__heading"><span className="media-case__top"><MediaCaseLogo kind={art.logo} image={art.logoImage} imageStyle={art.logoImageStyle} /><MediaArrow /></span><span>{article.title}</span></span>
      <span className="media-case__facts"><span className="media-case__secondary">{art.secondary.map(([value, unit, caption]) => <MediaFact key={value} value={value} unit={unit} caption={caption} />)}</span><MediaFact value={art.primary[0]} unit={art.primary[1]} caption={art.primary[2]} primary /></span>
    </a>
  )
}

export function MediaMetroCase({ selected = false }) {
  const article = { id: 'metro', category: 'Кейсы', title: 'Как Big Data помогла увеличить количество покупателей', image: mediaCaseImage(selected ? 'selected-metro' : 'carousel-metro'), facts: ['+11,8 п.п. — рост транзакций', '+11 п.п. — рост числа покупателей'], tags: ['Big Data', 'Кейсы'] }
  return (
    <a href={mediaArticleHref} className={`media-metro${selected ? ' media-metro--selected' : ''}`}>
      <img className="media-case__image" src={article.image} alt="" loading="lazy" />
      <span className="media-metro__shade" aria-hidden="true" />
      <span className="media-case__heading"><span className="media-case__top"><MediaCaseLogo kind="metro" /><MediaArrow /></span><span>{article.title}</span></span>
      <span className="media-metro__facts"><MediaFact value="+11,8 п.п." caption="рост транзакций" primary /><MediaFact value="+11 п.п." caption="рост числа покупателей" /></span>
    </a>
  )
}
