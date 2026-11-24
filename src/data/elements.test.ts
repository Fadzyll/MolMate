import { describe, expect, it } from 'vitest'
import { ELEMENTS, electronArrangement, getElement, groupOf, periodOf } from './elements'

describe('ELEMENTS', () => {
  it('has all 118 elements in order with unique symbols', () => {
    expect(ELEMENTS).toHaveLength(118)
    ELEMENTS.forEach((e, i) => expect(e.z).toBe(i + 1))
    expect(new Set(ELEMENTS.map((e) => e.symbol)).size).toBe(118)
    expect(ELEMENTS.every((e) => e.jar > 0 && e.nameEn && e.nameMs)).toBe(true)
  })

  it('uses the SPM-rounded JAR values', () => {
    const jar = (s: string) => getElement(s)!.jar
    expect(jar('H')).toBe(1)
    expect(jar('C')).toBe(12)
    expect(jar('O')).toBe(16)
    expect(jar('Na')).toBe(23)
    expect(jar('Mg')).toBe(24)
    expect(jar('Cl')).toBe(35.5)
    expect(jar('K')).toBe(39)
    expect(jar('Ca')).toBe(40)
    expect(jar('Fe')).toBe(56)
    expect(jar('Cu')).toBe(64)
    expect(jar('Zn')).toBe(65)
    expect(jar('Ag')).toBe(108)
    expect(jar('Pb')).toBe(207)
  })

  it('electrons equal the proton number', () => {
    expect(getElement('Na')!.electrons).toBe(11)
    expect(ELEMENTS.every((e) => e.electrons === e.z)).toBe(true)
  })

  it('has Malay names', () => {
    expect(getElement('Na')!.nameMs).toBe('Natrium')
    expect(getElement('Fe')!.nameMs).toBe('Ferum')
    expect(getElement('Cu')!.nameMs).toBe('Kuprum')
  })

  it('assigns categories', () => {
    expect(getElement('Na')!.category).toBe('alkali')
    expect(getElement('Cl')!.category).toBe('halogen')
    expect(getElement('Ar')!.category).toBe('nobleGas')
    expect(getElement('Fe')!.category).toBe('transition')
    expect(getElement('Si')!.category).toBe('metalloid')
    expect(getElement('U')!.category).toBe('actinide')
    expect(getElement('H')!.category).toBe('nonmetal')
  })
})

describe('positions', () => {
  it.each([
    [1, 1, 1],
    [2, 1, 18],
    [6, 2, 14],
    [11, 3, 1],
    [17, 3, 17],
    [26, 4, 8],
    [54, 5, 18],
    [56, 6, 2],
    [57, 6, null],
    [71, 6, null],
    [72, 6, 4],
    [86, 6, 18],
    [92, 7, null],
    [104, 7, 4],
    [118, 7, 18],
  ])('Z=%i is period %i group %s', (z, period, group) => {
    expect(periodOf(z)).toBe(period)
    expect(groupOf(z)).toBe(group)
  })
})

describe('electronArrangement', () => {
  it.each([
    [1, '1'],
    [2, '2'],
    [8, '2.6'],
    [11, '2.8.1'],
    [18, '2.8.8'],
    [19, '2.8.8.1'],
    [20, '2.8.8.2'],
  ])('Z=%i → %s', (z, arrangement) => {
    expect(electronArrangement(z)).toBe(arrangement)
  })
  it('is only given up to calcium', () => {
    expect(electronArrangement(21)).toBeNull()
  })
})
