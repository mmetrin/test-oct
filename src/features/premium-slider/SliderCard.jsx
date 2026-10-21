import { typographText } from '../../shared/lib/typographText'

export function SliderCard({ slide }) {
  return (
    <article className={`slider-card slider-card--${slide.id}`}>
      <img className="slider-card__background" src={slide.background} alt="" />
      {slide.logos?.map((logoItem) => (
        <img
          className={`slider-card__logo ${logoItem.className}`}
          src={logoItem.src}
          alt=""
          key={logoItem.className}
        />
      ))}
      <div className="slider-card__copy">
        <h3>{typographText(slide.title)}</h3>
        <p>{typographText(slide.description)}</p>
      </div>
      {slide.button && (
        <a
          className={`premium-video-button slider-card__button ${slide.buttonClassName ?? ''}`}
          href="#lead-form"
          onPointerDown={(event) => event.stopPropagation()}
          onPointerMove={(event) => event.stopPropagation()}
          onPointerUp={(event) => event.stopPropagation()}
        >
          {typographText(slide.button)}
        </a>
      )}
    </article>
  )
}
