const { DateTime } = require('luxon')
const { capitalizeFirstLetter } = require('./string')

// https://github.com/moment/luxon/blob/master/docs/formatting.md
const FORMATS = {
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

const AFTER_FORMATS = {
  ContestTimestampZulu: (str) => str.replace(' UTC', 'Z')
}

function ensureDateTime (dt) {
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

function fmtDateTime (dt, format, options) {
  const formatOptions = { ...FORMATS[format], ...options }

  dt = ensureDateTime(dt)

  if (dt) {
    let s

    if (formatOptions.format) s = dt.toFormat(formatOptions.format)
    else s = dt.toLocaleString(formatOptions)

    if (AFTER_FORMATS[format]) s = AFTER_FORMATS[format](s)

    return s
  } else {
    return ''
  }
}

function dateFormatterGenerator (format, options) {
  return (dt, callOptions) => fmtDateTime(dt, format, { ...options, ...callOptions })
}

function fmtMinutesAsHM (minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60

  return `${h}h ${m}m`
}

function fmtDateTimeISO (dt) {
  dt = ensureDateTime(dt)

  return dt?.toUTC()?.toISO({suppressMilliseconds: true}) || ''
}

function fmtDateTimeISOLocal (dt) {
  dt = ensureDateTime(dt)

  return dt?.toLocal()?.toISO({suppressMilliseconds: true}) || ''
}

module.exports = {
  ensureDateTime,
  dateFormatterGenerator,
  fmtDateTime,
  fmtMinutesAsHM,
  fmtDateTimeISO,
  fmtDateTimeISOLocal,
}

Object.entries(FORMATS).forEach ((pair) => {
  const [key, format] = pair
  const name = `fmt${capitalizeFirstLetter(key)}`
  module.exports[name] = dateFormatterGenerator(key)
})
