import { defaultI18N } from './i18n'

type FlexibleTimeValue = number | string | Date

export function prepareDateValue(t: FlexibleTimeValue): Date | undefined {
  switch (typeof t) {
    case 'object':
      if (t instanceof Date) {
        return t
      } else {
        return undefined
      }
    case 'number':
    case 'string':
      return new Date(t)
    case 'undefined':
      return new Date()
    default:
      return undefined
  }
}

const FALLBACK_WEEKDAY: Record<number, string> = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday'
}

const FALLBACK_WEEKDAY_ABBR: Record<number, string> = {
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
  7: 'Sun'
}

const FALLBACK_DAY_ORD: Record<number, string> = {
  1: '1st',
  2: '2nd',
  3: '3rd',
  4: '4th',
  5: '5th',
  6: '6th',
  7: '7th',
  8: '8th',
  9: '9th',
  10: '10th',
  11: '11th',
  12: '12th',
  13: '13th',
  14: '14th',
  15: '15th',
  16: '16th',
  17: '17th',
  18: '18th',
  19: '19th',
  20: '20th',
  21: '21st',
  22: '22nd',
  23: '23rd',
  24: '24th',
  25: '25th',
  26: '26th',
  27: '27th',
  28: '28th',
  29: '29th',
  30: '30th',
  31: '31st',
}

const FALLBACK_MONTH_ABBR: Record<number, string> = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec'
}

const FALLBACK_MONTH: Record<number, string> = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December'
}

type DateTimeInterpolationParts = {
  upperZulu: string
  lowerZulu: string
  hours: number
  hours12: number
  hoursZero: string
  minutes: number
  minutesZero: string
  seconds: number
  secondsZero: string
  ampm: string
  ampmLower: string
  day: number
  dayZero: string
  dayOrd: string
  weekdayNumber: number
  weekday: string
  weekdayAbbr: string
  month: number
  monthZero: string
  monthName: string
  monthAbbr: string
  year: number
}
export function dateTimeInterpolationParts(d: Date, { utc }: { utc?: boolean } = {}): DateTimeInterpolationParts {
  const hours = utc ? d.getUTCHours() : d.getHours()
  const minutes = utc ? d.getUTCMinutes() : d.getMinutes()
  const seconds = utc ? d.getUTCSeconds() : d.getSeconds()
  const weekdayNumberSundayZero = ((utc ? d.getUTCDay() : d.getDay()) + 1 % 7) - 1
  const weekdayNumber = weekdayNumberSundayZero === 0 ? 7 : weekdayNumberSundayZero
  const month = (utc ? d.getUTCMonth() : d.getMonth()) + 1
  const day = utc ? d.getUTCDate() : d.getDate()
  const year = utc ? d.getUTCFullYear() : d.getFullYear()

  return {
    upperZulu: utc ? 'Z' : '',
    lowerZulu: utc ? 'z' : '',
    hours,
    hours12: hours % 12 || 12,
    hoursZero: hours.toString().padStart(2, '0'),
    minutes,
    minutesZero: minutes.toString().padStart(2, '0'),
    seconds,
    secondsZero: seconds.toString().padStart(2, '0'),
    ampm: hours < 12 ? 'AM' : 'PM',
    ampmLower: hours < 12 ? 'am' : 'pm',
    day,
    dayZero: day.toString().padStart(2, '0'),
    dayOrd: defaultI18N.t(`general.formatting.dayOrd.${day}`, FALLBACK_DAY_ORD[day]),
    weekdayNumber,
    weekday: defaultI18N.t(`general.formatting.weekday.${weekdayNumber}`, FALLBACK_WEEKDAY[weekdayNumber]),
    weekdayAbbr: defaultI18N.t(`general.formatting.weekdayAbbr.${weekdayNumber}`, FALLBACK_WEEKDAY_ABBR[weekdayNumber]),
    month,
    monthZero: month.toString().padStart(2, '0'),
    monthName: defaultI18N.t(`general.formatting.month.${month}`, FALLBACK_MONTH[month]),
    monthAbbr: defaultI18N.t(`general.formatting.monthAbbr.${month}`, FALLBACK_MONTH_ABBR[month]),
    year,
  }
}

export function fmtShortTimeZulu(t: FlexibleTimeValue, { showZ }: { showZ?: boolean } = {}): string {
  if (showZ !== false) showZ = true

  const d = prepareDateValue(t)

  if (d) {
    return d.toISOString().substring(11, 16) + (showZ ? 'z' : '')
  } else {
    return ''
  }
}

export function fmtTimeZulu(t: FlexibleTimeValue, { showZ, compact }: { showZ?: boolean, compact?: boolean } = {}): string {
  const d = prepareDateValue(t)

  if (showZ !== false) showZ = true

  if (d) {
    if (compact) {
      return d.toISOString().substring(11, 16) + (showZ ? 'z' : '')
    } else {
      return d.toISOString().substring(11, 19) + (showZ ? 'z' : '')
    }
  } else {
    return ''
  }
}

export function fmtDateZulu(t: FlexibleTimeValue): string {
  const d = prepareDateValue(t)

  if (d) {
    return d.toISOString().substring(0, 10)
  } else {
    return ''
  }
}

export function fmtDateTimeDynamic(t: FlexibleTimeValue, { now, compact, utc }: { now?: Date, compact?: boolean, utc?: boolean } = {}): string {
  const d = prepareDateValue(t)

  if (d) {
    if (now === undefined) now = new Date()
    const diffInDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    const interpolation = dateTimeInterpolationParts(d, { utc }) as unknown as Record<string, string>
    interpolation.time = defaultI18N.t('general.formatting.time.short', `${interpolation.hoursZero}:${interpolation.minutesZero}${interpolation.lowerZulu}`)

    if (diffInDays < 1) {
      if (compact) {
        return defaultI18N.t(`general.formatting.dateTime.varShortUnder1Day`, '{{time}}', interpolation)
      } else {
        return defaultI18N.t(`general.formatting.dateTime.varUnder1Day`, '{{time}} {{weekday}} {{dayOrd}}', interpolation)
      }
    } else if (diffInDays <= 7) {
      if (compact) {
        return defaultI18N.t(`general.formatting.dateTime.varShortUnder7Days`, '{{time}} {{weekdayAbbr}} {{day}}', interpolation)
      } else {
        return defaultI18N.t(`general.formatting.dateTime.varUnder7Days`, '{{time}} {{weekday}} {{dayOrd}}', interpolation)
      }
    } else if (diffInDays <= 274) { // 9 months
      if (compact) {
        return defaultI18N.t(`general.formatting.dateTime.varShortUnder9Months`, '{{time}} {{monthAbbr}} {{day}}', interpolation)
      } else {
        return defaultI18N.t(`general.formatting.dateTime.varUnder9Months`, '{{time}} {{monthName}} {{dayOrd}}', interpolation)
      }
    } else {
      if (compact) {
        return defaultI18N.t(`general.formatting.dateTime.varShortOver9Months`, '{{time}} {{monthAbbr}} {{day}} {{year}}', interpolation)
      } else {
        return defaultI18N.t(`general.formatting.dateTime.varOver9Months`, '{{time}} {{monthName}} {{dayOrd}} {{year}}', interpolation)
      }
    }
  } else {
    return ''
  }
}

export function fmtDateTimeDynamicZulu(t: FlexibleTimeValue, { now, compact }: { now?: Date, compact?: boolean } = {}): string {
  return fmtDateTimeDynamic(t, { now, compact, utc: true })
}

export function fmtDateDynamic(t: FlexibleTimeValue, { now, compact, utc }: { now?: Date, compact?: boolean, utc?: boolean } = {}): string {
  const d = prepareDateValue(t)

  if (d) {
    if (now === undefined) now = new Date()
    const diffInDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    const absDiffInDays = Math.abs(diffInDays)
    const interpolation = dateTimeInterpolationParts(d, { utc }) as unknown as Record<string, string>

    if (diffInDays > -1 && diffInDays <= 0) {
      return defaultI18N.t('general.formatting.time.tomorrow', 'Tomorrow')
    } else if (diffInDays > 0 && diffInDays <= 1) {
      return defaultI18N.t('general.formatting.time.today', 'Today')
    } else if (diffInDays <= 2) {
      return defaultI18N.t('general.formatting.time.yesterday', 'Yesterday')
    } else if (absDiffInDays <= 7) {
      if (compact) {
        return defaultI18N.t(`general.formatting.date.varShortUnder7Days`, '{{weekdayAbbr}} {{day}}', interpolation)
      } else {
        return defaultI18N.t(`general.formatting.date.varUnder7Days`, '{{weekday}} {{dayOrd}}', interpolation)
      }
    } else if (absDiffInDays <= 274) { // 9 months
      if (compact) {
        return defaultI18N.t(`general.formatting.date.varShortUnder9Months`, '{{monthAbbr}} {{day}}', interpolation)
      } else {
        return defaultI18N.t(`general.formatting.date.varUnder9Months`, '{{monthName}} {{dayOrd}}', interpolation)
      }
    } else {
      if (compact) {
        return defaultI18N.t(`general.formatting.date.varShortOver9Months`, '{{monthAbbr}} {{day}} {{year}}', interpolation)
      } else {
        return defaultI18N.t(`general.formatting.date.varOver9Months`, '{{monthName}} {{year}}', interpolation)
      }
    }
  } else {
    return ''
  }
}

export function fmtDateDynamicZulu(t: FlexibleTimeValue, { now, compact }: { now?: Date, compact?: boolean } = {}): string {
  return fmtDateDynamic(t, { now, compact, utc: true })
}

export function fmtDateTimeNice(t: FlexibleTimeValue, { utc }: { utc?: boolean } = {}): string {
  const d = prepareDateValue(t)

  if (d) {
    const interpolation = dateTimeInterpolationParts(d, { utc }) as unknown as Record<string, string>
    interpolation.time = defaultI18N.t('general.formatting.time.short', `${interpolation.hoursZero}:${interpolation.minutesZero}${interpolation.lowerZulu}`)

    return defaultI18N.t(`general.formatting.dateTime.nice`, '{{time}} {{month}} {{dayOrd}} {{year}}', interpolation) || `${interpolation.time} ${interpolation.month} ${interpolation.dayOrd}, ${interpolation.year}`
  } else {
    return ''
  }
}

export function fmtDateTimeNiceZulu(t: FlexibleTimeValue) {
  return fmtDateTimeNice(t, { utc: true })
}

export function fmtDateNice(t: FlexibleTimeValue, { utc }: { utc?: boolean } = {}) {
  const d = prepareDateValue(t)

  if (d) {
    const interpolation = dateTimeInterpolationParts(d, { utc }) as unknown as Record<string, string>

    return defaultI18N.t('general.formatting.date.nice', '{{monthName}} {{dayOrd}}, {{year}}', interpolation)
  } else {
    return ''
  }
}

export function fmtDateNiceZulu(t: FlexibleTimeValue) {
  return fmtDateNice(t, { utc: true })
}

export function fmtDateFull(t: FlexibleTimeValue, { compact, utc }: { compact?: boolean, utc?: boolean } = {}) {
  const d = prepareDateValue(t)

  if (d) {
    const interpolation = dateTimeInterpolationParts(d, { utc }) as unknown as Record<string, string>

    if (compact) {
      return defaultI18N.t('general.formatting.date.fullShort', '{{weekdayAbbr}} {{monthAbbr}} {{day}}, {{year}}', interpolation)
    }
    else {
      return defaultI18N.t('general.formatting.date.full', '{{weekday}} {{month}} {{dayOrd}}, {{year}}', interpolation)
    }
  } else {
    return ''
  }
}

export function fmtDateFullZulu(t: FlexibleTimeValue, { compact }: { compact?: boolean } = {}) {
  return fmtDateFull(t, { compact, utc: true })
}

export function fmtDateTimeRelative(t: FlexibleTimeValue, { now, roundTo }: { now?: Date, roundTo?: 'minutes' | 'hours' } = {}) {
  const d = prepareDateValue(t)

  if (d) {
    if (now === undefined) now = new Date()
    if (d < now) {
      const time = fmtTimeBetween(d, now, { roundTo })
      return defaultI18N.t('general.formatting.time.ago', '{{time}} ago', { time })
    } else {
      const time = fmtTimeBetween(d, now, { roundTo })
      return defaultI18N.t('general.formatting.time.fromNow', '{{time}} from now', { time })
    }
  } else {
    return ''
  }
}

export function fmtTimestamp(t: FlexibleTimeValue) {
  const d = prepareDateValue(t)

  if (d) {
    return d.toISOString().substring(0, 19).replace(/[-:T]/g, '')
  } else {
    return ''
  }
}

export function fmtADIFDate(t: FlexibleTimeValue) {
  const d = prepareDateValue(t)

  if (d) {
    return d.toISOString().substring(0, 10).replace(/-/g, '')
  } else {
    return ''
  }
}

export function fmtADIFTime(t: FlexibleTimeValue) {
  const d = prepareDateValue(t)

  if (d) {
    return d.toISOString().substring(11, 19).replace(/:/g, '')
  } else {
    return ''
  }
}

export function fmtADIFDateTime(t: FlexibleTimeValue) {
  const d = prepareDateValue(t)

  if (d) {
    return d.toISOString().substring(0, 19).replace(/[-:T]/g, '')
  } else {
    return ''
  }
}

export function fmtCabrilloDate(t: FlexibleTimeValue) {
  const d = prepareDateValue(t)

  if (d) {
    return d.toISOString().substring(0, 10)
  } else {
    return ''
  }
}

export function fmtCabrilloTime(t: FlexibleTimeValue) {
  return fmtADIFTime(t).substring(0, 4)
}

export function fmtISODate(t: FlexibleTimeValue) {
  const d = prepareDateValue(t)

  if (d) {
    return d.toISOString().substring(0, 10)
  } else {
    return ''
  }
}

export function fmtISODateTime(t: FlexibleTimeValue) {
  const d = prepareDateValue(t)

  if (d) {
    return d.toISOString().substring(0, 19) + 'Z'
  } else {
    return ''
  }
}

export function fmtTimeBetween(t1: FlexibleTimeValue, t2: FlexibleTimeValue, { roundTo }: { roundTo?: 'minutes' | 'hours' } = {}) {
  const d1 = prepareDateValue(t1)
  const d2 = prepareDateValue(t2)

  if (d1 && d2) {
    let diff = d2.getTime() - d1.getTime()

    if (roundTo === 'minutes') {
      diff = Math.round(diff / (60 * 1000)) * (60 * 1000)
    } else if (roundTo === 'hours') {
      diff = Math.round(diff / (60 * 60 * 1000)) * (60 * 60 * 1000)
    }

    if (diff < 0) {
      return ''
    } else if (diff < 1000) {
      return defaultI18N.t('general.formatting.time.shortSeconds', '{{s}}s', { s: '0' })
    } else if (diff < 60 * 1000) {
      const s = Math.floor(diff / 1000).toString()
      return defaultI18N.t('general.formatting.time.shortSeconds', '{{s}}s', { s })
    } else if (diff < 60 * 60 * 1000) {
      if (roundTo === 'minutes') {
        const m = Math.floor(diff / (60 * 1000)).toString()
        return defaultI18N.t('general.formatting.time.shortMinutes', '{{m}}m', { m })
      } else {
        const m = Math.floor(diff / (60 * 1000)).toString()
        const s = Math.floor((diff % (60 * 1000)) / 1000).toString()
        return defaultI18N.t('general.formatting.time.shortMinutesAndSeconds', '{{m}}m {{s}}s', { m, s })
      }
    } else if (diff < 1000 * 60 * 60 * 24) {
      if (roundTo === 'hours') {
        const h = Math.floor(diff / (60 * 60 * 1000)).toString()
        return defaultI18N.t('general.formatting.time.shortHours', '{{h}}h', { h })
      } else {
        const h = Math.floor(diff / (60 * 60 * 1000)).toString()
        const m = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000)).toString()
        return defaultI18N.t('general.formatting.time.shortHoursAndMinutes', '{{h}}h {{m}}m', { h, m })
      }
    } else {
      const d = Math.floor(diff / (60 * 60 * 24 * 1000)).toString()
      const h = Math.floor((diff % (60 * 60 * 24 * 1000)) / (60 * 60 * 1000)).toString()
      return defaultI18N.t('general.formatting.time.shortDaysAndHours', '{{d}}d {{h}}h', { d, h })
    }
  } else {
    return ''
  }
}

export function fmtDateTimeNiceRange(t1: FlexibleTimeValue, t2: FlexibleTimeValue, { utc }: { utc?: boolean } = {}) {
  const d1 = prepareDateValue(t1)
  const d2 = prepareDateValue(t2)

  if (d1 && d2) {
    const interpolation = {
      niceTime1: fmtDateTimeNice(d1, { utc }),
      niceTime2: fmtDateTimeNice(d2, { utc }),
    }
    return defaultI18N.t('general.formatting.dateTime.niceRange', '{{niceTime1}} - {{niceTime2}}', interpolation)
  } else {
    return ''
  }
}

