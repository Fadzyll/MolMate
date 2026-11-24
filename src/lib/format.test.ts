import { describe, expect, it } from 'vitest'
import { formatNumber, formatText, parseNumber, toSuperscript } from './format'

describe('formatNumber', () => {
  it('uses scientific notation for very large and very small numbers', () => {
    expect(formatNumber(1.204e24)).toEqual({ coefficient: '1.2', exponent: 24 })
    expect(formatNumber(6.02e23)).toEqual({ coefficient: '6.02', exponent: 23 })
    expect(formatNumber(0.00025)).toEqual({ coefficient: '2.5', exponent: -4 })
  })

  it('shows ordinary numbers plainly, to 3 significant figures by default', () => {
    expect(formatNumber(0.2)).toEqual({ coefficient: '0.2', exponent: null })
    expect(formatNumber(14.625)).toEqual({ coefficient: '14.6', exponent: null })
    expect(formatNumber(2000)).toEqual({ coefficient: '2000', exponent: null })
    expect(formatNumber(1234, { sigFigs: 2 })).toEqual({ coefficient: '1200', exponent: null })
  })

  it('can keep trailing zeros', () => {
    expect(formatNumber(0.2, { trimZeros: false }).coefficient).toBe('0.200')
  })

  it('handles zero and non-finite values', () => {
    expect(formatNumber(0).coefficient).toBe('0')
    expect(formatNumber(Infinity).coefficient).toBe('—')
  })
})

describe('formatText', () => {
  it('writes the exponent as superscript', () => {
    expect(formatText(3.01e23)).toBe('3.01 × 10²³')
    expect(formatText(2.5e-4)).toBe('2.5 × 10⁻⁴')
    expect(formatText(0.5)).toBe('0.5')
  })
  it('toSuperscript', () => {
    expect(toSuperscript(-12)).toBe('⁻¹²')
  })
})

describe('parseNumber', () => {
  it.each([
    ['0.5', 0.5],
    ['.5', 0.5],
    [' 12 ', 12],
    ['1,000', 1000],
    ['6.02e23', 6.02e23],
    ['6.02E23', 6.02e23],
    ['6.02 x 10^23', 6.02e23],
    ['6.02×10^23', 6.02e23],
    ['6.02 * 10^23', 6.02e23],
    ['6.02 × 10²³', 6.02e23],
    ['3 x 10^-2', 0.03],
    ['2.5 × 10⁻⁴', 2.5e-4],
    ['10^23', 1e23],
  ])('parses %s', (input, expected) => {
    expect(parseNumber(input)).toBeCloseTo(expected, 10)
  })

  it.each(['', 'abc', '1.2.3', '5g', '1,00'])('rejects %j', (input) => {
    expect(parseNumber(input)).toBeNull()
  })
})
