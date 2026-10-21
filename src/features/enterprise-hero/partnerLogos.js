// SVG layers and their positions from Figma node 9870:164384.
const assets = import.meta.glob('../../assets/figma/enterprise-partners/svg/*.svg', { eager: true, query: '?url', import: 'default' })
const layer = (name, left, top) => ({ image: assets[`../../assets/figma/enterprise-partners/svg/${name}.svg`], left, top })

export const partnerLogoSets = [
  [
    { name: 'Legend of Baikal', width: 76, layers: [layer('baikal', 0, .914)] },
    { name: 'Увелка', width: 82, layers: [layer('uvelka', 0, 2.15)] },
    { name: 'Островок', width: 122, layers: [layer('ostrovok', .4, 10)] },
    { name: 'ПИК', width: 60, layers: [layer('pik', .102, 10.8)] },
    { name: 'Wildberries', width: 125, layers: [layer('wildberries', .2, 7.4)] },
    { name: 'Haval', width: 109, layers: [layer('haval', .305, 13.268)] },
    { name: 'Т-Банк', width: 88, layers: [layer('t-bank-word', 33.405, 14.652), layer('t-bank-symbol', .079, 7.512)] },
    { name: 'VOIS', width: 76, layers: [layer('vois-v', 0, 11.603), layer('vois-o', 22.458, 11.356), layer('vois-i', 47.622, 11.603), layer('vois-s', 54.781, 11.356)] },
  ],
  [
    { name: 'Вкусно — и точка', width: 234, layers: [layer('vkusno', 0, 5.23)] },
    { name: 'Инвитро', width: 100, layers: [layer('invitro', 0, 10.357)] },
    { name: 'Детский мир', width: 128, layers: [layer('detmir', 0, 0)] },
    { name: 'ФСК', width: 88, layers: [layer('fsk-word', 12.883, 6.231), layer('fsk-symbol', 1.91, 5.478), layer('fsk-detail', 2.948, 24.793)] },
    { name: 'Rich', width: 61, layers: [layer('rich', .378, 7.444)] },
    { name: 'М.Косметик', width: 160, layers: [layer('magnit', 0, -1.984)] },
    { name: 'METRO', width: 101, layers: [layer('metro-frame', 0, 2.504), layer('metro-word', 5.565, 12.046)] },
  ],
]
