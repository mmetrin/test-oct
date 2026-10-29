import { useState } from 'react'
import { mediaCategories } from './mediaData'
import { allMediaTags, categoryMediaTags } from './mediaSidebarData'

export function MediaSidebar({ category, tag, onCategoryChange, onTagChange }) {
  const [showAllTags, setShowAllTags] = useState(false)
  const primaryTags = categoryMediaTags[category] ?? allMediaTags.slice(0, 11)
  const extraTags = allMediaTags.filter((item) => !primaryTags.includes(item))
  const renderTag = (item, index) => <button type="button" key={item} style={{ '--tag-delay': `${Math.floor(index / 3) * 25}ms` }} aria-pressed={tag === item} onClick={() => onTagChange(tag === item ? null : item)}>{item}</button>

  return (
    <aside className="media-sidebar" aria-label="Рубрики и темы медиа">
      <p className="media-sidebar__heading">Выберите что интересно</p>
      <div className="media-sidebar__categories">{mediaCategories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => onCategoryChange(category === item ? null : item)}>{item}</button>)}</div>
      <div className="media-sidebar__topics" key={category ?? 'all'}>
        <div className="media-sidebar__tags media-sidebar__tags--primary">{primaryTags.map(renderTag)}</div>
        <div className="media-sidebar__reveal" data-expanded={showAllTags} id="media-extra-tags" inert={!showAllTags}>
          <div className="media-sidebar__reveal-clip"><div className="media-sidebar__tags media-sidebar__tags--extra">{extraTags.map(renderTag)}</div></div>
        </div>
        <button type="button" className="media-sidebar__expand" aria-controls="media-extra-tags" aria-expanded={showAllTags} onClick={() => setShowAllTags((current) => !current)}>{showAllTags ? 'Скрыть другие теги' : 'Показать другие теги'}</button>
      </div>
    </aside>
  )
}
