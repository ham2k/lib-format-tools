const {
  ensureDateTime, dateFormatterGenerator, fmtDateTime,
  fmtContestTimestamp, fmtContestTimestampZulu, fmtMonthYear, fmtNiceDateTime,
  fmtDateTimeISO, fmtDateTimeISOLocal,
} = require('./dateTime')

const dateStr = "2023-01-02T02:22:23+00:00"
const dateStrET = "2023-01-01T21:22:23-05:00"
const dateStrZ = "2023-01-02T02:22:23Z"
const dateStrETMillis = "2023-01-01T21:22:23.000-05:00" // Added Milliseconds
const date = new Date(Date.parse(dateStr))

describe('Date Time Formatting', () => {
  describe('ensureDateTime', () => {

    it('should accept Luxon DateTime objects, and pass them back unmodified', () => {
      const dt = ensureDateTime(dateStr)
      expect(ensureDateTime(dt)).toEqual(dt)
      expect(dt.toISO()).toEqual(dateStrETMillis)
    })

    it('should accept ISO strings', () => {
      expect(ensureDateTime(date).toISO()).toEqual(dateStrETMillis)
    })

    it('should accept milliseconds', () => {
      expect(ensureDateTime(date.valueOf()).toISO()).toEqual(dateStrETMillis)
    })

    it('should accept Date objects', () => {
      expect(ensureDateTime(date).toISO()).toEqual(dateStrETMillis)
    })
  })

  describe('fmtDateTime', () => {
    it('should format a timestamp', () => {
      expect(fmtDateTime(dateStr, "MonthYear")).toEqual("January 2023")
    })

    it('should format a timestamp from milliseconds', () => {
      expect(fmtDateTime(date.valueOf(), "MonthYear")).toEqual("January 2023")
    })

    it('should format a timestamp from a date object', () => {
      expect(fmtDateTime(date, "MonthYear")).toEqual("January 2023")
    })

    it('should format a timestamp with options', () => {
      expect(fmtDateTime(dateStr, "MonthYear", {month: "short", day: "numeric"})).toEqual("Jan 1, 2023")
    })
  })

  describe("dateFormatterGenerator", () => {
    it('should generate a formatting function', () => {
      const fmt = dateFormatterGenerator('MonthYear')

      expect(typeof fmt).toEqual('function')
      expect(fmt(dateStr)).toEqual("January 2023")
    })

    it('should accept options to modify the format definition', () => {
      const fmt = dateFormatterGenerator('MonthYear', {month: "short", day: "numeric"})

      expect(typeof fmt).toEqual('function')
      expect(fmt(dateStr)).toEqual("Jan 1, 2023")
    })
  })

  describe('Date Time Formats', () => {

    describe('fmtContestTimestamp', () => {
      it('should format a timestamp', () => {
        expect(fmtContestTimestamp(dateStr)).toEqual("Sun, 21:22 EST")
      })
    })

    describe('fmtContestTimestampZulu', () => {
      it('should format a timestamp', () => {
        expect(fmtContestTimestampZulu(dateStr)).toEqual("Mon, 02:22Z")
      })
    })

    describe('fmtMonthYear', () => {
      it('should format a timestamp', () => {
        expect(fmtMonthYear(dateStr)).toEqual("January 2023")
      })
    })

    describe('fmtNiceDateTime', () => {
      it('should format a timestamp', () => {
        expect(fmtNiceDateTime(dateStr)).toEqual("Sun, January 1, 2023, 9:22 PM EST")
      })
    })

    describe('ISO Formats', () => {
      describe('fmtDateTimeISO', () => {
        it('should format a timestamp', () => {
          expect(fmtDateTimeISO(dateStr)).toEqual(dateStrZ)
        })
      })

      describe('fmtDateTimeISOLocal', () => {
        it('should format a timestamp', () => {
          expect(fmtDateTimeISOLocal(dateStr)).toEqual(dateStrET)
        })
      })
    })
  })
})
