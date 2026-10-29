import male from '../../assets/figma/connected-tv/male.svg'
import female from '../../assets/figma/connected-tv/female.svg'
import high from '../../assets/figma/connected-tv/income-high.svg'
import low from '../../assets/figma/connected-tv/income-low.svg'
import medium from '../../assets/figma/connected-tv/income-medium.svg'

export const audienceAges = [
  { label: 'менее 18 лет', value: 12, width: 154.92 },
  { label: '18–24 года', value: 4, width: 52.5 },
  { label: '25–34 года', value: 10, width: 129.315 },
  { label: '35–44 года', value: 16, width: 206.13 },
  { label: '45–54 года', value: 15, width: 193.327 },
  { label: '55–64 года', value: 19, width: 244.537 },
  { label: 'более 64 лет', value: 24, width: 308.549 },
]

export const audienceGender = [
  { label: 'Мужской пол', value: 44, color: '#54a5e3', start: 1.9547688, end: 4.656539, position: 'top-left', icon: male, iconX: 116.75, iconY: 101 },
  { label: 'Женский пол', value: 56, color: '#ff0032', start: 4.712389, end: 8.16814, position: 'bottom-right', icon: female, iconX: 284.75, iconY: 283 },
]

export const audienceIncome = [
  { label: 'Высокий доход (C)', value: 28, color: '#ff0032', start: 2.9670596, end: 4.66352, position: 'top-left', icon: high, iconX: 121.75, iconY: 98 },
  { label: 'Средний доход (B)', value: 50, color: '#677fa2', start: 4.729842, end: 7.8086033, position: 'bottom-right', icon: medium, iconX: 288.75, iconY: 282 },
  { label: 'Низкий доход (A)', value: 22, color: '#54a5e3', start: 1.5882496, end: 2.907722, position: 'bottom-left', icon: low, iconX: 121.75, iconY: 282 },
]

export const audienceLocations = [
  { label: ['Менее 100 000 чел.', 'населением'], value: 17, width: 223, color: '#3e9ae0' },
  { label: ['Более 100 000 чел.', 'населением'], value: 52, width: 706, color: '#ff0032' },
  { label: ['1 000 000 чел.', 'населением'], value: 14, width: 167, color: '#9dabdd' },
  { label: ['Москва и Санкт-Петербург', 'с областями'], value: 17, width: 247, color: '#677fa2' },
]

// Stable demo values until the online TV audience dataset is supplied.
function demoDonut(segments, values, order) {
  let angle = -Math.PI / 2
  const result = segments.map((segment, index) => ({ ...segment, value: values[index] }))
  for (const index of order) {
    const segment = result[index]
    segment.start = angle + 0.028
    angle += segment.value / 100 * Math.PI * 2
    segment.end = angle - 0.028
    // Keep equivalent angles near the original arcs so they take the shortest route.
    const turns = Math.round((segments[index].start - segment.start) / (Math.PI * 2))
    segment.start += turns * Math.PI * 2
    segment.end += turns * Math.PI * 2
    const midpoint = (segment.start + segment.end) / 2
    segment.iconX = 205.75 + Math.cos(midpoint) * 120.9
    segment.iconY = 188 + Math.sin(midpoint) * 120.9
  }
  return result
}

export const audienceDatasets = {
  cinema: { ages: audienceAges, gender: audienceGender, income: audienceIncome, locations: audienceLocations },
  online: {
    ages: audienceAges.map((item, index) => {
      const value = [8, 10, 18, 22, 17, 14, 11][index]
      return { ...item, value, width: value * 308.549 / 24 }
    }),
    gender: demoDonut(audienceGender, [62, 38], [1, 0]),
    income: demoDonut(audienceIncome, [20, 43, 37], [1, 2, 0]),
    locations: audienceLocations.map((item, index) => {
      const value = [25, 33, 20, 22][index]
      return { ...item, value, width: 1343 * value / 100 }
    }),
  },
}
