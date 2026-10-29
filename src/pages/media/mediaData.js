import { mediaArtwork } from './mediaArtwork'
import caseManifest from '../../assets/figma/enterprise-content/manifest.json'

const caseImages = import.meta.glob('../../assets/figma/enterprise-content/case-*@2x.*', { eager: true, query: '?url', import: 'default' })

export const mediaCategories = ['Новости', 'Практика', 'Кейсы', 'Тренды и технологии', 'Исследования рынка']

export const midjourneyTitle = 'Как пользоваться Midjourney в 2026 году: доступ, пошаговая инструкция и промпты'
export const mediaNews = [
  { id: 'mailing-prices', title: 'Изменение стоимости рассылок по своей базе', tags: ['SMS', 'Продажи'] },
  { id: 'midjourney', title: `${midjourneyTitle} готовые`, tags: ['ИИ', 'Инструкции'] },
  { id: 'brandbook', title: 'Брендбук: зачем нужен и как создавать', tags: ['Брендинг', 'Инструкции'] },
  { id: 'ugc', title: 'Как UGC-креативы снизили стоимость привлечения на 14%', tags: ['Привлечение клиентов', 'Продвижение'] },
  { id: 'advertising-tools', title: midjourneyTitle, tags: ['ИИ', 'Интернет-маркетинг'] },
].map((item) => ({ ...item, category: 'Новости', label: 'Практика', date: '21 августа' }))

export const practiceArticles = [
  { id: 'loyalty', title: 'Программа лояльности: как удерживать клиентов', image: mediaArtwork.practice.imgImage2090007902, label: 'Практика', tags: ['Лояльность', 'Продажи'] },
  { id: 'audience', title: 'Как найти аудиторию для рекламной кампании', image: mediaArtwork.practice.imgImage2090007903, label: 'Рассылки', tags: ['Привлечение клиентов', 'Инструкции', 'SMS'] },
  { id: 'audience-trends', title: 'Как найти аудиторию для рекламной кампании', label: 'Тренды', tags: ['Big Data', 'Привлечение клиентов'] },
  { id: 'business-metrics', title: 'Аналитика для бизнеса: главные метрики', image: mediaArtwork.practice.imgImage2090007905, label: 'Тренды', tags: ['Аналитика', 'Продажи'] },
].map((item) => ({ ...item, category: 'Практика', date: '21 августа' }))

export const trendArticles = [
  { id: 'mailing-formats', title: 'Новые форматы рассылок для бизнеса', image: mediaArtwork.trends.imgImage2090007902, label: 'Практика', tags: ['SMS', 'Продвижение'] },
  { id: 'crm', title: 'CRM-маркетинг: как возвращать покупателей', image: mediaArtwork.trends.imgImage2090007903, label: 'Рассылки', tags: ['CRM', 'Продажи'] },
  { id: 'business-website', title: 'Как создать сайт для небольшого бизнеса', image: mediaArtwork.trends.imgImage2090007904, label: 'Тренды', tags: ['Интернет-маркетинг', 'Инструкции'] },
  { id: 'reviews', title: 'Отзывы клиентов: как превратить их в продажи', label: 'Тренды', tags: ['Продажи', 'Продвижение'] },
].map((item) => ({ ...item, category: 'Тренды и технологии', date: '21 августа' }))

export const mediaCases = caseManifest.filter((item) => item.name.startsWith('case-') && item.name !== 'case-02').map((item) => ({
  id: item.name, category: 'Кейсы', title: item.text[0], facts: item.text.slice(1),
  image: caseImages[`../../assets/figma/enterprise-content/${item.file}`],
  tags: ['Кейсы', 'Big Data', 'Продажи', 'Аналитика'],
}))

export const mediaArticleHref = `${import.meta.env.BASE_URL}article-brandbook/`

export const featuredArticle = { id: 'free-training', category: 'Практика', title: 'Освойте рекламные платформы в бесплатном обучении', date: '27 октября', label: 'Практика', href: mediaArticleHref }

