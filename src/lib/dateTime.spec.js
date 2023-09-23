const {
  dateFormatterGenerator, fmtDateTime, fmtContestTimestamp, fmtContestTimestampZulu, fmtMonthYear, fmtNiceDateTime,
  fmtDateISO, fmtTimeISO, fmtDateTimeISO,
} = require('./dateTime')

describe('Date Time Formatting', () => {
  describe('fmtDateTime', () => {
    it('should format a timestamp', () => {
      expect(fmtDateTime("2023-01-02T21:22:23+00:00", "MonthYear")).toEqual("January 2023")
    })

    it('should format a timestamp with options', () => {
      expect(fmtDateTime("2023-01-02T21:22:23+00:00", "MonthYear", {month: "short", day: "numeric"})).toEqual("Jan 2, 2023")
    })
  })

  describe("dateFormatterGenerator", () => {
    it('should generate a formatting function', () => {
      const fmt = dateFormatterGenerator('MonthYear')

      expect(typeof fmt).toEqual('function')
      expect(fmt("2023-01-02T21:22:23+00:00")).toEqual("January 2023")
    })

    it('should accept options to modofy the format definition', () => {
      const fmt = dateFormatterGenerator('MonthYear', {month: "short", day: "numeric"})

      expect(typeof fmt).toEqual('function')
      expect(fmt("2023-01-02T21:22:23+00:00")).toEqual("Jan 2, 2023")
    })
  })

  describe('Date Time Formats', () => {

    describe('fmtContestTimestamp', () => {
      it('should format a timestamp', () => {
        expect(fmtContestTimestamp("2023-01-02T21:22:23+00:00")).toEqual("Mon, 16:22 EST")
      })
    })

    describe('fmtContestTimestampZulu', () => {
      it('should format a timestamp', () => {
        expect(fmtContestTimestampZulu("2023-01-02T21:22:23+00:00")).toEqual("Mon, 21:22Z")
      })
    })

    describe('fmtMonthYear', () => {
      it('should format a timestamp', () => {
        expect(fmtMonthYear("2023-01-02T21:22:23+00:00")).toEqual("January 2023")
      })
    })

    describe('fmtNiceDateTime', () => {
      it('should format a timestamp', () => {
        expect(fmtNiceDateTime("2023-01-02T21:22:23+00:00")).toEqual("Mon, January 2, 2023, 4:22 PM EST")
      })
    })

    describe('ISO Formats', () => {

      describe('fmtDateISO', () => {
        it('should format a timestamp', () => {
          expect(fmtDateISO("2023-01-02T21:22:23+00:00")).toEqual("2023-01-02")
        })
      })

      describe('fmtTimeISO', () => {
        it('should format a timestamp', () => {
          expect(fmtTimeISO("2023-01-02T21:22:23+00:00")).toEqual("16:22:23.000-05:00")
        })
      })

      describe('fmtDateTimeISO', () => {
        it('should format a timestamp', () => {
          expect(fmtDateTimeISO("2023-01-02T21:22:23+00:00")).toEqual("2023-01-02T16:22:23.000-05:00")
        })
      })
    })
  })
})
