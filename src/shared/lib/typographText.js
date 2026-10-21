const NON_BREAKING_WORDS = [
  'а',
  'без',
  'в',
  'во',
  'для',
  'до',
  'за',
  'и',
  'из',
  'изо',
  'или',
  'к',
  'как',
  'ко',
  'когда',
  'либо',
  'на',
  'над',
  'не',
  'но',
  'о',
  'об',
  'обо',
  'от',
  'по',
  'под',
  'при',
  'про',
  'с',
  'со',
  'у',
  'чем',
  'через',
  'чтобы',
]

const nonBreakingWordsPattern = new RegExp(
  `(?<!\\S)(${NON_BREAKING_WORDS.join('|')})\\s+`,
  'giu',
)

export function typographText(text) {
  return text.replace(nonBreakingWordsPattern, '$1\u00a0')
}
