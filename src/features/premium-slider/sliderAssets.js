import slide01Bg from '../../assets/figma/slides/slide-01-bg.jpg'
import slide02Bg from '../../assets/figma/slides/slide-02-bg.jpg'
import slide03Bg from '../../assets/figma/slides/slide-03-bg.jpg'
import slide04Bg from '../../assets/figma/slides/slide-04-bg.jpg'
import slide05Bg from '../../assets/figma/slides/slide-05-bg.jpg'
import slide03Logo01 from '../../assets/figma/slides/slide-03-logo-01.svg'
import slide03Logo02 from '../../assets/figma/slides/slide-03-logo-02.svg'
import slide03Logo03 from '../../assets/figma/slides/slide-03-logo-03.svg'
import slide03Logo04 from '../../assets/figma/slides/slide-03-logo-04.svg'
import slide04Logo01 from '../../assets/figma/slides/slide-04-logo-01.svg'
import slide04Logo02 from '../../assets/figma/slides/slide-04-logo-02.svg'
import slide04Logo03 from '../../assets/figma/slides/slide-04-logo-03.svg'

export const sliderSlides = [
  {
    id: '05',
    background: slide05Bg,
    title: 'Каждый показ можно проверить',
    description: 'Получайте прозрачную статистику и оценивайте результат кампании в привычной digital-логике',
    button: 'Обсудить кампанию',
  },
  {
    id: '01',
    background: slide01Bg,
    title: 'Один видеосигнал — миллионы зрителей всей России',
    description:
      'Большие экраны от Калининграда до Владивостока. Широкий охват Connected TV сочетается с точностью и измеримостью digital-рекламы',
  },
  {
    id: '02',
    background: slide02Bg,
    title: 'Таргетинг на потенциальных клиентов',
    description:
      'Настройте кампанию под конкретную аудиторию с помощью данных и digital-инструментов MTS Ads',
    button: 'Получить предложение',
    buttonClassName: 'slider-card__button--wide',
  },
  {
    id: '03',
    background: slide03Bg,
    title: 'Эксклюзивный инвентарь МТС',
    description:
      'Тематические онлайн-телеканалы охватывают аудиторию с разными интересами — от музыки и путешествий до медиапроектов. Часть инвентаря доступна только через MTS Ads',
    logos: [
      { src: slide03Logo01, className: 'slider-card__logo--03-01' },
      { src: slide03Logo02, className: 'slider-card__logo--03-02' },
      { src: slide03Logo03, className: 'slider-card__logo--03-03' },
      { src: slide03Logo04, className: 'slider-card__logo--03-04' },
    ],
  },
  {
    id: '04',
    background: slide04Bg,
    title: 'До 63 миллионов зрителей',
    description:
      'Охват на 26 млн устройств в KION, IVI и Wink — рядом с проверенным профессиональным контентом и в безопасном для бренда окружении',
    logos: [
      { src: slide04Logo01, className: 'slider-card__logo--04-01' },
      { src: slide04Logo02, className: 'slider-card__logo--04-02' },
      { src: slide04Logo03, className: 'slider-card__logo--04-03' },
    ],
  },
]
