const colorSources = Object.entries(import.meta.glob('../../assets/enterprise-big-data/portraits/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
})).sort(([first], [second]) => first.localeCompare(second)).map(([, source]) => source)

const whiteSources = Object.entries(import.meta.glob('../../assets/enterprise-big-data/portraits-white/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
})).sort(([first], [second]) => first.localeCompare(second)).map(([, source]) => source)

const additionalWhiteSources = Object.entries(import.meta.glob('../../assets/enterprise-big-data/portraits-white-new/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
})).sort(([first], [second]) => first.localeCompare(second)).map(([, source]) => source)

const pinkSources = Object.entries(import.meta.glob('../../assets/enterprise-big-data/portraits-warm-pink/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
})).sort(([first], [second]) => first.localeCompare(second)).map(([, source]) => source)

const sources = { color: colorSources, white: whiteSources, pink: pinkSources }

// Broad visual age ranges; each zone contains portraits with similar presentation.
// Alternate sides so the composition does not split all women and men by side.
const groups = [
  // Younger women, left; younger men, right.
  { bounds: [0.105, 0.39, 0.17, 0.38], ids: { color: [1, 5, 7, 13, 19], white: [1, 3, 5], pink: [1, 3, 5, 7] } },
  { bounds: [0.61, 0.895, 0.17, 0.38], ids: { color: [2, 8, 14, 16], white: [2, 4, 6], pink: [2, 4, 6, 8] } },
  // Middle-aged women, right; middle-aged men, left.
  { bounds: [0.61, 0.895, 0.41, 0.63], ids: { color: [9, 11, 15], white: [7, 9, 11, 13], pink: [9, 11, 13, 15, 17, 19] } },
  { bounds: [0.105, 0.39, 0.41, 0.63], ids: { color: [4, 10, 12, 18], white: [8, 10, 12, 14], pink: [10, 12, 14, 16, 18, 20] } },
  // Older women, left; older men, right.
  { bounds: [0.105, 0.39, 0.66, 0.84], ids: { color: [3, 17], white: [15, 17, 19], pink: [21, 23, 25, 27, 29] } },
  { bounds: [0.61, 0.895, 0.66, 0.84], ids: { color: [6, 20], white: [16, 18, 20], pink: [22, 24, 26, 28, 30] } },
]

// Staggered positions give each group a shared area without a tight clump.
const slots = [
  [0.05, 0.06], [0.28, 0.11], [0.52, 0.05], [0.75, 0.10], [0.97, 0.04],
  [0.14, 0.46], [0.38, 0.53], [0.62, 0.44], [0.86, 0.50],
  [0.03, 0.90], [0.25, 0.84], [0.49, 0.94], [0.73, 0.83], [0.96, 0.90],
]

const aboveHub = {
  'pink-1': { x: 0.445, y: 0.292 },
  'pink-2': { x: 0.555, y: 0.292 },
}

const groupedPortraits = groups.flatMap(({ bounds, ids }) => {
  const kinds = ['color', 'white', 'pink']
  const count = Math.max(...kinds.map((kind) => ids[kind].length))
  const portraits = Array.from({ length: count }, (_, index) => kinds.flatMap((kind) => {
    const number = ids[kind][index]
    return number ? [{ source: sources[kind][number - 1], kind, number }] : []
  })).flat()

  return portraits.map((portrait, index) => {
    const [slotX, slotY] = slots[Math.floor((index + 0.5) * slots.length / portraits.length)]
    const [left, right, top, bottom] = bounds
    // Ease positions toward the central card: fewer portraits at the outer edges.
    const inwardX = right < 0.5 ? 1 - (1 - slotX) ** 1.65 : slotX ** 1.65
    const featuredPosition = aboveHub[`${portrait.kind}-${portrait.number}`]
    return {
      ...portrait,
      x: featuredPosition?.x ?? left + (right - left) * inwardX,
      y: featuredPosition?.y ?? top + (bottom - top) * slotY,
      featured: Boolean(featuredPosition),
      sizeScale: featuredPosition ? 1.6 : 1,
    }
  })
})

// Small, quiet portraits fill gaps in the six groups without moving the original composition.
const additionalPositions = [
  [0.13, 0.20], [0.87, 0.20], [0.21, 0.24], [0.79, 0.24],
  [0.30, 0.19], [0.70, 0.19], [0.37, 0.25], [0.63, 0.25],
  [0.12, 0.32], [0.88, 0.32], [0.20, 0.36], [0.80, 0.36],
  [0.29, 0.32], [0.71, 0.32], [0.37, 0.36], [0.63, 0.36],
  [0.78, 0.44], [0.22, 0.44], [0.87, 0.49], [0.13, 0.49],
  [0.70, 0.55], [0.30, 0.55], [0.79, 0.61], [0.21, 0.61],
  [0.14, 0.69], [0.86, 0.69], [0.25, 0.75], [0.75, 0.75],
  [0.36, 0.81], [0.64, 0.81], [0.57, 0.16],
]

const additionalPortraits = additionalWhiteSources.map((source, index) => ({
  source,
  kind: 'white',
  number: index + 1,
  x: additionalPositions[index][0],
  y: additionalPositions[index][1],
  sizeScale: index % 5 === 0 ? 0.82 : 0.7,
  alpha: index % 5 === 0 ? 0.22 : 0.16,
}))

export const PORTRAITS = [
  ...groupedPortraits,
  ...additionalPortraits,
  { source: pinkSources[6], kind: 'pink', number: 7, x: 0.5, y: 0.15, featured: true, minSize: 10, sizeScale: 1 },
]
