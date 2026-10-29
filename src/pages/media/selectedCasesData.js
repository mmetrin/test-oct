import { selectedArtwork } from './selectedArtwork'
import { mediaCaseImage } from './mediaCaseImages'

const art = selectedArtwork.selectedCases

export const selectedCases = [
  {
    id: 'selected-vois', title: 'Как снизить CPM до 140 рублей с помощью рекламы в приложении',
    artwork: { logo: 'vois', secondary: [['−25%', 'CPM', 'ниже плана']], primary: ['5,34 млн', 'показов', 'на 32% выше плана'] },
  },
  {
    id: 'selected-baikal', title: 'Как Big Data и Telegram Ads помогли увеличить продажи на 60 п.п.',
    artwork: { logo: 'baikal', secondary: [['−7,8%', 'CPC', 'к плану'], ['+62 п.п.', '', 'рост числа покупателей']], primary: ['+60 п.п.', '', 'к продажам'] },
  },
  {
    id: 'selected-vkusno', title: 'Кейс «Вкусно – и точка»: снизили стоимость подписчика в Telegram более чем в 2 раза',
    artwork: { logo: 'vkusno', logoImage: art.imgGroup, secondary: [['−35%', '', 'бюджета']], primary: ['+95%', 'CR', 'конверсия объявления'] },
  },
  {
    id: 'selected-mkosmetik', title: 'Как реклама по своей базе помогла вернуть покупателей и увеличить продажи',
    artwork: { logo: 'mkosmetik', logoImage: art.imgFrame1, secondary: [['+10%', '', 'средний чек'], ['250%', 'ROI', 'окупаемость РК']], primary: ['+20 п.п.', 'продаж', 'у реактивированной аудитории'] },
  },
  {
    id: 'selected-global-drinks', title: 'Кросс-канальная аналитика помогла расширить охват без дублирования аудитории',
    artwork: { logo: 'global-drinks', logoImage: art.imgImage2090007915, secondary: [['4,03', 'кросс-частота', 'без роста повторных контактов']], primary: ['94,7%', 'аудитории', 'без пересечений между каналами'] },
  },
  {
    id: 'selected-uvelka', title: 'ИИ-креатив помог достичь VTR 93% и повысить узнаваемость бренда',
    artwork: { logo: 'uvelka', logoImage: art.imgFrame2147240256, secondary: [['+58%', 'CTR', 'выше плана'], ['+6,9 п.п.', '', 'к узнаваемости бренда']], primary: ['93%', 'VTR', 'при плане 70%'] },
  },
  {
    id: 'selected-detmir', title: 'Как реклама помогла увеличить покупки в высокий сезон на 30%',
    artwork: { logo: 'detmir', logoImage: art.imgGroup1, secondary: [['1,06%', 'CTR', 'при плане до 0,8%'], ['>55%', 'PI', 'при цели выше 50%']], primary: ['+30%', 'покупок', 'к контрольной группе'] },
  },
  {
    id: 'selected-invitro', title: 'Как привлечь подписчиков в Telegram-канал медицинского бренда',
    artwork: { logo: 'invitro', logoImage: art.imgFrame3, secondary: [['−33%', 'CPF', 'к плану'], ['+36%', 'CTR', 'выше плана']], primary: ['661', 'подписчик', 'за три недели'] },
  },
].map((item) => ({ ...item, category: 'Кейсы', image: mediaCaseImage(item.id), tags: ['Кейсы', 'Big Data', 'Продажи'], facts: [...item.artwork.secondary, item.artwork.primary].map(([value, unit, caption]) => `${value} ${unit} — ${caption}`) }))
