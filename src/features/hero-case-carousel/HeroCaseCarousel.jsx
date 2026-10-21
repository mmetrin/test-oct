import { CaseCard } from './CaseCard'
import { carouselSettings } from './carouselSettings'
import { heroCases } from './cases'
import { useCaseCarousel } from './useCaseCarousel'
import './HeroCaseCarousel.css'

const VISIBLE_RADIUS = 2
const RENDER_RADIUS = VISIBLE_RADIUS + 1

function betweenSlots(distance, slots) {
  const lower = Math.min(Math.floor(distance), slots.length - 2)
  const progress = Math.min(1, distance - lower)
  return slots[lower] + (slots[lower + 1] - slots[lower]) * progress
}

export function HeroCaseCarousel({ isReady = true }) {
  const carousel = useCaseCarousel(heroCases.length, 1, isReady)
  const settings = carousel.isMobile ? carouselSettings.mobile : carouselSettings
  const { activeIndex, isDragging, position } = carousel
  const firstVirtualIndex = Math.floor(position) - RENDER_RADIUS
  const virtualIndices = Array.from(
    { length: RENDER_RADIUS * 2 + 1 },
    (_, offset) => firstVirtualIndex + offset,
  )

  return (
    <div className="hero-case-carousel" style={{ '--case-card-width': `${settings.cardWidth}px`, '--case-perspective': `${settings.perspective}px` }}>
      <div className="hero-case-carousel__eyebrow">Истории роста с МТС ADS <span>·</span> {String(activeIndex + 1).padStart(2, '0')} / {String(heroCases.length).padStart(2, '0')}</div>
      <div
        aria-label="Карусель кейсов. Перетаскивайте карточки или используйте стрелки клавиатуры"
        className={`hero-case-carousel__viewport${isDragging ? ' is-dragging' : ''}`}
        onKeyDown={carousel.onKeyDown}
        onPointerCancel={carousel.onPointerCancel}
        onPointerDown={carousel.onPointerDown}
        onPointerMove={carousel.onPointerMove}
        onPointerUp={carousel.onPointerUp}
        ref={carousel.viewportRef}
        role="region"
        tabIndex={0}
      >
        <div className="hero-case-carousel__stage">
          {virtualIndices.map((virtualIndex) => {
            const index = ((virtualIndex % heroCases.length) + heroCases.length) % heroCases.length
            const item = heroCases[index]
            const distance = virtualIndex - position
            const magnitude = Math.abs(distance)
            const direction = Math.sign(distance)
            const x = direction * betweenSlots(magnitude, settings.horizontalSlots)
            const y = betweenSlots(magnitude, settings.verticalSlots)
            const z = betweenSlots(magnitude, settings.depthSlots)
            const rotateY = -direction * betweenSlots(magnitude, settings.rotationSlots)
            const scale = betweenSlots(magnitude, settings.scaleSlots)
            const visibility = Math.max(0, Math.min(1, VISIBLE_RADIUS + 1 - magnitude))
            const opacity = betweenSlots(magnitude, settings.opacitySlots) * visibility
            const transitionDuration = isDragging ? '0ms' : `${settings.transitionDuration}ms`
            const style = {
              transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotateY}deg) scale(${scale})`,
              filter: `blur(${betweenSlots(magnitude, settings.blurSlots)}px)`,
              opacity,
              '--case-light-fade': betweenSlots(magnitude, settings.lightFadeSlots),
              '--case-transition-duration': transitionDuration,
              zIndex: 20 - Math.round(magnitude * 3),
              pointerEvents: magnitude > VISIBLE_RADIUS || opacity < 0.45 ? 'none' : undefined,
              transitionDuration,
            }
            return <CaseCard caseItem={item} isActive={virtualIndex === Math.round(position)} key={virtualIndex} onClick={() => carousel.selectCard(index)} style={style} />
          })}
        </div>
      </div>
      <span className="hero-case-carousel__status" aria-live="polite">{heroCases[activeIndex].product} · {heroCases[activeIndex].company}</span>
    </div>
  )
}
