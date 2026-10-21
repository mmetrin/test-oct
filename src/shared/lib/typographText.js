const NBSP = '\u00a0'
const NON_BREAKING_HYPHEN = '\u2011'

const NON_BREAKING_WORDS = [
  'а', 'без', 'в', 'во', 'для', 'до', 'за', 'и', 'из', 'изо', 'или',
  'к', 'как', 'ко', 'на', 'над', 'не', 'но', 'о', 'об', 'обо', 'от',
  'по', 'под', 'при', 'про', 'с', 'со', 'у',
]

const shortWordPattern = new RegExp(
  '(?<![\\p{L}\\p{N}])(' + NON_BREAKING_WORDS.join('|') + ')[ \\t]+(?=[\\p{L}\\p{N}])',
  'giu',
)

const unitPattern = /(\d|\+)[ \t]+(?=(?:тыс\.?|млн|млрд|руб\.?|₽|%|кг|г|км|м|см|мм|лет|год(?:а|у|ом)?|месяц(?:а|ев)?|дн(?:я|ей)|час(?:а|ов)?|мин(?:ута|уты|ут)?|сек(?:унда|унды|унд)?)(?!\p{L}))/giu

export function typographText(text) {
  if (typeof text !== 'string' || !text) return text

  return text
    // Разряды чисел и единицы измерения должны оставаться на одной строке.
    .replace(/(\d)[ \t]+(?=\d{3}(?!\d))/gu, '$1' + NBSP)
    .replace(unitPattern, '$1' + NBSP)
    .replace(/(№|§)[ \t]+(?=\d)/gu, '$1' + NBSP)
    .replace(/(\p{Lu}\.)[ \t]+(?=\p{Lu})/gu, '$1' + NBSP)
    .replace(/(?<!\p{L})(МТС|MTS)[ \t]+(?=ADS(?!\p{L}))/giu, '$1' + NBSP)
    .replace(/(?<!\p{L})(Big)[ \t]+(?=Data(?!\p{L}))/giu, '$1' + NBSP)
    .replace(shortWordPattern, '$1' + NBSP)
    .replace(/(\S)[ \t]+(?=—)/gu, '$1' + NBSP)
    // Дефис внутри слова связывает обе его части. URL и email сохраняем.
    .replace(/\S+/gu, (word) => (
      /@|:\/\/|\.(?:ru|com|org|net|рф)(?:[/?#]|$)/iu.test(word)
        ? word
        : word.replace(/(?<=\p{L})-(?=\p{L})/gu, NON_BREAKING_HYPHEN)
    ))
}
