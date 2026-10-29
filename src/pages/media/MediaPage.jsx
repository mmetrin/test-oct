import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { SiteHeader } from '../../shared/ui/site-header'
import { SiteFooter } from '../../shared/ui/site-sections'
import { MediaArticleCard, MediaCarousel, MediaCaseCard, MediaMetroCase } from './MediaCards'
import { MediaHero } from './MediaHero'
import { MediaSidebar } from './MediaSidebar'
import { MediaTagContent } from './MediaTagContent'
import { createTagArticles } from './mediaTagArticles'
import { MediaCasesContent, MediaTrendsContent } from './MediaCategoryContent'
import { selectedTrendRows } from './selectedTrendsData'
import { mediaArtwork } from './mediaArtwork'
import { mediaCases, mediaNews, midjourneyTitle, practiceArticles, trendArticles } from './mediaData'
import './MediaPage.css'

function MediaMaxBanner() {
  return (
    <section className="media-max" aria-label="Канал МТС Ads в MAX">
      <div className="media-max__background" aria-hidden="true"><img src={mediaArtwork.news.imgImageForExport} alt="" /><img src={mediaArtwork.news.imgImage2090007941} alt="" /></div>
      <div className="media-max__content"><h2>Узнавайте свежие новости быстрее в нашем канале в MAX</h2><a className="media-outline-button" href="https://max.ru/mts_ads" target="_blank" rel="noreferrer"><img src={mediaArtwork.news.imgBox1} alt="" /><span>Подписаться на канал</span></a></div>
    </section>
  )
}

function MediaArticleSection({ title, id, articles, featuredImage, featuredOverlay }) {
  const featured = { id: `${id}-featured`, title: midjourneyTitle, image: featuredImage, overlay: featuredOverlay, category: title, label: 'Практика', date: '21 августа', tags: ['ИИ', 'Инструкции'] }
  return <section className="media-section" id={id} aria-labelledby={`${id}-title`}><h2 id={`${id}-title`}>{title}</h2><div className="media-section__cards"><MediaArticleCard article={featured} featured /><MediaCarousel label={`Все статьи: ${title}`}>{articles.map((article) => <MediaArticleCard key={article.id} article={article} />)}</MediaCarousel></div></section>
}

export function MediaPage() {
  const [category, setCategory] = useState(null)
  const [tag, setTag] = useState(null)
  const [tagArticles, setTagArticles] = useState([])
  const [showMore, setShowMore] = useState(false)
  const feedRef = useRef(null)
  const changeSelection = (kind, value) => {
    const nextTagArticles = kind === 'tag' && value ? createTagArticles(tagArticles) : null
    const scrollToFeed = () => {
      if (feedRef.current?.getBoundingClientRect().top < 0) feedRef.current.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
    }
    const update = () => {
      if (kind === 'category') { setCategory(value); setTag(null) }
      else {
        setTag(value)
        if (nextTagArticles) setTagArticles(nextTagArticles)
      }
      setShowMore(false)
    }
    flushSync(update)
    scrollToFeed()
  }

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Медиа — МТС Ads'
    return () => { document.title = previousTitle }
  }, [])

  return (
    <div className="media-page" id="top">
      <SiteHeader homeNavigation actionHref={`${import.meta.env.BASE_URL}contacts/`} />
      <main className="media-page__main">
        <MediaHero />
        <div className="media-page__layout">
          <MediaSidebar category={category} tag={tag} onCategoryChange={(value) => changeSelection('category', value)} onTagChange={(value) => changeSelection('tag', value)} />
          <div className="media-feed" key={`${category ?? 'all'}:${tag ?? 'all'}`} ref={feedRef} id="media-content">
            {tag ? <MediaTagContent tag={tag} articles={tagArticles} /> : ['Тренды и технологии', 'Практика', 'Исследования рынка', 'Новости'].includes(category) ? <MediaTrendsContent category={category} /> : category === 'Кейсы' ? <MediaCasesContent /> : <>
              <div className="media-news"><MediaMaxBanner /><MediaCarousel label="Новости МТС Ads">{mediaNews.map((item) => <MediaArticleCard key={item.id} article={item} compact />)}</MediaCarousel></div>
              <section className="media-section" id="media-cases" aria-labelledby="media-cases-title"><h2 id="media-cases-title">Кейсы</h2><div className="media-section__cards"><MediaMetroCase /><MediaCarousel label="Все кейсы МТС Ads">{mediaCases.map((item, index) => <MediaCaseCard key={item.id} article={item} index={index} />)}</MediaCarousel></div></section>
              <MediaArticleSection title="Практика" id="media-practice" articles={practiceArticles} featuredImage={mediaArtwork.practice.imgImageForExport} featuredOverlay={mediaArtwork.practice.imgImageForExport1} />
              <MediaArticleSection title="Тренды и технологии" id="media-trends" articles={trendArticles} featuredImage={mediaArtwork.trends.imgImageForExport} />
              {showMore && <section className="media-more" aria-label="Другие статьи"><h2>Ещё материалы</h2><div className="media-results__grid">{selectedTrendRows[3].map((item) => <MediaArticleCard key={item.id} article={item} />)}</div></section>}
              <div className="media-feed__more"><button className="media-outline-button" type="button" aria-expanded={showMore} onClick={() => setShowMore((current) => !current)}><img src={mediaArtwork.more.imgBox} alt="" className={showMore ? 'is-expanded' : undefined} /><span>{showMore ? 'Свернуть статьи' : 'Показать еще статьи'}</span></button></div>
            </>}
          </div>
        </div>
      </main>
      <div className="media-footer"><SiteFooter /></div>
    </div>
  )
}
