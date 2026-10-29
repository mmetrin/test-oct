import calls from '../../assets/figma/multichannel-strategy/calls.png'
import telegram from '../../assets/figma/multichannel-strategy/telegram.png'
import dsp from '../../assets/figma/multichannel-strategy/dsp.png'
import messages from '../../assets/figma/multichannel-strategy/messages.png'

// Original Figma layers: calls, telegram ads, dsp, messages (10339:25426).
export const strategyChannels = [
  { id: 'dsp', image: dsp, title: 'DSP-платформа', description: 'Получайте охват и демонстрируйте продукт на дополнительных площадках', href: 'https://ads.mts.ru/' },
  { id: 'telegram', image: telegram, title: 'Telegram Ads', description: 'Показы по сегментам Big Data МТС и собственным аудиториям', href: 'https://marketolog.mts.ru/' },
  { id: 'messages', image: messages, title: 'Таргетированные СМС', description: 'Выберете сегмент по аудитории Big Data МТС и звоните из личного кабинета', href: 'https://marketolog.mts.ru/' },
  { id: 'calls', image: calls, title: 'Таргетированный обзвон', description: 'Обзвон абонентов МТС по данным BigData и данным партнёров', href: `${import.meta.env.BASE_URL}targeted-calls/` },
]

// Four fixed display positions; the product catalog can grow independently.
export const strategySlots = [
  { id: 'top', angle: -Math.PI / 2 },
  { id: 'right', angle: 0 },
  { id: 'bottom', angle: Math.PI / 2 },
  { id: 'left', angle: Math.PI },
]
