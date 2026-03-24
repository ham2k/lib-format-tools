import { defaultI18N } from "./i18n"

const MIXED_CASE_REGEX = /[A-Z][a-z]/g
const ALL_UPPER_CASE_REGEX = /^[A-Z]+$/g
const WORD_OR_HYPENED_SEPARATOR_REGEX = /([^\s-.]+?)([\s"“”‘’'-.]+|\s*$)/g
const LETTERS_ONLY_REGEX = /^[a-z]+$/
const PERIOD_REGEX = /\./g

const CAPTITALIZATION_EXCEPTIONS: Record<string, string> = {
  am: 'AM',
  cw: 'CW',
  iaru: 'IARU',
  ii: 'II',
  iii: 'III',
  iv: 'IV',
  ios: 'iOS',
  iota: 'IOTA',
  iphone: 'iPhone',
  ipad: 'iPad',
  arrl: 'ARRL',
  ares: 'ARES',
  clublog: 'ClubLog',
  fcc: 'FCC',
  fm: 'FM',
  ft2: 'FT2',
  ft4: 'FT4',
  ft8: 'FT8',
  flexradio: 'FlexRadio',
  gridtracker: 'GridTracker',
  ham2k: 'Ham2K',
  nasa: 'NASA',
  pota: 'POTA',
  sota: 'SOTA',
  qrm: 'QRM',
  qrn: 'QRN',
  qro: 'QRO',
  qrv: 'QRV',
  qrt: 'QRT',
  qrp: 'QRP',
  qrz: 'QRZ',
  qsb: 'QSB',
  qsl: 'QSL',
  qso: 'QSO',
  qsy: 'QSY',
  qth: 'QTH',
  rtty: 'RTTY',
  youtube: 'YouTube'
}

const MODAL_CAPITALIZATION_EXCEPTIONS: Record<string, Record<string, string>> = {
  address: {
    nsw: 'NSW',
    vic: 'VIC',
    qld: 'QLD',
    tas: 'TAS',
    act: 'ACT',
    pei: 'PEI',
    nwt: 'NWT'
  }
}

export function capitalizeString (str: string, options: { content?: 'text' | 'name', force?: boolean } = {}) {
  const { content = 'text' } = options
  let { force = true } = options

  if (!str) return ''

  str = `${str}`.trim()

  // If we're not forcing capitalization, only do it if the string is already mixed case
  if (!force && !str.match(MIXED_CASE_REGEX)) {
    force = true
  }

  return str.replace(WORD_OR_HYPENED_SEPARATOR_REGEX, (_match, word, separator) => {
    if (force) {
      word = word.toLowerCase()
      if (CAPTITALIZATION_EXCEPTIONS[word]) {
        return CAPTITALIZATION_EXCEPTIONS[word] + separator
      } else if (MODAL_CAPITALIZATION_EXCEPTIONS[content] && MODAL_CAPITALIZATION_EXCEPTIONS[content][word]) {
        return MODAL_CAPITALIZATION_EXCEPTIONS[content][word] + separator
      } else if (word.length === 1 && content === 'name' && word.match(LETTERS_ONLY_REGEX)) {
        // Initials
        return word.toUpperCase() + (separator.match(PERIOD_REGEX) ? '' : '.') + separator
      } else {
        return word.charAt(0).toUpperCase() + word.slice(1) + separator
      }
    } else {
      if (word.length === 1 && content === 'name' && word.match(ALL_UPPER_CASE_REGEX)) {
        // When respecting existing case, only add periods to initials if they are already capitalized
        return word.toUpperCase() + (separator.match(PERIOD_REGEX) ? '' : '.') + separator
      } else {
        return word + separator
      }
    }
  })
}

export function capitalizeFirstLetter (str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function camelCaseToWords(camelCase: string, { capitalize }: { capitalize?: boolean } = {}) {
  let words = (camelCase || '').replace(/([A-Z])/g, ' $1')
  if (capitalize) words = capitalizeString(words)

  return words
}

type TemplatePrimitiveValue = string | number
type TemplateFunction = (key: string, context: Record<string, TemplatePrimitiveValue | TemplateFunction>) => string
type TemplateValue = TemplatePrimitiveValue | TemplateFunction
const TEMPLATE_REGEX = /\{\{(.+?)\}\}/g

export function simpleTemplate(template: string, values: Record<string, TemplateValue> = {}, context: Record<string, TemplateValue> = {}) {
  return template.replace(TEMPLATE_REGEX, (match, key) => {
    if (typeof values[key] === 'function') {
      return values[key](key, context)
    } else if (typeof values[key] === 'number') {
      return values[key].toString()
    } else if (typeof values[key] === 'string') {
      return values[key]
    } else if (typeof values._default === 'function') {
      return values._default(key, context)
    } else {
      return match
    }
  })
}

export function countTemplate(count: number, { zero, one, more }: { zero?: string, one?: string, more?: string } = {}, context: Record<string, TemplateValue> = {}) {
  if (count === 0) {
    return simpleTemplate(zero ?? more ?? '', { ...context, count })
  } else if (count === 1) {
    return simpleTemplate(one ?? more ?? '', { ...context, count })
  } else {
    return simpleTemplate(more ?? '', { ...context, count })
  }
}

export function sanitizeToISO8859(text: string) {
  if (!text) return ''
  // eslint-disable-next-line no-control-regex
  return text.replace(/[”“]/g, '"').replace(/[‘’]/g, "'").replace(/[^\x00-\xFF]/g, '·')
}

export function escapeToUnicodeEntities(text: string) {
  return String(text).replace(/[\u0080-\uFFFF]/g, ch => `&#${ch.codePointAt(0)};`)
}

export function removeASCIIControlCharacters(text: string) {
  if (!text) return ''
  // eslint-disable-next-line no-control-regex
  return text.replace(/[\x00-\x1F\x7F]/g, '')
}

export function slashZeros(text: string) {
  // See "Combining Solidus" in https://en.wikipedia.org/wiki/Slashed_zero
  if (!text) return ''
  return text.replace(/0/g, '0̸')
}

export function sanitizeForMarkdown(text: string) {
  if (!text) return ''
  return text.replace(/^[-* \t–—]+/g, '')
}

export function joinAnd(parts: string[], { separator, conjunction, final }: { separator?: string, conjunction?: string, final?: string } = {}) {
  separator = separator || defaultI18N.t('general.formatting.list.separator', ', ')
  conjunction = conjunction || defaultI18N.t('general.formatting.list.conjunction', ' and ')
  final = final || defaultI18N.t(['general.formatting.list.final', 'general.formatting.list.conjunction'], conjunction)

  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]
  if (parts.length === 2) return parts.join(`${conjunction}`)
  return parts.slice(0, -1).join(separator) + `${final}` + parts.slice(-1)
}
