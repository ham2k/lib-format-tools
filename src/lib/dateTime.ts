import { DateTime } from 'luxon'
import { capitalizeFirstLetter } from './string'

// https://github.com/moment/luxon/blob/master/docs/formatting.md
type FormatName = 'ContestTimestamp' | 'ContestTimestampZulu' | 'MonthYear' | 'DateDayMonth' | 'NiceDateTime' | 'ADIFDate' | 'ADIFTime' | 'ADIFDateTime' | 'Timestamp'

interface FormatOptions {
  hourCycle?: 'h23' | 'h12' | 'h11' | 'h24'
  weekday?: 'short' | 'long' | 'narrow'
  hour?: 'numeric' | '2-digit'
  minute?: 'numeric' | '2-digit'
  timeZoneName?: 'short' | 'long' | 'shortOffset' | 'longOffset' | 'shortGeneric' | 'longGeneric'
  timeZone?: string
  year?: 'numeric' | '2-digit'
  month?: 'long' | 'short' | 'narrow' | 'numeric' | '2-digit'
  day?: 'numeric' | '2-digit'
  format?: string
}

const FORMATS: Record<FormatName, FormatOptions> = {
  ContestTimestamp: {
    hourCycle: 'h23',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short'
  },
  ContestTimestampZulu: {
    hourCycle: 'h23',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'Zulu'
  },
  MonthYear: {
    year: 'numeric',
    month: 'long'
  },
  DateDayMonth: {
    day: 'numeric',
    month: 'long'
  },
  NiceDateTime: {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short'
  },
  ADIFDate: {
    format: 'yyyyMMdd',
  },
  ADIFTime: {
    format: 'HHmm',
  },
  ADIFDateTime: {
    format: 'yyyyMMdd HHmmss',
  },
  Timestamp: {
    format: 'yyyyMMddHHmmss',
  }
}

const AFTER_FORMATS: Record<string, (str: string) => string> = {
  ContestTimestampZulu: (str) => str.replace(' UTC', 'Z')
}

export function ensureDateTime (dt: DateTime | Date | string | number | null | undefined): DateTime | null {
  if (dt instanceof DateTime) {
    return dt
  } else if (dt instanceof Date) {
    return DateTime.fromISO(dt.toISOString())
  } else if (typeof dt === 'string') {
    return DateTime.fromISO(dt)
  } else if (typeof dt === 'number') {
    return DateTime.fromMillis(dt)
  } else {
    return null
  }
}

export function fmtDateTime (dt: DateTime | Date | string | number | null | undefined, format: FormatName, options?: Partial<FormatOptions>): string {
  const formatOptions = { ...FORMATS[format], ...options }

  dt = ensureDateTime(dt)

  if (dt) {
    let s: string

    if (formatOptions.format) s = dt.toFormat(formatOptions.format)
    else s = dt.toLocaleString(formatOptions as Intl.DateTimeFormatOptions)

    if (AFTER_FORMATS[format]) s = AFTER_FORMATS[format](s)

    return s
  } else {
    return ''
  }
}

export function dateFormatterGenerator (format: FormatName, options?: Partial<FormatOptions>) {
  return (dt: DateTime | Date | string | number | null | undefined, callOptions?: Partial<FormatOptions>) => fmtDateTime(dt, format, { ...options, ...callOptions })
}

export function fmtMinutesAsHM (minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60

  return `${h}h ${m}m`
}

export function fmtDateTimeISO (dt: DateTime | Date | string | number | null | undefined): string {
  dt = ensureDateTime(dt)

  return dt?.toUTC()?.toISO({suppressMilliseconds: true}) || ''
}

export function fmtDateTimeISOLocal (dt: DateTime | Date | string | number | null | undefined): string {
  dt = ensureDateTime(dt)

  return dt?.toLocal()?.toISO({suppressMilliseconds: true}) || ''
}

export const fmtContestTimestamp = dateFormatterGenerator('ContestTimestamp')
export const fmtContestTimestampZulu = dateFormatterGenerator('ContestTimestampZulu')
export const fmtMonthYear = dateFormatterGenerator('MonthYear')
export const fmtDateDayMonth = dateFormatterGenerator('DateDayMonth')
export const fmtNiceDateTime = dateFormatterGenerator('NiceDateTime')
export const fmtADIFDate = dateFormatterGenerator('ADIFDate')
export const fmtADIFTime = dateFormatterGenerator('ADIFTime')
export const fmtADIFDateTime = dateFormatterGenerator('ADIFDateTime')
export const fmtTimestamp = dateFormatterGenerator('Timestamp')

