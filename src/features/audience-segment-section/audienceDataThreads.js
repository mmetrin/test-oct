const symbolPatterns = [
  '← · < < ─ ─\n  ─ < < ·',
  '0101 · 001',
  '─ ─ < < < ─ ─\n    · < < ─',
  '{ } · [ ]\n  < / > ·',
  '· : · 01 ─\n  ─ 10 · :',
  '← ─ ─ · ← ─',
  '< < 0 1 · ─\n  1 0 < < ·',
]

// Scene coordinates follow the PNG arc. The streams meet its outer edge;
// the local mask fades them at the boundary without crossing into the planet.
function getArrivalX(y) {
  const distance = (y - 291.62) / 291.6
  return 202.96 + 291.6 * Math.sqrt(Math.max(0, 1 - distance ** 2)) + 2
}

const depths = [
  { opacity: 0.22, thickness: 0.6, blur: 0.9 },
  { opacity: 0.46, thickness: 0.8, blur: 0.35 },
  { opacity: 0.7, thickness: 1, blur: 0 },
  { opacity: 0.3, thickness: 0.65, blur: 0.65 },
]

// Deterministic spacing, depth and timing keep the field stable across renders.
// More paths, with only a few crisp accents; far paths travel more slowly.
const mainThreads = Array.from({ length: 32 }, (_, index) => {
  const top = 65 + index * (180 / 31) + Math.sin(index * 2.4) * 2.5
  const left = getArrivalX(top)
  const depth = depths[index % depths.length]
  const density = 0.14 + 0.98 * Math.sin((index / 31) * Math.PI) ** 2

  return {
    id: `thread-${index}`,
    left,
    top,
    // Alternate full paths with shorter arrivals to avoid a dense band on the right.
    width: (index % 2 === 0 ? 1090 + ((index * 47) % 230) : 820 + ((index * 31) % 110)) - left,
    ...depth,
    opacity: depth.opacity * density,
    duration: 8.5 + (index % 6) * 0.65 + depth.blur * 2,
    phase: ((index * 11) % 32) * 0.12,
    color: ['128 179 255', '151 194 255', '103 161 247', '115 169 249'][index % 4],
    symbols: index % 2 === 0 ? symbolPatterns[index % symbolPatterns.length] : null,
    symbolDuration: 10 + (index % 7) * 0.65,
    symbolSize: 9 + (index % 3),
    symbolAlpha: depth.opacity * density * 0.85,
    symbolSpacing: 1 + (index % 3) * 0.6,
    symbolDelay: (index % 7) * 0.35,
    symbolColor: index % 5 === 0 || index % 7 === 3
      ? 'rgb(180 213 255 / 88%)'
      : index % 9 === 2 || index % 11 === 5
        ? '#80b3ff'
        : undefined,
  }
}).filter((thread, index) => {
  const isCentralBand = index >= 11 && index <= 20

  return !isCentralBand || index % 2 === 0
})

const ambientThreads = Array.from({ length: 18 }, (_, index) => {
  const top = 58 + index * (194 / 17)
  const left = getArrivalX(top) + 12 + (index % 3) * 18

  return {
    id: `ambient-${index}`,
    left,
    top,
    width: 800 + ((index * 67) % 170) - left,
    opacity: [0.07, 0.12, 0.1, 0.14][index % 4],
    thickness: 0.5,
    blur: 1.1 + (index % 3) * 0.25,
    duration: 12 + (index % 4) * 0.8,
    phase: ((index * 7) % 18) * 0.16,
    color: ['128 179 255', '151 194 255', '103 161 247'][index % 3],
    symbols: null,
  }
})

// Sparse short paths above and below the dense core. Their opacity also passes
// through the shared vertical mask, so the outermost paths dissolve gradually.
const edgeThreads = [
  { top: 0, offset: 85, width: 330, opacity: 0.54 },
  { top: 23, offset: 30, width: 420, opacity: 0.6 },
  { top: 46, offset: 65, width: 350, opacity: 0.64 },
  { top: 270, offset: 20, width: 350, opacity: 0.64 },
  { top: 294, offset: 45, width: 300, opacity: 0.6 },
  { top: 320, offset: 15, width: 325, opacity: 0.54 },
  { top: 344, offset: 55, width: 245, opacity: 0.46 },
].map((thread, index) => ({
  id: `edge-${index}`,
  left: getArrivalX(thread.top) + thread.offset,
  top: thread.top,
  width: thread.width,
  opacity: thread.opacity,
  thickness: 0.8,
  blur: 0.3 + (index % 2) * 0.2,
  duration: 10 + (index % 3) * 1.1,
  phase: ((index * 3) % 7) * 0.35,
  color: '128 179 255',
  symbols: ['0101 · 001', '← · < <', '{ } · [ ]', '─ < < ·', '01 · 10', '< / > ·', '· < <'][index],
  symbolDuration: 10 + (index % 3) * 1.1,
  symbolSize: 10,
  symbolAlpha: thread.opacity * 0.85,
  symbolSpacing: 1.5,
  symbolColor: index % 2 === 0 ? 'rgb(180 213 255 / 82%)' : undefined,
}))

// Separate short packets occupy the upper/lower right without extending every
// central path through the partner logos. Keep gaps between these outer rows.
const rightEdgeThreads = [
  { top: 12, left: 790, width: 285, opacity: 0.59 },
  { top: 36, left: 835, width: 310, opacity: 0.66 },
  { top: 57, left: 760, width: 300, opacity: 0.62 },
  { top: 279, left: 820, width: 275, opacity: 0.66 },
  { top: 305, left: 785, width: 300, opacity: 0.64 },
  { top: 332, left: 845, width: 255, opacity: 0.58 },
].map((thread, index) => ({
  ...thread,
  id: `right-edge-${index}`,
  thickness: 0.75,
  blur: 0.35 + (index % 2) * 0.2,
  duration: 10.5 + (index % 3) * 0.8,
  phase: 0.6 + index * 0.5,
  color: '128 179 255',
  symbols: ['01 · 10', '← · <', '{ } ·', '─ < <', '001 · 01', '< / >'][index],
  symbolDuration: 10.5 + (index % 3) * 0.8,
  symbolSize: 10,
  symbolAlpha: thread.opacity * 0.85,
  symbolSpacing: 1.5,
}))

// A few larger foreground glyph groups use the same artwork gradient as logos.
const largeSymbolThreads = [72, 119, 174, 226, 290].map((top, index) => ({
  id: `large-symbol-${index}`,
  left: getArrivalX(top) + 35,
  top,
  width: 490 + (index % 3) * 75,
  opacity: 0.12,
  thickness: 0.5,
  blur: 0,
  duration: 12 + index * 0.5,
  phase: 1.4 + index * 1.1,
  color: '128 179 255',
  gradient: true,
  symbols: ['01 · 10', '{ } · [ ]', '← < <', '001 · 01', '< / >'][index],
  symbolDuration: 12 + index * 0.5,
  symbolSize: 16 + (index % 2) * 2,
  symbolAlpha: 1,
  symbolSpacing: 2,
}))

const rightSymbolThreads = [
  [18, 990], [52, 1125], [86, 940], [132, 1180], [164, 1030],
  [206, 1210], [244, 960], [278, 1100], [316, 1005], [344, 1160],
].map(([top, left], index) => ({
  id: `right-symbol-${index}`,
  left,
  top,
  width: 150 + (index % 3) * 55,
  opacity: 0.22 + (index % 3) * 0.04,
  thickness: 0.45,
  blur: 0.45,
  duration: index % 3 === 0 ? 6.8 : 10.5 + (index % 4) * 0.8,
  phase: 0.5 + index * 0.4,
  color: '128 179 255',
  symbols: symbolPatterns[(index + 2) % symbolPatterns.length],
  symbolDuration: index % 3 === 0 ? 6.8 : 10.5 + (index % 4) * 0.8,
  symbolSize: 10,
  symbolAlpha: 0.45 + (index % 2) * 0.12,
  symbolSpacing: 1.5,
  symbolDelay: (index % 5) * 0.35,
  symbolColor: index % 3 === 0
    ? 'rgb(180 213 255 / 88%)'
    : index % 4 === 1
      ? '#80b3ff'
      : undefined,
}))

const centerSymbolThreads = [
  [108, 700], [198, 675], [288, 710],
].map(([top, left], index) => ({
  id: `center-symbol-${index}`,
  left,
  top,
  width: 380 + (index % 2) * 90,
  opacity: 0.28 + (index % 2) * 0.05,
  thickness: 0.5,
  blur: 0.25,
  duration: 7.2 + (index % 3) * 0.7,
  phase: 0.8 + index * 0.45,
  color: '128 179 255',
  symbols: symbolPatterns[(index + 4) % symbolPatterns.length],
  symbolDuration: 7.2 + (index % 3) * 0.7,
  symbolSize: 11,
  symbolAlpha: 0.72,
  symbolSpacing: 1.8,
  symbolDelay: 0.4 + (index % 3) * 0.25,
  symbolColor: 'rgb(180 213 255 / 82%)',
}))

// Sparse accents outside the bright central band.
const accentThreadIds = new Set(['edge-1', 'edge-4', 'right-edge-1', 'right-edge-4'])

const composedThreads = [...ambientThreads, ...edgeThreads, ...rightEdgeThreads, ...mainThreads, ...largeSymbolThreads]

// Stable variation gently shortens some paths while retaining varied speeds.
export const audienceDataThreads = [...composedThreads, ...rightSymbolThreads, ...centerSymbolThreads].map((thread, index) => {
  const lengthFactor = index % 4 === 1 ? 0.88 : 1
  const speedFactor = index % 5 === 2 ? 0.8 : index % 5 === 4 ? 0.9 : 1
  const duration = thread.duration * lengthFactor * speedFactor
  const symbolDuration = thread.symbolDuration * lengthFactor * speedFactor
  // Start every glyph packet at a different point in its loop. A fixed offset
  // keeps the whole field balanced instead of periodically bunching on the left.
  const symbolDelay = -(2.4 + ((index * 1.618 + (thread.phase ?? 0)) % symbolDuration))

  return {
    ...thread,
    opacity: thread.opacity * (accentThreadIds.has(thread.id) ? 1.25 : 1),
    width: thread.width * lengthFactor,
    duration,
    ...(thread.symbols ? { symbolDuration, symbolDelay } : {}),
  }
})
