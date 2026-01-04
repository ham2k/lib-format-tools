import { getCurrentLocale } from './locale'

type NumberFormat = 'default' | 'integer' | 'oneDecimal'

interface FormatOptions {
  roundingType?: 'compactRounding' | 'fractionDigits'
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

const FORMATS: Record<NumberFormat, FormatOptions> = {
  default: {
    roundingType: 'compactRounding'
  },
  integer: {
    roundingType: 'fractionDigits',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  },
  oneDecimal: {
    roundingType: 'fractionDigits',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }
}

const locale = getCurrentLocale()

export function fmtNumber (n: number | string, format: NumberFormat = 'default'): string {
  if (typeof n === 'string') {
    n = Number.parseFloat(n)
  }

  return n.toLocaleString(locale, FORMATS[format] as Intl.NumberFormatOptions)
}

function numberFormatterGenerator (format: NumberFormat) {
  return (n: number | string): string => {
    if (typeof n === 'string') {
      n = Number.parseFloat(n)
    }

    return n || n === 0 ? n.toLocaleString(locale, FORMATS[format] as Intl.NumberFormatOptions) : ''
  }
}

export const fmtInteger = numberFormatterGenerator('integer')
export const fmtOneDecimal = numberFormatterGenerator('oneDecimal')

export function fmtPercent (n: number | string, format: NumberFormat = 'oneDecimal'): string {
  if (typeof n === 'string') {
    n = Number.parseFloat(n)
  }
  n = n * 100
  return fmtNumber(n, format) + '%'
}

