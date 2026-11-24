import { describe, expect, it } from 'vitest'
import { conversionFactor, convertUnit, toDm3, toGrams } from './units'

describe('convertUnit', () => {
  it('converts volume without floating-point noise', () => {
    expect(convertUnit('volume', 250, 'cm3', 'dm3')).toBe(0.25)
    expect(convertUnit('volume', 0.1, 'dm3', 'cm3')).toBe(100)
    expect(convertUnit('volume', 1, 'L', 'dm3')).toBe(1)
    expect(convertUnit('volume', 2, 'm3', 'dm3')).toBe(2000)
  })

  it('converts mass and amount', () => {
    expect(convertUnit('mass', 1.5, 'kg', 'g')).toBe(1500)
    expect(convertUnit('mass', 500, 'mg', 'g')).toBe(0.5)
    expect(convertUnit('mass', 1, 'kg', 'mg')).toBe(1_000_000)
    expect(convertUnit('amount', 25, 'mmol', 'mol')).toBe(0.025)
  })

  it('has shortcuts to base units', () => {
    expect(toGrams(2, 'kg')).toBe(2000)
    expect(toDm3(480, 'cm3')).toBe(0.48)
  })
})

describe('conversionFactor', () => {
  it('describes the operation students should write', () => {
    expect(conversionFactor('volume', 'cm3', 'dm3')).toEqual({ op: 'divide', value: 1000 })
    expect(conversionFactor('volume', 'dm3', 'cm3')).toEqual({ op: 'multiply', value: 1000 })
    expect(conversionFactor('volume', 'dm3', 'L')).toBeNull()
  })
})
