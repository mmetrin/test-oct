import { featuredArticle } from './mediaData'
import { mediaArtwork } from './mediaArtwork'
import { MediaArrow, MediaLabel } from './MediaCards'

export function MediaHero() {
  const art = mediaArtwork.hero
  return (
    <a className="media-hero" href={featuredArticle.href} aria-label={featuredArticle.title}>
      <div className="media-hero__art" aria-hidden="true">
        <div className="media-hero__device"><div className="media-hero__shell"><div className="media-hero__video"><div className="media-hero__tablet"><img src={art.imgImage2090007895} alt="" /><div className="media-hero__screen"><div className="media-hero__screen-content"><img src={art.imgImage2090007938} alt="" /></div><div className="media-hero__screen-edge" /></div></div><div className="media-hero__timeline"><span /><span /><img src={art.imgGroup2087326297} alt="" /></div><span className="media-hero__time">05:30</span></div></div></div>
        <div className="media-hero__photo"><img src={art.imgRectangle240655283} alt="" /></div>
        <div className="media-hero__fade" /><div className="media-hero__glow" /><div className="media-hero__disc" />
      </div>
      <div className="media-hero__content"><h1>{featuredArticle.title}</h1><div className="media-hero__labels"><span className="media-date">{featuredArticle.date}</span><MediaLabel>{featuredArticle.label}</MediaLabel></div></div>
      <MediaArrow className="media-hero__arrow" />
    </a>
  )
}
