import projectVideo from '../../assets/platform-core/videos/01_project_slow.mp4'
import audienceVideo from '../../assets/platform-core/videos/02_cross_channel_slow.mp4'
import targetingVideo from '../../assets/platform-core/videos/03_targeting_slow.mp4'
import projectCover from '../../assets/platform-core/videos/01_cover.png'
import audienceCover from '../../assets/platform-core/videos/02_cover.png'
import targetingCover from '../../assets/platform-core/videos/03_cover.png'

export const platformInterfaceSlides = [
  {
    id: 'project', label: 'Создание проекта', video: projectVideo, cover: projectCover,
    title: 'Три рекламных канала — один проект',
    titleLines: ['Три рекламных канала', '— один проект'],
    description: 'Telegram, VK и Авито собраны в одном проекте с общими датами и бюджетом 100 000 ₽ на каждый канал. Кампании удобно планировать и контролировать на одном экране',
  },
  {
    id: 'audiences', label: 'Сохранение и исключение аудитории', video: audienceVideo, cover: audienceCover,
    title: 'Аудитории работают между каналами',
    titleLines: ['Аудитории работают', 'между каналами'],
    description: 'Сервис сохраняет аудиторию показов и кликов в Telegram и позволяет исключить её из кампании VK. Это помогает сократить повторные показы и точнее распределить рекламный бюджет',
  },
  {
    id: 'targeting', label: 'Настройки таргетов', video: targetingVideo, cover: targetingCover,
    title: 'Точная настройка аудитории Big Data МТС',
    titleLines: ['Точная настройка', 'аудитории Big Data МТС'],
    description: 'В настройках выбираются город и возраст, а прогноз охвата обновляется по мере выбора параметров. Так можно оценить размер аудитории ещё до запуска рекламы',
  },
]
