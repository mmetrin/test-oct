import { useState } from 'react'
import { MediaArticleCard, MediaArrow, MediaCaseCard, MediaFact, MediaMetroCase } from './MediaCards'
import { mediaArtwork } from './mediaArtwork'
import { selectedArtwork } from './selectedArtwork'
import { mediaCaseImage } from './mediaCaseImages'
import { selectedCases } from './selectedCasesData'
import { selectedNewsRows, selectedPracticeRows, selectedResearchRows, selectedTrendRows } from './selectedTrendsData'
import { mediaNews, mediaCases, mediaArticleHref } from './mediaData'

function MediaCategoryMore({ expanded, onToggle }) {
  return <div className="media-category__more"><button className="media-outline-button" type="button" aria-expanded={expanded} onClick={onToggle}><img src={mediaArtwork.more.imgBox} alt="" className={expanded ? 'is-expanded' : undefined} /><span>{expanded ? 'Свернуть статьи' : 'Показать еще статьи'}</span></button></div>
}

export function MediaTrendsContent({ category = 'Тренды и технологии' }) {
  const [expanded, setExpanded] = useState(false)
  const rows = category === 'Новости' ? selectedNewsRows : category === 'Практика' ? selectedPracticeRows : category === 'Исследования рынка' ? selectedResearchRows : selectedTrendRows
  return <section className="media-category media-category--trends" aria-label={category}>
    {rows.map((row) => <div className="media-category__group" key={row[0].id}><div className={`media-category__row${row.length === 2 ? ' media-category__row--mixed' : ''}`}>
      {row.map((article) => <div className={article.span === 2 ? 'media-category__wide' : undefined} key={article.id}><MediaArticleCard article={article} /></div>)}
    </div></div>)}
    {expanded && <div className="media-category__row">{[mediaNews[0], mediaNews[2], mediaNews[3]].map((article) => <MediaArticleCard key={article.id} article={article} />)}</div>}
    <MediaCategoryMore expanded={expanded} onToggle={() => setExpanded((value) => !value)} />
  </section>
}

function MediaRichCase() {
  const art = selectedArtwork.selectedCases
  const article = { id: 'rich', category: 'Кейсы', title: 'Точный таргетинг помог превратить 87% кликов в сеансы на сайте', image: mediaCaseImage('selected-rich'), facts: ['87% кликов стали сеансами на сайте', '+50% CTR — выше плана'] }
  return <a className="media-metro media-rich media-metro--selected" href={mediaArticleHref}><img className="media-case__image" src={article.image} alt="" loading="lazy" /><span className="media-metro__shade" /><span className="media-case__heading"><span className="media-case__top"><span className="media-case-logo media-case-logo--rich"><img src={art.imgFrame2} alt="Rich" /></span><MediaArrow /></span><span>{article.title}</span></span><span className="media-metro__facts"><MediaFact value="87%" unit="кликов" caption="стали сеансами на сайте" primary /><MediaFact value="+50%" unit="CTR" caption="выше плана" /></span></a>
}

export function MediaCasesContent() {
  const [expanded, setExpanded] = useState(false)
  const pair = (items) => <div className="media-category__case-row">{items.map((article) => <MediaCaseCard key={article.id} article={article} artwork={article.artwork} />)}</div>
  return <section className="media-category media-category--cases" aria-label="Кейсы">
    <div className="media-category__case-list"><MediaMetroCase selected />{pair(selectedCases.slice(0, 2))}{pair(selectedCases.slice(2, 4))}<MediaRichCase />{pair(selectedCases.slice(4, 6))}{pair(selectedCases.slice(6, 8))}{expanded && pair(mediaCases.slice(-2))}</div>
    <MediaCategoryMore expanded={expanded} onToggle={() => setExpanded((value) => !value)} />
  </section>
}
