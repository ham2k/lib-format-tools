const { DateTime } = require("luxon")

const FORMATS = {
  contestTimestamp: {
    hourCycle: "h23",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  },
  contestTimestampZulu: {
    hourCycle: "h23",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
    timeZone: "Zulu",
  },
  monthYear: {
    year: "numeric",
    month: "long",
  },
  dayMonth: {
    day: "numeric",
    month: "long",
  },
  niceDateTime: {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  },
}

const AFTER_FORMATS = {
  contestTimestampZulu: (str) => str.replace(" UTC", "Z"),
}

function dateFormatterGenerator(format, options) {
  let formatOptions = { ...FORMATS[format], ...options }
  return (dt) => {
    if (dt instanceof Date) {
      dt = DateTime.fromISO(dt.toISOString())
    } else if (typeof dt === "string") {
      dt = DateTime.fromISO(dt)
    } else if (typeof dt === "number") {
      dt = DateTime.fromMillis(dt)
    }
    if (dt) {
      let s = dt.toLocaleString(formatOptions)
      if (AFTER_FORMATS[format]) s = AFTER_FORMATS[format](s)

      return s
    } else {
      return ""
    }
  }
}

function fmtDateTime(dt, format) {
  if (typeof dt === "string") {
    dt = DateTime.fromISO(dt)
  } else if (typeof dt === "number") {
    dt = DateTime.fromMillis(dt)
  }

  if (dt) {
    let s = dt.toLocaleString(FORMATS[format] ?? format)
    if (AFTER_FORMATS[format]) s = AFTER_FORMATS[format](s)

    return s
  } else {
    return ""
  }
}

const fmtContestTimestamp = dateFormatterGenerator("contestTimestamp")
const fmtContestTimestampZulu = dateFormatterGenerator("contestTimestampZulu")
const fmtDateMonthYear = dateFormatterGenerator("monthYear")
const fmtDateTimeNice = dateFormatterGenerator("niceDateTime")
const fmtDateDayMonth = dateFormatterGenerator("dayMonth")

function fmtMinutesAsHM(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60

  return `${h}h ${m}m`
}

module.exports = {
  dateFormatterGenerator,
  fmtDateTime,
  fmtContestTimestamp,
  fmtContestTimestampZulu,
  fmtDateMonthYear,
  fmtMinutesAsHM,
  fmtDateTimeNice,
  fmtDateDayMonth,
}
