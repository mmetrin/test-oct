import { platformChannels } from './platformChannels.js'

// Rosstat, permanent population on 2025-01-01: Russia less Crimea and Sevastopol.
// https://roschart.ru/en/dataset/okpopul-comp2025-site-ocenka-chislennosti-postoyannogo-nasel
export const populationLimit = 146_119_928 - 1_902_249 - 558_302
export const monthlyFrequency = 3
export const exampleCpm = 320

function sumColumn(items, column) {
  return items.reduce((sum, item) => sum + item[column], 0)
}

function estimatedSegmentReach(segments, column, limit) {
  const largest = Math.min(limit, Math.max(...segments.map(item => item[column])))
  const additional = sumColumn(segments, column) - largest
  const remaining = limit - largest
  if (!additional || !remaining) return largest
  // Overlap is unknown. Count the largest segment in full, then progressively
  // discount the other memberships as they compete for the remaining audience.
  return largest + additional * remaining / (additional + remaining)
}

function filteredCount(segments, filters, column, limit) {
  let base = limit
  let share = 1
  for (const { id, options, chosen } of filters) {
    const selected = sumColumn(chosen, column)
    if (id === 'children') {
      // Parents can belong to more than one child age band.
      base = Math.min(base, selected)
    } else {
      const known = sumColumn(options, column)
      if (!known) return 0
      base = Math.min(base, known)
      share *= selected / known
    }
  }
  if (!segments.length) return filters.length ? Math.round(base * share) : 0
  const segmentReach = estimatedSegmentReach(segments, column, limit)
  // Project segment coverage onto the selected profile in this same channel.
  return Math.round(segmentReach * (base / limit) * share)
}

export function estimateBudget(segments, filters = []) {
  const gross = segments.reduce((sum, item) => sum + item.audience, 0)
  const children = filters.find(filter => filter.id === 'children')
  const audience = filteredCount(segments, filters, 'audience', populationLimit)
  const channelReach = Object.fromEntries(platformChannels.map(({ id, monthlyAudience }) =>
    [id, Math.min(filteredCount(segments, filters, id, monthlyAudience), audience)],
  ))
  return {
    audience, gross, channelReach,
    capped: audience === populationLimit,
    bounded: Boolean(children && (children.chosen.length > 1 || segments.length)),
    modeled: segments.length > 1 || (segments.length > 0 && filters.length > 0) || filters.length > 1,
    budget: Math.round(audience * monthlyFrequency * exampleCpm / 1000),
  }
}
