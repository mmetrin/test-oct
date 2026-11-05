import { platformChannels } from './platformChannels.js'

// Rosstat, permanent population on 2025-01-01: Russia less Crimea and Sevastopol.
// https://roschart.ru/en/dataset/okpopul-comp2025-site-ocenka-chislennosti-postoyannogo-nasel
export const populationLimit = 146_119_928 - 1_902_249 - 558_302
export const monthlyFrequency = 3
export const exampleCpm = 320

export function estimateBudget(segments) {
  const sum = column => segments.reduce((total, segment) => total + segment[column], 0)
  const gross = sum('audience')
  const audience = Math.min(gross, populationLimit)
  const channelReach = Object.fromEntries(platformChannels.map(({ id, monthlyAudience }) =>
    [id, Math.min(sum(id), audience, monthlyAudience)],
  ))
  return {
    audience, gross, channelReach,
    capped: gross > populationLimit,
    budget: Math.round(audience * monthlyFrequency * exampleCpm / 1000),
  }
}
