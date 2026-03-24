import {
  fmtGigabytes,
  fmtInteger,
  fmtMegabytes,
  fmtNumber,
  fmtOneDecimal,
  fmtPercent
} from './number'

describe('fmtNumber', () => {
  it('formats numbers with the default style', () => {
    expect(fmtNumber(1234)).toMatch(/1.*234/)
  })

  it('parses string input', () => {
    expect(fmtNumber('99.5')).toMatch(/99/)
  })
})

describe('fmtInteger', () => {
  it('formats with no fraction digits', () => {
    expect(fmtInteger(42)).toBe('42')
    expect(fmtInteger(1000)).toMatch(/1.*000/)
  })

  it('returns empty string for empty / invalid numeric string', () => {
    expect(fmtInteger('')).toBe('')
  })
})

describe('fmtOneDecimal', () => {
  it('formats with a single fraction digit', () => {
    expect(fmtOneDecimal(3.14159)).toMatch(/^3\.1/)
  })
})

describe('fmtPercent', () => {
  it('multiplies by 100 and appends a percent sign', () => {
    expect(fmtPercent(0.5)).toMatch(/50/)
    expect(fmtPercent(0.5)).toContain('%')
  })

  it('accepts string input', () => {
    expect(fmtPercent('0.25')).toMatch(/25/)
  })
})

describe('fmtMegabytes', () => {
  it('converts bytes to megabytes with one decimal', () => {
    expect(fmtMegabytes(1024 * 1024)).toMatch(/1\.0/)
    expect(fmtMegabytes(1024 * 1024)).toContain('MB')
  })
})

describe('fmtGigabytes', () => {
  it('converts bytes to gigabytes with one decimal', () => {
    expect(fmtGigabytes(2 * 1024 * 1024 * 1024)).toMatch(/2\.0/)
    expect(fmtGigabytes(2 * 1024 * 1024 * 1024)).toContain('GB')
  })
})
