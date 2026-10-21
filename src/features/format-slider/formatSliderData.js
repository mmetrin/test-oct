import frameRollOverlay from '../../assets/figma/format-slider/top-1.png'
import frameRollVideo from '../../assets/figma/format-slider/video-frame-roll.mp4'
import shoppableOverlay from '../../assets/figma/format-slider/top-2.png'
import shoppableVideo from '../../assets/figma/format-slider/video-snopabble.mp4'
import situationRollOverlay from '../../assets/figma/format-slider/top-3.png'
import situationRollVideo from '../../assets/figma/format-slider/video-situation.mp4'

const frameRollContent = {
  eyebrow: ['SMART VOD', 'ONLINE TV'],
  title: 'Выделите бренд на фоне обычной рекламы с Frame-roll',
  description:
    'Формат помогает занять больше пространства на экране и усилить заметность ключевого сообщения',
  bullets: [
    'Ролик на брендированной подложке с крупной иллюстрацией продукта',
    'Призыв к действию CTA',
    'QR-код на товар',
  ],
}

const shoppableContent = {
  eyebrow: ['SMART VOD', 'ONLINE TV'],
  title: 'Сократите путь от просмотра до покупки',
  description:
    'Зритель может заинтересоваться продуктом и сразу перейти к покупке, не прерывая просмотр',
  bullets: [
    'Интерактивная галерея товаров в виде слайдера',
    'Центральный товар в фокусе',
    'Призывы к действию CTA',
    'QR-код на каждый товар',
  ],
}

const brandedCollectionContent = {
  eyebrow: ['SMART VOD'],
  title: 'Брендированная киноколлекция',
  description: 'Здесь будет контент формата брендированной киноколлекции',
  bullets: [],
}

const situationRollContent = {
  eyebrow: ['SMART VOD'],
  title: 'Появляйтесь в подходящий момент',
  description: [
    'Рекламный ролик показывается после тематически связанной сцены, вручную выбранной редакцией.',
    'Контекст просмотра усиливает рекламное сообщение и делает контакт с брендом более естественным',
  ],
  bullets: [],
}

export const formatStateFrames = [
  {
    id: 'shoppable-start',
    videoSrc: shoppableVideo,
    overlaySrc: shoppableOverlay,
    label: 'Shoppable Ad: стартовое состояние',
    tab: 'shoppable',
    activeWidth: 1,
    fillTab: true,
    ...shoppableContent,
  },
  {
    id: 'shoppable-complete',
    videoSrc: shoppableVideo,
    overlaySrc: shoppableOverlay,
    label: 'Shoppable Ad: активное состояние',
    tab: 'shoppable',
    activeWidth: 356,
    ...shoppableContent,
  },
  {
    id: 'situation-roll-start',
    videoSrc: situationRollVideo,
    overlaySrc: situationRollOverlay,
    label: 'Situation-roll: стартовое состояние',
    tab: 'situation-roll',
    activeWidth: 1,
    fillTab: true,
    ...situationRollContent,
  },
  {
    id: 'situation-roll-complete',
    videoSrc: situationRollVideo,
    overlaySrc: situationRollOverlay,
    label: 'Situation-roll: активное состояние',
    tab: 'situation-roll',
    activeWidth: 356,
    ...situationRollContent,
  },
  {
    id: 'frame-roll-start',
    videoSrc: frameRollVideo,
    overlaySrc: frameRollOverlay,
    label: 'Frame-roll: стартовое состояние',
    tab: 'frame-roll',
    activeWidth: 1,
    fillTab: true,
    ...frameRollContent,
  },
  {
    id: 'frame-roll-complete',
    videoSrc: frameRollVideo,
    overlaySrc: frameRollOverlay,
    label: 'Frame-roll: активное состояние',
    tab: 'frame-roll',
    activeWidth: 356,
    ...frameRollContent,
  },
  {
    id: 'branded-collection-start',
    image: null,
    label: 'Брендированная киноколлекция: стартовое состояние',
    tab: 'branded-collection',
    activeWidth: 1,
    fillTab: true,
    placeholderColor: '#d8e8f7',
    ...brandedCollectionContent,
  },
  {
    id: 'branded-collection-complete',
    image: null,
    label: 'Брендированная киноколлекция: активное состояние',
    tab: 'branded-collection',
    activeWidth: 356,
    placeholderColor: '#c2dcf0',
    ...brandedCollectionContent,
  },
]

export const formatTabs = [
  { id: 'shoppable', label: 'Shoppable Ad', activeLeft: 1 },
  { id: 'situation-roll', label: 'Situation-roll', activeLeft: 0 },
  { id: 'frame-roll', label: 'Frame-roll', activeLeft: -3 },
  { id: 'branded-collection', label: 'Брендированная киноколлекция', activeLeft: 0 },
]

export const formatStateTransitions = [
  {
    nextState: 1,
    delay: 1,
    duration: 6000,
    easing: 'cubic-bezier(0.42, 0, 0.58, 1)',
  },
  {
    nextState: 2,
    delay: 1,
    duration: 90,
    easing: 'cubic-bezier(0.42, 0, 1, 1)',
  },
  {
    nextState: 3,
    delay: 1,
    duration: 5000,
    easing: 'cubic-bezier(0.42, 0, 0.58, 1)',
  },
  {
    nextState: 4,
    delay: 1,
    duration: 90,
    easing: 'cubic-bezier(0.42, 0, 1, 1)',
  },
  {
    nextState: 5,
    delay: 1,
    duration: 4600,
    easing: 'cubic-bezier(0.42, 0, 0.58, 1)',
  },
  {
    nextState: 6,
    delay: 1,
    duration: 90,
    easing: 'cubic-bezier(0.42, 0, 1, 1)',
  },
  {
    nextState: 7,
    delay: 1,
    duration: 5000,
    easing: 'cubic-bezier(0.42, 0, 0.58, 1)',
  },
  {
    nextState: 0,
    delay: 1,
    duration: 90,
    easing: 'cubic-bezier(0.42, 0, 1, 1)',
  },
]
