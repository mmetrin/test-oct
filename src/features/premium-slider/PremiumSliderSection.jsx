import { sliderTrack } from './sliderConfig'
import { SliderCard } from './SliderCard.jsx'
import { usePremiumSlider } from './usePremiumSlider'

export function PremiumSliderSection() {
  const {
    isDragging,
    isSnapping,
    trackOffset,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    setIsHovering,
  } = usePremiumSlider()

  return (
    <section
      id="slider-section"
      className="slider-section"
      aria-label="MTS Ads Premium Video: слайды"
    >
      <div className="slider-section__header scroll-reveal">
        <h2>МТС ADS Premium Video</h2>
      </div>
      <div
        className={`slider-section__viewport${isDragging ? ' is-dragging' : ''}`}
        onPointerEnter={() => setIsHovering(true)}
        onPointerLeave={() => setIsHovering(false)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className={`slider-section__track${isSnapping ? ' is-snapping' : ''}`}
          style={{ transform: `translate3d(${-trackOffset}px, 0, 0)` }}
        >
          {sliderTrack.map((slide, index) => (
            <SliderCard slide={slide} key={`${slide.id}-${index}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
