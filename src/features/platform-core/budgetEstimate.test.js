import assert from 'node:assert/strict'
import { test } from 'node:test'
import { estimateBudget, populationLimit } from './budgetEstimate.js'
import { budgetGroups, demographics, interestCatalog } from './budgetSegments.js'
import { platformChannels } from './platformChannels.js'

const chips = budgetGroups.flatMap(group => group.items)

test('each chip still contributes when the other chips and default demographics are selected', () => {
  const filters = demographics.filter(group => group.id !== 'children').map(group => ({
    id: group.id,
    options: group.items,
    chosen: group.id === 'income' ? group.items.slice(-2) : group.items,
  }))
  const all = estimateBudget(chips, filters)
  for (const chip of chips) {
    const without = estimateBudget(chips.filter(item => item !== chip), filters)
    assert.ok(without.audience < all.audience, chip.label)
    assert.ok(without.budget < all.budget, chip.label)
    for (const { id } of platformChannels) {
      assert.ok(without.channelReach[id] < all.channelReach[id], chip.label + ' / ' + id)
    }
  }
})

test('single segments retain their counts and combined estimates stay within the available audience', () => {
  for (const chip of chips) {
    const single = estimateBudget([chip])
    assert.equal(single.audience, chip.audience)
    for (const { id } of platformChannels) assert.equal(single.channelReach[id], chip[id])
  }
  const all = estimateBudget([...chips, ...interestCatalog.flatMap(group => group.items)])
  assert.ok(all.audience >= Math.max(...chips.map(item => item.audience)))
  assert.ok(all.audience <= populationLimit)
  for (const { id, monthlyAudience } of platformChannels) {
    assert.ok(all.channelReach[id] <= Math.min(all.audience, monthlyAudience))
  }
})
