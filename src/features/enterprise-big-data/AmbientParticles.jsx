import { useEffect, useRef, useState } from 'react'
import { PORTRAITS } from './portraitGroups'
import './AmbientParticles.css'

const COLORS = [
  [254, 234, 223], // #FEEADF
  [156, 208, 246], // #9CD0F6
  [41, 80, 139], // #29508B
  [59, 120, 182], // #3B78B6
]

const SEGMENT_HINT_GROUPS = [
  ['Покупают корейскую косметику', 'SPF круглый год', '2+ покупки в месяц', 'Возраст: 25-34', 'Чек: от 3 000 ₽'],
  ['Каршеринг 3+ раза в неделю', 'Возраст: 25-39', 'Приложения аренды авто', 'Поездки после 18:00', 'Работают в центре города'],
  ['Кофе навынос по утрам', 'Возраст: 20-34', 'Покупают зерновой кофе', 'Кофейни 3+ раза в неделю', 'Работают в радиусе 1 км'],
  ['Бегают по утрам', 'Возраст: 25-44', 'Покупают беговые кроссовки', 'Используют спортивные приложения', 'Живут рядом с парком'],
  ['Корм для кошек ежемесячно', 'Возраст: 25-49', 'Покупают наполнитель', 'Зоомагазин в 1 км', 'Премиальные марки корма'],
  ['Авиабилеты на выходные', '3+ перелёта в год', 'Бронируют апартаменты', 'Возраст: 25-44', 'Доход: от 150 000 ₽'],

  ['Играют на приставке', 'Возраст: 18-34', 'Покупают игровые аксессуары', 'Следят за игровыми новинками', 'Чек на игры: от 5 000 ₽'],
  ['Ищут мебель из дерева', 'Возраст: 30-49', 'Посещают мебельные салоны', 'Покупают товары для ремонта', 'Доход: 120-200 тыс. ₽'],
  ['Дети: до 3 лет', 'Подгузники ежемесячно', 'Покупают детское питание', 'Возраст: 28-39', 'Выбирают коляски'],
  ['Ужин с доставкой после 19:00', 'Ищут акции', 'Заказывают суши', '2+ заказа в неделю', 'Живут в радиусе 3 км'],
  ['Сравнивают электромобили', 'Возраст: 30-49', 'Запас хода от 400 км', 'Звонили в автосалоны', 'Доход: от 200 000 ₽'],
  ['Капсульный гардероб', 'Чек: от 8 000 ₽', 'Покупают базовую одежду', 'Возраст: 25-39', 'Похожи на ваших клиентов'],

  ['Посещают концерты', 'Возраст: 18-34', 'Билеты 2+ раза за сезон', 'Интересуются живой музыкой', 'Бывают у концертных площадок'],
  ['Велоприложения 3+ раза в неделю', 'Покупали велошлем', 'Веломаршруты рядом', 'Следят за велозаездами', 'Возраст: 25-44'],
  ['Покупают ретинол', 'Уход 2+ раза за квартал', 'Премиальная косметика', 'Возраст: 30-44', 'Посещают салоны красоты'],
  ['Изучают дизайн интерфейсов', 'Смотрят онлайн-уроки', 'Возраст: 22-34', 'Покупали курсы по дизайну', 'Интересуются сменой профессии'],
  ['Бронируют глэмпинги', 'Покупают палатки', 'Ищут кемпинги', 'Возраст: 25-44', 'Доход: 100-150 тыс. ₽'],
  ['Покупают умные лампы', 'Интерес к датчикам', 'Возраст: 25-44', 'Доход: от 150 000 ₽', 'Используют приложения умного дома'],

  ['Авторское кино', 'Билеты 2+ раза в месяц', 'Следят за кинофестивалями', 'Возраст: 25-44', 'Кинотеатр в 2 км'],
  ['Цветы 2+ раза в месяц', 'Покупают подарки', 'Заказывают букеты онлайн', 'Возраст: 25-44', 'Чек: 3 000-5 000 ₽'],
  ['Йога 2+ раза в неделю', 'Приложения для йоги', 'Покупают коврики', 'Возраст: 25-44', 'Студия в 1 км'],
  ['Дети: 5-12 лет', 'Выбирают семейные отели', 'Билеты на каникулы', 'Возраст: 30-49', 'Доход: выше среднего'],
  ['Покупают уличную одежду', 'Чек: от 12 000 ₽', 'Выбирают кроссовки онлайн', 'Возраст: 18-24', 'Магазин одежды в 2 км'],
  ['Корм для собак ежемесячно', 'Возраст: 25-49', 'Покупают амуницию', 'Зоомагазин в 1 км', 'Посещают груминг-салоны'],

  ['Продукты онлайн еженедельно', 'Смотрят рецепты', 'Чек: от 3 000 ₽', 'Покупают кухонную технику', 'Возраст: 25-44'],
  ['Покупают семена весной', 'Возраст: 45-64', 'Интерес к теплицам', 'Садовый центр в 3 км', 'Заказывают садовый инвентарь'],
  ['Работают из коворкинга', 'Самозанятые и ИП', 'Бронируют переговорные', 'Возраст: 25-44', 'Бывают в деловом районе по будням'],
  ['Покупают нон-фикшн', 'Слушают аудиокниги', '3+ книги за квартал', 'Чек: от 2 000 ₽', 'Возраст: 25-44'],
  ['Тренируются дома', 'Покупают гантели', 'Возраст: 25-39', 'Спорттовары: от 5 000 ₽', 'Используют фитнес-приложения'],
  ['Покупают винтажную одежду', 'Ищут редкие вещи', 'Возраст: 20-34', 'Используют сервисы перепродажи', 'Винтажные магазины в 2 км'],
]

const SEGMENT_GRID_COLUMNS = 6
const SEGMENT_GRID_ROWS = 5
const SEGMENT_TOOLTIP_WIDTH = 300

const PORTRAIT_SPRITE_SIZE = 96
const PORTRAIT_LINK_DISTANCE = 260
const BANNER_PORTRAITS = Array.from({ length: 36 }, (_, index) => PORTRAITS[Math.floor(index * PORTRAITS.length / 36)])

const HORIZONTAL_TRACKS = [
  { y: 108 / 500, from: 324 / 1920, to: 1596 / 1920 },
  { y: 258 / 500, from: 280 / 1920, to: 856 / 1920 },
  { y: 258 / 500, from: 1064 / 1920, to: 1640 / 1920 },
]
const VERTICAL_TRACKS = [
  { x: 324 / 1920, from: 108 / 500, to: 415 / 500 },
  { x: 1596 / 1920, from: 108 / 500, to: 415 / 500 },
  { x: 0.5, from: 108 / 500, to: 226 / 500 },
]

function keepPortraitClearOfTracks(x, y, width, height, clearance, anchorX = x, anchorY = y) {
  for (const track of HORIZONTAL_TRACKS) {
    const trackY = track.y * height
    if (x < track.from * width - clearance || x > track.to * width + clearance) continue
    if (Math.abs(y - trackY) < clearance) y = trackY + (anchorY < trackY ? -clearance : clearance)
  }
  for (const track of VERTICAL_TRACKS) {
    const trackX = track.x * width
    if (y < track.from * height - clearance || y > track.to * height + clearance) continue
    if (Math.abs(x - trackX) < clearance) x = trackX + (anchorX < trackX ? -clearance : clearance)
  }
  return { x, y }
}

function createPortraitSprite(image, blurred) {
  const sprite = document.createElement('canvas')
  sprite.width = PORTRAIT_SPRITE_SIZE
  sprite.height = PORTRAIT_SPRITE_SIZE
  const spriteContext = sprite.getContext('2d')
  spriteContext.beginPath()
  spriteContext.arc(PORTRAIT_SPRITE_SIZE / 2, PORTRAIT_SPRITE_SIZE / 2, PORTRAIT_SPRITE_SIZE / 2, 0, Math.PI * 2)
  spriteContext.clip()
  if (blurred) spriteContext.filter = 'blur(3.5px)'
  spriteContext.drawImage(image, 0, 0, PORTRAIT_SPRITE_SIZE, PORTRAIT_SPRITE_SIZE)
  return sprite
}

function makeParticle(width, height, layer) {
  const warmAccent = Math.random() < 0.3
  const prominent = Math.random() < (layer === 0 ? 0.12 : 0.28)
  const seed = warmAccent ? COLORS[0] : COLORS[1 + Math.floor(Math.random() * (COLORS.length - 1))]
  const besideCard = layer > 0 && Math.random() < 0.35
  const x = besideCard ? (Math.random() < 0.5 ? 0.18 : 0.6) + Math.random() * 0.22 : Math.random()
  const y = besideCard ? 0.16 + Math.random() * 0.7 : Math.random()
  const size = layer === 0 ? 0.65 + Math.random() * 1.15 : layer === 1 ? 2 + Math.random() * 3.5 : 7 + Math.random() * 11
  const driftX = layer === 0 ? 10 + Math.random() * 12 : layer === 1 ? 13 + Math.random() * 14 : 16 + Math.random() * 19
  const driftY = layer === 0 ? 8 + Math.random() * 11 : layer === 1 ? 10 + Math.random() * 14 : 13 + Math.random() * 18
  return {
    x: x * width,
    y: y * height,
    phase: Math.random() * Math.PI * 2,
    driftX,
    driftY,
    size,
    sizeAmplitude: 0.12 + Math.random() * 0.13,
    sizeSpeed: 0.36 + Math.random() * 0.35,
    color: seed,
    alpha: (layer === 0 ? 0.3 + Math.random() * 0.46 : layer === 1 ? 0.22 + Math.random() * 0.27 : 0.16 + Math.random() * 0.22)
      + (warmAccent ? layer === 0 ? 0.18 : layer === 1 ? 0.34 : 0.45 : 0)
      + (prominent ? layer === 0 ? 0.14 : 0.27 : 0),
    speed: 0.17 + Math.random() * 0.25,
    outline: layer === 0 || Math.random() < 0.14,
    warmAccent,
    layer,
  }
}

function makePortraitParticle(width, height, portrait, index) {
  const { x, y, kind, sizeScale } = portrait
  const scale = Math.min(1, Math.max(0.5, width / 900))
  const baseSize = kind === 'white' ? 16 + index % 4 * 1.1 : kind === 'pink' ? 12.5 + index % 5 * 0.9 : 11.5 + index % 5 * 0.9
  const sizeVariation = [0.5, 0.58, 0.68, 0.94, 1.15][index * 3 % 5]
  const size = Math.max(baseSize * sizeVariation * scale * sizeScale, (portrait.minSize ?? (portrait.featured ? 22 : 0)) * scale)
  const smallness = Math.max(0, Math.min(1, (14 * scale - size) / (9 * scale)))
  const driftX = (10 + index % 4 * 2) * scale
  const driftY = (6 + index % 3 * 2) * scale
  const position = keepPortraitClearOfTracks(x * width, y * height, width, height, size * 1.1 + Math.max(driftX, driftY) + 8)
  const baseAlpha = portrait.alpha ?? (portrait.featured || index % 4 === 0 ? 0.5 : 0.25)
  const alpha = !portrait.featured && index % 4 !== 0 ? baseAlpha * 0.65 : baseAlpha
  return {
    ...position,
    portrait,
    phase: index * 2.4,
    driftX,
    driftY,
    size,
    hoverGrowth: 0.65 + 0.85 * smallness,
    alpha,
    sizeAmplitude: 0.06,
    sizeSpeed: 0.3 + index % 3 * 0.07,
    speed: 0.32 + index % 4 * 0.045,
    layer: 3,
  }
}

function makePortraitLinks(portraits, maxDistance, midX) {
  const links = []
  const linked = new Set()
  portraits.forEach((portrait, index) => {
    const nearest = portraits.flatMap((other, otherIndex) => {
      if (index === otherIndex) return []
      if ((portrait.x < midX) !== (other.x < midX)) return []
      const distance = Math.hypot(portrait.x - other.x, portrait.y - other.y)
      return distance > portrait.size + other.size + 6
        ? [{ other, otherIndex, distance }] : []
    }).sort((first, second) => first.distance - second.distance)

    nearest.slice(0, index % 2 === 0 && nearest[1]?.distance < maxDistance ? 2 : 1).forEach(({ other, otherIndex, distance }) => {
      const key = `${Math.min(index, otherIndex)}-${Math.max(index, otherIndex)}`
      if (linked.has(key)) return
      linked.add(key)
      links.push([portrait, other, Math.max(maxDistance, distance + 40)])
    })
  })
  return links
}

function makeBannerPortraitParticle(width, height, portrait, index) {
  const scale = Math.min(1, width / 1440)
  return {
    ...makePortraitParticle(width, height, portrait, index),
    x: (index + 0.5) / BANNER_PORTRAITS.length * width,
    y: [0.22, 0.78, 0.42, 0.9, 0.12, 0.62][index % 6] * height,
    size: (8 + index * 7 % 11) * scale,
    alpha: index % 3 === 0 ? 0.5 : 0.3,
    driftX: (18 + index % 4 * 4) * scale,
    driftY: (7 + index % 3 * 2) * scale,
    speed: 0.42 + index % 4 * 0.055,
    sizeAmplitude: 0.1,
    hoverGrowth: 0.75,
  }
}

function bannerBackgroundOpacity(y, height) {
  const distance = Math.abs(y / height - 0.5)
  const fade = Math.max(0, Math.min(1, (distance - 0.08) / 0.27))
  return 0.25 + 0.75 * fade
}

function bannerPortraitOpacity(x, width) {
  // Gently fade faces before the result copy, keeping the left scan clear.
  const progress = Math.max(0, Math.min(1, (x / width - 0.32) / 0.08))
  return 1 - 0.8 * progress * progress * (3 - 2 * progress)
}

export function AmbientParticles({ variant = 'network', motionActiveRef }) {
  const canvasRef = useRef(null)
  const [focus, setFocus] = useState(null)
  const isBanner = variant === 'banner'

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let frame = 0
    let lastPaint = 0
    let dwellTimer = 0
    let particles = []
    let portraitLinks = []
    let hover = null
    let visualHover = null
    let anchor = null
    let focusBlend = 0
    let motionBlend = motionActiveRef ? 0 : 1
    let motionElapsed = 0
    let isVisible = false
    const start = performance.now()
    let lastFrameTime = start
    const stage = canvas.parentElement
    const cursorExclusions = Array.from(stage.querySelectorAll('.data-network__hub, .data-network__logo'))
    const portraitImages = (isBanner ? BANNER_PORTRAITS : PORTRAITS).map(({ source, ...portrait }) => {
      const image = new Image()
      image.decoding = 'async'
      return { ...portrait, source, image, sprites: null }
    })
    let portraitsRequested = false

    const requestPortraitImages = () => {
      if (portraitsRequested) return
      portraitsRequested = true
      portraitImages.forEach(({ image, source }) => { image.src = source })
    }

    const scheduleFrame = () => {
      if (!frame && isVisible && !document.hidden) frame = window.requestAnimationFrame(draw)
    }

    const resize = () => {
      window.cancelAnimationFrame(frame)
      frame = 0
      const bounds = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 1.7)
      width = bounds.width
      height = bounds.height
      canvas.width = Math.max(1, Math.round(width * ratio))
      canvas.height = Math.max(1, Math.round(height * ratio))
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      const makePortrait = isBanner ? makeBannerPortraitParticle : makePortraitParticle
      const portraits = portraitImages.map((portrait, index) => makePortrait(width, height, portrait, index))
      portraitLinks = makePortraitLinks(portraits, Math.min(PORTRAIT_LINK_DISTANCE, width * 0.28), isBanner ? 0 : width / 2)
      particles = [
        ...Array.from({ length: Math.round(width * height / 10000) }, () => makeParticle(width, height, 0)),
        ...Array.from({ length: Math.round(width * height / 38000) }, () => makeParticle(width, height, 1)),
        ...Array.from({ length: Math.max(4, Math.round(width * height / 190000)) }, () => makeParticle(width, height, 2)),
        ...portraits,
      ]
      scheduleFrame()
    }

    const draw = (now) => {
      frame = 0
      if (!isVisible || document.hidden) return
      const frameInterval = hover || focusBlend > 0.005 ? 1000 / 60 : 1000 / 30
      if (!reduceMotion && now - lastPaint < frameInterval - 1) {
        scheduleFrame()
        return
      }
      lastPaint = now
      const scale = width / canvas.clientWidth
      const delta = Math.min(0.05, (now - lastFrameTime) / 1000)
      lastFrameTime = now
      const motionActive = motionActiveRef?.current ?? true
      motionBlend += ((motionActive ? 1 : 0) - motionBlend) * (1 - Math.exp(-delta * 1.6))
      if (!reduceMotion && motionActive) motionElapsed += delta * motionBlend
      // Start from the displayed positions and gently pick up speed after the reveal.
      const elapsed = reduceMotion ? 0 : motionActiveRef ? motionElapsed : (now - start) / 1000
      const particleElapsed = isBanner ? elapsed * 0.51 : elapsed

      if (isBanner) {
        // A slow, continuous scan stays in the left column, clear of the result text.
        visualHover = {
          x: (282 + 112 * Math.sin(elapsed * Math.PI * 2 / 60 - 0.6)) * scale,
          y: (4 + 6 * Math.sin(elapsed * Math.PI * 2 / 80)) * scale,
        }
        focusBlend = 1
      } else if (reduceMotion) {
        focusBlend = hover ? 1 : 0
        visualHover = hover
      } else {
        const fade = 1 - Math.exp(-delta * 4.2)
        focusBlend += ((hover ? 1 : 0) - focusBlend) * fade
        if (hover) {
          if (!visualHover) visualHover = { ...hover }
          const follow = 1 - Math.exp(-delta * 8)
          visualHover.x += (hover.x - visualHover.x) * follow
          visualHover.y += (hover.y - visualHover.y) * follow
        } else if (focusBlend < 0.005) {
          visualHover = null
        }
      }

      context.clearRect(0, 0, width, height)
      const focusRadius = 100 * scale

      if (visualHover && focusBlend > 0.005 && !isBanner) {
        const spotlight = context.createRadialGradient(visualHover.x, visualHover.y, 0, visualHover.x, visualHover.y, focusRadius)
        spotlight.addColorStop(0, `rgba(111, 152, 194, ${0.1 * focusBlend})`)
        spotlight.addColorStop(1, 'rgba(111, 152, 194, 0)')
        context.beginPath()
        context.arc(visualHover.x, visualHover.y, focusRadius, 0, Math.PI * 2)
        context.fillStyle = spotlight
        context.fill()
      }

      particles.forEach((particle) => {
        const wobbleX = Math.sin(particleElapsed * particle.speed + particle.phase) * particle.driftX
        const wobbleY = Math.cos(particleElapsed * particle.speed * 0.77 + particle.phase) * particle.driftY
        // Let portraits drift beyond the clipped banner edge instead of wrapping and snapping their links.
        let x = isBanner && particle.portrait ? particle.x + wobbleX : (particle.x + wobbleX + width) % width
        let y = isBanner && particle.portrait ? particle.y + wobbleY : (particle.y + wobbleY + height) % height
        if (visualHover && focusBlend > 0.005 && !isBanner) {
          const dx = visualHover.x - x
          const dy = visualHover.y - y
          const distance = Math.hypot(dx, dy)
          const outerReach = focusRadius + 50
          if (distance > focusRadius && distance < outerReach) {
            const edgeFade = Math.min(1, (distance - focusRadius) / 8)
            const reachFade = (outerReach - distance) / 50
            const attraction = edgeFade * reachFade * reachFade * (3 - 2 * reachFade) * focusBlend
            const targetDistance = focusRadius * (0.84 + 0.1 * (0.5 + 0.5 * Math.sin(particle.phase * 1.7)))
            const pull = attraction * (distance - targetDistance) / distance
            x += dx * pull
            y += dy * pull
          }
        }
        const distanceToCursor = visualHover ? Math.hypot(x - visualHover.x, y - visualHover.y) : Infinity
        const edgeInset = isBanner ? particle.size : 0
        const edgeFade = isBanner ? 24 * scale : 32
        const proximity = Math.max(0, Math.min(1, (focusRadius - distanceToCursor - edgeInset) / edgeFade))
        const boost = focusBlend * proximity * proximity * (3 - 2 * proximity)
        const focusSize = particle.portrait ? 1 + particle.hoverGrowth * boost : 1
        const radius = particle.size * (1 + Math.sin(particleElapsed * particle.sizeSpeed + particle.phase) * particle.sizeAmplitude) * focusSize
        if (particle.portrait && !isBanner) {
          const clear = keepPortraitClearOfTracks(x, y, width, height, radius + 8, particle.x, particle.y)
          x = clear.x
          y = clear.y
        }
        particle.renderX = x
        particle.renderY = y
        particle.renderBoost = boost
        particle.renderRadius = radius
      })

      portraitLinks.forEach(([first, second, maxLinkDistance]) => {
        if (!first.portrait.sprites || !second.portrait.sprites) return
        const dx = second.renderX - first.renderX
        const dy = second.renderY - first.renderY
        if (Math.abs(dx) > maxLinkDistance || Math.abs(dy) > maxLinkDistance) return
        const distance = Math.hypot(dx, dy)
        if (distance >= maxLinkDistance || distance <= first.renderRadius + second.renderRadius + 2) return
        const boost = Math.max(first.renderBoost, second.renderBoost)
        const backgroundOpacity = isBanner ? bannerBackgroundOpacity((first.renderY + second.renderY) / 2, height) : 1
        const opacity = backgroundOpacity + (1 - backgroundOpacity) * boost
        const fade = 1 - distance / maxLinkDistance
        const directionX = dx / distance
        const directionY = dy / distance
        context.beginPath()
        context.moveTo(first.renderX + directionX * first.renderRadius, first.renderY + directionY * first.renderRadius)
        context.lineTo(second.renderX - directionX * second.renderRadius, second.renderY - directionY * second.renderRadius)
        context.strokeStyle = `rgba(145, 185, 220, ${(0.12 + 0.21 * fade) * (1 + 0.3 * boost) * opacity})`
        context.lineWidth = 0.9 + 0.3 * boost
        context.stroke()
      })

      particles.forEach((particle) => {
        const { renderX: x, renderY: y, renderBoost: boost, renderRadius: radius } = particle
        const shimmer = 0.82 + Math.sin(particleElapsed * 0.62 + particle.phase) * 0.18
        const focusAlpha = 0.56 + 1.36 * boost
        const backgroundOpacity = isBanner ? bannerBackgroundOpacity(y, height) : 1

        if (particle.portrait) {
          const sprites = particle.portrait.sprites
          if (!sprites) return
          const portraitOpacity = isBanner ? bannerPortraitOpacity(x, width) : 1
          const baseAlpha = particle.alpha * backgroundOpacity
          const alpha = (baseAlpha + (0.9 - baseAlpha) * boost) * portraitOpacity
          const diameter = radius * 2
          const blurredAlpha = alpha * (1 - boost)
          context.globalAlpha = blurredAlpha
          if (blurredAlpha > 0.001) context.drawImage(sprites.blurred, x - radius, y - radius, diameter, diameter)
          const sharpAlpha = (alpha - blurredAlpha) / (1 - blurredAlpha)
          context.globalAlpha = sharpAlpha
          if (sharpAlpha > 0.001) context.drawImage(sprites.sharp, x - radius, y - radius, diameter, diameter)
          context.globalAlpha = 1
          context.beginPath()
          context.arc(x, y, radius, 0, Math.PI * 2)
          context.strokeStyle = `rgba(255, 255, 255, ${(baseAlpha * 0.5 + 0.4 * boost) * portraitOpacity})`
          context.lineWidth = 1
          context.stroke()
          return
        }

        const [r, g, b] = particle.color
        const alpha = Math.min(1, particle.alpha * (reduceMotion ? 1 : shimmer) * focusAlpha * 1.28)
          * (backgroundOpacity + (1 - backgroundOpacity) * boost)

        if (particle.outline) {
          context.beginPath()
          context.arc(x, y, radius, 0, Math.PI * 2)
          context.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
          context.lineWidth = particle.layer === 0 ? 1.2 : 1.5
          context.stroke()
          return
        }

        const glow = context.createRadialGradient(x - radius * 0.3, y - radius * 0.35, radius * 0.06, x, y, radius)
        const centerLighten = particle.warmAccent ? 0 : 0.22 - 0.14 * boost
        glow.addColorStop(0, `rgba(${r + (255 - r) * centerLighten}, ${g + (255 - g) * centerLighten}, ${b + (255 - b) * centerLighten}, ${alpha})`)
        glow.addColorStop(0.62, `rgba(${r}, ${g}, ${b}, ${alpha * (0.72 + 0.18 * boost)})`)
        glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        context.beginPath()
        context.arc(x, y, radius, 0, Math.PI * 2)
        context.fillStyle = glow
        context.fill()
      })

      if (visualHover && focusBlend > 0.005) {
        context.beginPath()
        context.arc(visualHover.x, visualHover.y, focusRadius, 0, Math.PI * 2)
        context.strokeStyle = isBanner ? '#A2C7FB' : `rgba(255, 0, 50, ${focusBlend})`
        context.lineWidth = isBanner ? scale : 1
        context.stroke()
      }
      if (!reduceMotion) scheduleFrame()
    }

    const clearDwell = () => {
      window.clearTimeout(dwellTimer)
      dwellTimer = 0
    }

    const getAvailableColumn = (clientX, clientY) => {
      const stageBounds = stage.getBoundingClientRect()
      const blockedRanges = cursorExclusions
        .map((element) => element.getBoundingClientRect())
        .filter((rect) => clientY >= rect.top - 12 && clientY <= rect.bottom + 12)
        .map((rect) => [
          Math.max(stageBounds.left, rect.left - 12),
          Math.min(stageBounds.right, rect.right + 12),
        ])
        .sort((first, second) => first[0] - second[0])

      const availableRanges = []
      let rangeStart = stageBounds.left
      blockedRanges.forEach(([blockedStart, blockedEnd]) => {
        if (blockedStart > rangeStart) availableRanges.push([rangeStart, blockedStart])
        rangeStart = Math.max(rangeStart, blockedEnd)
      })
      if (rangeStart < stageBounds.right) availableRanges.push([rangeStart, stageBounds.right])

      const availableWidth = availableRanges.reduce((sum, [start, end]) => sum + end - start, 0)
      if (availableWidth <= 0) return 0

      let availableX = 0
      for (const [start, end] of availableRanges) {
        if (clientX >= end) {
          availableX += end - start
          continue
        }
        if (clientX > start) availableX += clientX - start
        break
      }

      return Math.min(
        SEGMENT_GRID_COLUMNS - 1,
        Math.floor(availableX / availableWidth * SEGMENT_GRID_COLUMNS),
      )
    }

    const handlePointerMove = (event) => {
      if (event.pointerType === 'touch') return
      const overPlaque = cursorExclusions.some((element) => {
        const rect = element.getBoundingClientRect()
        return event.clientX >= rect.left - 12 && event.clientX <= rect.right + 12
          && event.clientY >= rect.top - 12 && event.clientY <= rect.bottom + 12
      })
      if (overPlaque) {
        hover = null
        anchor = null
        clearDwell()
        setFocus(null)
        if (reduceMotion) draw(performance.now())
        return
      }
      const bounds = canvas.getBoundingClientRect()
      const scale = bounds.width / stage.clientWidth
      const next = { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
      hover = next

      if (!anchor || Math.hypot(next.x - anchor.x, next.y - anchor.y) > 16 * scale) {
        anchor = next
        setFocus((current) => current ? { ...current, visible: false } : null)
        clearDwell()
        dwellTimer = window.setTimeout(() => {
          if (!hover) return
          const x = hover.x / scale
          const y = hover.y / scale
          const liveBounds = canvas.getBoundingClientRect()
          const column = getAvailableColumn(liveBounds.left + hover.x, liveBounds.top + hover.y)
          const row = Math.min(SEGMENT_GRID_ROWS - 1, Math.floor(y / stage.clientHeight * SEGMENT_GRID_ROWS))
          const tooltipWidth = Math.min(SEGMENT_TOOLTIP_WIDTH, stage.clientWidth - 32)
          setFocus({
            x: Math.max(16, Math.min(stage.clientWidth - tooltipWidth - 16, x + 16)),
            y: Math.max(32, y - 112),
            hints: SEGMENT_HINT_GROUPS[row * SEGMENT_GRID_COLUMNS + column],
            visible: true,
          })
          if (reduceMotion) draw(performance.now())
        }, 200)
      }

      if (reduceMotion) draw(performance.now())
    }

    const handlePointerLeave = () => {
      hover = null
      anchor = null
      clearDwell()
      setFocus((current) => current ? { ...current, visible: false } : null)
      if (reduceMotion) draw(performance.now())
    }

    const observer = new ResizeObserver(resize)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (isVisible) {
        requestPortraitImages()
        scheduleFrame()
      }
      else {
        window.cancelAnimationFrame(frame)
        frame = 0
      }
    }, { rootMargin: '100px' })
    const handleVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frame)
        frame = 0
      } else scheduleFrame()
    }
    portraitImages.forEach((portrait) => {
      const { image } = portrait
      const prepareSprites = () => {
        if (!image.naturalWidth) return
        portrait.sprites = {
          sharp: createPortraitSprite(image, false),
          blurred: createPortraitSprite(image, true),
        }
        if (reduceMotion) scheduleFrame()
      }
      image.onload = prepareSprites
      if (image.complete) prepareSprites()
    })
    observer.observe(canvas)
    visibilityObserver.observe(stage)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    if (!isBanner) {
      stage.addEventListener('pointerenter', handlePointerMove)
      stage.addEventListener('pointermove', handlePointerMove)
      stage.addEventListener('pointerleave', handlePointerLeave)
      stage.addEventListener('pointercancel', handlePointerLeave)
    }
    resize()
    return () => {
      observer.disconnect()
      visibilityObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      stage.removeEventListener('pointerenter', handlePointerMove)
      stage.removeEventListener('pointermove', handlePointerMove)
      stage.removeEventListener('pointerleave', handlePointerLeave)
      stage.removeEventListener('pointercancel', handlePointerLeave)
      clearDwell()
      window.cancelAnimationFrame(frame)
      portraitImages.forEach(({ image }) => { image.onload = null })
    }
  }, [isBanner, motionActiveRef])

  return (
    <>
      <canvas className={`ambient-particles${isBanner ? ' ambient-particles--banner' : ''}`} ref={canvasRef} aria-hidden="true" />
      {!isBanner && <div className={`ambient-particles__tooltips ${focus?.visible ? 'is-visible' : ''}`} style={focus ? { left: focus.x, top: focus.y } : undefined} aria-hidden="true">
        {(focus?.hints ?? SEGMENT_HINT_GROUPS[0]).map((hint) => <span key={hint}>{hint}</span>)}
      </div>}
    </>
  )
}
