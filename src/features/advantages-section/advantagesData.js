import cardReal from '../../assets/figma/card-real.png'
import cardSound from '../../assets/figma/card-sound.png'
import cardVtr from '../../assets/figma/card-vtr.png'

export const advantages = [
  {
    title: ['Рекламу увидят', 'и услышат на 100%'],
    description: 'Все показы со звуком и на весь экран',
    image: cardSound,
    imageClassName: 'advantage-card__image--sound',
  },
  {
    title: ['Только реальные зрители'],
    description: 'Без ботов и накруток',
    image: cardReal,
    imageClassName: 'advantage-card__image--real',
  },
  {
    title: ['Ролик досмотрят до конца'],
    description: 'Более 85% зрителей смотрят видео полностью',
    image: cardVtr,
    imageClassName: 'advantage-card__image--vtr',
  },
]
