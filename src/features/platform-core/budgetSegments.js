// bd_custom_stats.xlsx, Лист1: A = source, C = audience, D = telegram, E = vk, F = avito.
export const budgetGroups = [
  { title: 'Покупают', tone: 'pink', items: [
    {
      label: 'Покупки онлайн', icon: 'online-shopping',
      row: 58, source: "Совершают покупки онлайн",
      audience: 16024194, vk: 2523215, telegram: 12602545, avito: 10917556,
    },
    {
      label: 'Маркетплейсы', icon: 'cart',
      row: 250, source: "Покупатели товаров на маркетплейсах",
      audience: 2197845, vk: 273070, telegram: 1898594, avito: 1298780,
    },
    {
      label: 'Одежда масс-маркет', icon: 'clothing',
      row: 175, source: "Покупают одежду в категории масс-маркет",
      audience: 4112943, vk: 488947, telegram: 3771239, avito: 2481291,
    },
    {
      label: 'Доставка еды', icon: 'food-delivery',
      row: 188, source: "Заказывают еду с доставкой",
      audience: 3686861, vk: 388121, telegram: 3159329, avito: 2530045,
    },
  ] },
  { title: 'Передвигаются', tone: 'orange', items: [
    {
      label: 'Такси', icon: 'taxi',
      row: 60, source: "Пользователи такси",
      audience: 15816886, vk: 1812803, telegram: 12661700, avito: 10295777,
    },
    {
      label: 'Метро', icon: 'metro',
      row: 162, source: "Ездят на метро (не менее 4 поездок за 30 дней)",
      audience: 4684984, vk: 315764, telegram: 3617866, avito: 2415507,
    },
    {
      label: 'Общественный транспорт', icon: 'public-transport', selected: true,
      row: 23, source: "Ездят на общественном транспорте",
      audience: 29690663, vk: 3228037, telegram: 16866207, avito: 10528540,
    },
  ] },
  { title: 'Кто они', tone: 'blue', items: [
    {
      label: 'Предприниматели', icon: 'online-shopping',
      row: 278, source: "Предприниматели",
      audience: 1788072, vk: 163775, telegram: 1551883, avito: 1077915,
    },
    {
      label: 'Студенты', icon: 'online-shopping', selected: true,
      row: 359, source: "Студенты",
      audience: 943544, vk: 38992, telegram: 868682, avito: 591504,
    },
    {
      label: 'Самозанятые', icon: 'cart',
      row: 287, source: "Самозанятые",
      audience: 1692309, vk: 196192, telegram: 1495131, avito: 1167834,
    },
    {
      label: 'Родители детей 0–3 лет', icon: 'cart',
      row: 228, source: "Родители с детьми от 0 до 3 лет включительно",
      audience: 2777161, vk: 289131, telegram: 2600689, avito: 1809552,
    },
  ] },
  { title: 'Планируют', tone: 'cyan', items: [
    {
      label: 'Ремонт', icon: 'renovation',
      row: 123, source: "Планируют ремонт",
      audience: 6863321, vk: 886855, telegram: 5842404, avito: 4404714,
    },
    {
      label: 'Строительство', icon: 'construction',
      row: 496, source: "Планируют строительство",
      audience: 338595, vk: 38711, telegram: 266671, avito: 239488,
    },
    {
      label: 'Недвижимость', icon: 'real-estate',
      row: 118, source: "Заинтересованные в приобретении недвижимости. Хосты",
      audience: 7031544, vk: 1005418, telegram: 5435082, avito: 4474181,
    },
  ] },
  { title: 'Образ жизни', tone: 'purple', items: [
    {
      label: 'Кино', icon: 'cinema',
      row: 99, source: "Интересуются кино (киноманы)",
      audience: 8800370, vk: 1035265, telegram: 7660638, avito: 5386527,
    },
    {
      label: 'Концерты', icon: 'concerts',
      row: 372, source: "Интересуются концертами",
      audience: 822893, vk: 121543, telegram: 664582, avito: 529238,
    },
    {
      label: 'Фитнес', icon: 'fitness',
      row: 268, source: "Категория интересов 'Фитнес'. Хосты",
      audience: 1939196, vk: 181218, telegram: 1632393, avito: 1318293,
    },
    {
      label: 'Отдых за рубежом', icon: 'travel',
      row: 168, source: "Интересуются отдыхом за рубежом",
      audience: 4448880, vk: 699296, telegram: 3175510, avito: 2633466,
    },
  ] },
  { title: 'Интересуются', tone: 'mint', items: [
    {
      label: 'Медицинские услуги', icon: 'medical',
      row: 81, source: "Категория интересов 'Медицинские услуги'. Хосты",
      audience: 10891199, vk: 1699818, telegram: 8393865, avito: 6807384,
    },
    {
      label: 'Аптеки', icon: 'pharmacy',
      row: 62, source: "Интересуются приобретением лекарств и прочих товаров в аптеках",
      audience: 15300396, vk: 2191079, telegram: 11831586, avito: 8839248,
    },
    {
      label: 'Стоматология', icon: 'dental',
      row: 370, source: "Интересуются стоматологическими услугами",
      audience: 849786, vk: 125060, telegram: 692789, avito: 523237,
    },
    {
      label: 'Сдача анализов', icon: 'lab', selected: true,
      row: 320, source: "Интересуются услугами сдачи медицинских анализов",
      audience: 1275725, vk: 195721, telegram: 1078646, avito: 781844,
    },
    {
      label: 'Авто с пробегом', icon: 'car', tone: 'coral',
      row: 238, source: "Интересуются покупкой б/у автомобиля",
      audience: 2546139, vk: 372929, telegram: 1917327, avito: 2112703,
    },
    {
      label: 'Автострахование', icon: 'insurance', tone: 'coral',
      row: 417, source: "Интересуются услугами автострахования",
      audience: 655500, vk: 80065, telegram: 575701, avito: 462048,
    },
    {
      label: 'Автосервис', icon: 'service', tone: 'coral',
      row: 150, source: "Интересуются услугами автосервиса",
      audience: 5168254, vk: 590126, telegram: 4021357, avito: 3650649,
    },
  ] },
]
