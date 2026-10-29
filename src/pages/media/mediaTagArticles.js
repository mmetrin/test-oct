import { mediaNews, practiceArticles, trendArticles } from './mediaData'
import { selectedTrendRows } from './selectedTrendsData'

// Temporary tag previews use editorial articles only, until real tag data is available.
const articles = [...selectedTrendRows.flat(), ...practiceArticles, ...trendArticles, ...mediaNews]
  .filter((article) => article.category !== 'Кейсы')
  .filter((article, index, all) => all.findIndex((item) => item.title === article.title) === index)

function shuffle(items) {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[other]] = [result[other], result[index]]
  }
  return result
}

export function createTagArticles(previous = []) {
  const illustrated = shuffle(articles.filter((article) => article.image))
  const textOnly = shuffle(articles.filter((article) => !article.image)).slice(0, 3)
  // Even a coincidental shuffle must visibly change the first card.
  if (illustrated[0].id === previous[0]?.id) illustrated.push(illustrated.shift())
  return [...illustrated.slice(0, 3), ...textOnly, illustrated[3]]
    .map((article) => ({ ...article, label: 'Интерес' }))
}
