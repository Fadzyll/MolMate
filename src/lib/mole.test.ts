import { describe, expect, it } from 'vitest'
import {
  AVOGADRO,
  MOLAR_VOLUME,
  MoleInputError,
  convert,
  massFromMoles,
  molarMassFrom,
  molarVolumeFrom,
  molesFromMass,
  molesFromParticles,
  molesFromVolume,
  particlesFromMoles,
  volumeFromMoles,
} from './mole'

describe('mol ⇄ particles', () => {
  it('0.5 mol contains 3.01 × 10²³ particles', () => {
    expect(particlesFromMoles(0.5)).toBeCloseTo(3.01e23, -20)
  })
  it('1.204 × 10²⁴ particles is 2 mol', () => {
    expect(molesFromParticles(1.204e24)).toBeCloseTo(2)
  })
})

describe('mol ⇄ mass', () => {
  it('8.8 g of CO₂ (M = 44) is 0.2 mol', () => {
    expect(molesFromMass(8.8, 44)).toBeCloseTo(0.2)
  })
  it('0.25 mol of NaCl (M = 58.5) is 14.625 g', () => {
    expect(massFromMoles(0.25, 58.5)).toBeCloseTo(14.625)
  })
  it('molar mass from 9 g and 0.5 mol is 18', () => {
    expect(molarMassFrom(9, 0.5)).toBe(18)
  })
})

describe('mol ⇄ gas volume', () => {
  it('uses 24 dm³ mol⁻¹ at room conditions and 22.4 at STP', () => {
    expect(MOLAR_VOLUME.room).toBe(24)
    expect(MOLAR_VOLUME.stp).toBe(22.4)
  })
  it('12 dm³ at room conditions is 0.5 mol', () => {
    expect(molesFromVolume(12, MOLAR_VOLUME.room)).toBe(0.5)
  })
  it('2 mol at STP is 44.8 dm³', () => {
    expect(volumeFromMoles(2, MOLAR_VOLUME.stp)).toBeCloseTo(44.8)
  })
  it('molar volume from 4.8 dm³ and 0.2 mol is 24', () => {
    expect(molarVolumeFrom(4.8, 0.2)).toBeCloseTo(24)
  })
})

describe('validation', () => {
  it('rejects zero, negative and non-numeric input', () => {
    expect(() => molesFromMass(0, 44)).toThrow(MoleInputError)
    expect(() => molesFromMass(-1, 44)).toThrow(MoleInputError)
    expect(() => molesFromParticles(NaN)).toThrow(MoleInputError)
    expect(() => molesFromVolume(5, 0)).toThrow(MoleInputError)
  })
})

describe('chain conversions', () => {
  it('mass → particles: 3.2 g of O₂ (M = 32) has 6.02 × 10²² molecules', () => {
    const r = convert('mass', 'particles', 3.2, { molarMass: 32 })
    expect(r.value).toBeCloseTo(6.02e22, -19)
    expect(r.steps).toHaveLength(2)
    expect(r.steps[0]).toMatchObject({ from: 'mass', to: 'mole', op: 'divide', factor: 'molarMass' })
    expect(r.steps[0].output).toBeCloseTo(0.1)
    expect(r.steps[1]).toMatchObject({ from: 'mole', to: 'particles', op: 'multiply', factor: 'avogadro' })
  })

  it('volume → mass: 6 dm³ of CO₂ at room conditions is 11 g', () => {
    const r = convert('volume', 'mass', 6, { molarMass: 44 })
    expect(r.value).toBeCloseTo(11)
  })

  it('volume uses STP when given', () => {
    expect(convert('volume', 'mole', 11.2, { molarVolume: MOLAR_VOLUME.stp }).value).toBeCloseTo(0.5)
  })

  it('single-step conversions return one step', () => {
    const r = convert('mole', 'particles', 2)
    expect(r.value).toBe(2 * AVOGADRO)
    expect(r.steps).toHaveLength(1)
  })

  it('needs a molar mass for mass conversions', () => {
    expect(() => convert('mass', 'mole', 10)).toThrow(/Molar mass/)
  })

  it('rejects converting a quantity to itself', () => {
    expect(() => convert('mole', 'mole', 1)).toThrow(MoleInputError)
  })
})
