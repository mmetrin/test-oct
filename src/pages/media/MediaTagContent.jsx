import { MediaArticleCard } from './MediaCards'

export function MediaTagContent({ tag, articles }) {
  return (
    <section className="media-category__row media-tag-content" aria-label={`Материалы по теме «${tag}»`}>
      {articles.map((article) => <MediaArticleCard key={article.id} article={article} />)}
    </section>
  )
}
