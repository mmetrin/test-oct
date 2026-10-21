import { CaseCard } from './CaseCard'
import { carouselSettings } from './carouselSettings'
import { heroCases } from './cases'
import { useCaseCarousel } from './useCaseCarousel'
import './HeroCaseCarousel.css'

function wrappedDistance(index, position, count) {
  let distance = index - ((position % count) + count) % count
  if (distance > count / 2) distance -= count
  if (distance < -count / 2) distance += count
  return distance
}

function betweenSlots(distance, slots) {
  const lower = Math.min(Math.floor(distance), slots.length - 2)
  const progress = Math.min(1, distance - lower)
  return slots[lower] + (slots[lower + 1] - slots[lower]) * progress
}

export function HeroCaseCarousel() {
  const carousel = useCaseCarousel(heroCases.length)
  const settings = carousel.isMobile ? carouselSettings.mobile : carouselSettings
  const { activeIndex, isDragging, position } = carousel

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
          {heroCases.map((item, index) => {
            const distance = wrappedDistance(index, position, heroCases.length)
            const magnitude = Math.abs(distance)
            const direction = Math.sign(distance)
            const x = direction * betweenSlots(magnitude, [0, settings.horizontalGap, settings.horizontalGap * 1.8, settings.horizontalGap * 2.65, settings.horizontalGap * 3.5, settings.horizontalGap * 4.4, settings.horizontalGap * 5.3])
            const y = settings.verticalStep * magnitude
            const z = 120 - settings.translateZStep * magnitude
            const rotateY = -direction * betweenSlots(magnitude, [0, settings.rotateStep, settings.rotateStep * 1.08, settings.rotateStep * 1.14, settings.rotateStep * 1.2, settings.rotateStep * 1.24, settings.rotateStep * 1.28])
            const rotateZ = direction * Math.min(5, magnitude)
            const scale = 1 - settings.scaleStep * magnitude
            const visibleLimit = carousel.isMobile ? 2.7 : 6
            const opacity = Math.max(0, Math.min(1, (visibleLimit - magnitude) / 0.6))
            const style = {
              transform: `translate3d(${x}px, ${y}px, ${z}px) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) scale(${scale})`,
              filter: `blur(${Math.min(6, settings.blurStep * magnitude ** 1.15)}px)`,
              opacity,
              zIndex: 20 - Math.round(magnitude * 3),
              pointerEvents: opacity < 0.15 ? 'none' : undefined,
              transitionDuration: isDragging ? '0ms' : `${settings.transitionDuration}ms`,
            }
            return <CaseCard caseItem={item} isActive={index === activeIndex} key={item.id} onClick={() => carousel.selectCard(index)} style={style} />
          })}
        </div>
      </div>
      <span className="hero-case-carousel__status" aria-live="polite">{heroCases[activeIndex].product} · {heroCases[activeIndex].company}</span>
    </div>
  )
}
