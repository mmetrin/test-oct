import backgroundPhoto from '../../assets/figma/hero-cards-design/uvelka-photo.png'
import peoplePhoto from '../../assets/figma/hero-cards-design/mts-platforms-people.png'

export function MtsPlatformsCaseArtwork() {
  return (
    <span className="case-design-artwork mts-platforms-case-artwork" aria-hidden="true">
      <span className="layered-case-artwork__visual">
        <span className="layered-case-artwork__photo-position">
          <span className="layered-case-artwork__photo-rotation">
            <img src={backgroundPhoto} alt="" draggable="false" />
          </span>
        </span>
        <img className="mts-platforms-case-artwork__people" src={peoplePhoto} alt="" draggable="false" />
        <span className="layered-case-artwork__shade" />
      </span>
      <span className="case-design-artwork__badge mts-platforms-case-artwork__badge">
        5 000+ компаний используют инструменты МТС ADS
      </span>
      <strong className="mts-platforms-case-artwork__headline">
        Освойте рекламные платформы МТС Ads
      </strong>
    </span>
  )
}
