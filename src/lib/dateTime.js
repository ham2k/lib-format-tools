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
  }
}

const AFTER_FORMATS = {
  contestTimestampZulu: (str) => str.replace(' UTC', 'Z')
}

function fmtDateTime (dt, format, options) {
  const formatOptions = { ...FORMATS[format], ...options }

  if (dt instanceof Date) {
    dt = DateTime.fromISO(dt.toISOString())
  } else if (typeof dt === 'string') {
    dt = DateTime.fromISO(dt)
  } else if (typeof dt === 'number') {
    dt = DateTime.fromMillis(dt)
  }
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

// const fmtContestTimestamp = dateFormatterGenerator('contestTimestamp')
// const fmtContestTimestampZulu = dateFormatterGenerator('contestTimestampZulu')
// const fmtDateMonthYear = dateFormatterGenerator('monthYear')
// const fmtDateTimeNice = dateFormatterGenerator('niceDateTime')
// const fmtDateDayMonth = dateFormatterGenerator('dayMonth')

function fmtMinutesAsHM (minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60

  return `${h}h ${m}m`
}

function fmtDateTimeISO (dt) {
  if (typeof dt === 'string') {
    dt = DateTime.fromISO(dt)
  } else if (typeof dt === 'number') {
    dt = DateTime.fromMillis(dt)
  }

  if (dt) {
    return dt.toISO()
  } else {
    return ''
  }
}

function fmtDateISO (dt) {
  if (typeof dt === 'string') {
    dt = DateTime.fromISO(dt)
  } else if (typeof dt === 'number') {
    dt = DateTime.fromMillis(dt)
  }

  if (dt) {
    return dt.toISODate()
  } else {
    return ''
  }
}

function fmtTimeISO (dt) {
  if (typeof dt === 'string') {
    dt = DateTime.fromISO(dt)
  } else if (typeof dt === 'number') {
    dt = DateTime.fromMillis(dt)
  }

  if (dt) {
    return dt.toISOTime()
  } else {
    return ''
  }
}


module.exports = {
  dateFormatterGenerator,
  fmtDateTime,
  fmtMinutesAsHM,
  fmtDateTimeISO,
  fmtDateISO,
  fmtTimeISO
}

Object.entries(FORMATS).forEach ((pair) => {
  const [key, format] = pair
  const name = `fmt${capitalizeFirstLetter(key)}`
  module.exports[name] = dateFormatterGenerator(key)
})
