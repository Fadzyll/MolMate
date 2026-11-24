import { describe, expect, it } from 'vitest'
import { FormulaError, breakdownText, normaliseFormula, parseFormula, tryParseFormula } from './formula'

describe('parseFormula — relative masses (SPM JAR values)', () => {
  it.each([
    ['H2O', 18],
    ['CO2', 44],
    ['O2', 32],
    ['NH3', 17],
    ['NaCl', 58.5],
    ['H2SO4', 98],
    ['CaCO3', 100],
    ['MgO', 40],
    ['Ca(OH)2', 74],
    ['Al2(SO4)3', 342],
    ['(NH4)2SO4', 132],
    ['AlCl3', 133.5],
    ['CuSO4·5H2O', 250],
    ['CuSO4.5H2O', 250],
    ['Na2CO3·10H2O', 286],
    ['K4[Fe(CN)6]', 368],
    ['C6H12O6', 180],
    ['Pb(NO3)2', 331],
    ['Zn', 65],
  ])('%s = %d', (formula, expected) => {
    expect(parseFormula(formula).total).toBe(expected)
  })
})

describe('breakdown', () => {
  it('lists each element in order of appearance with its subtotal', () => {
    const r = parseFormula('H2O')
    expect(r.breakdown).toEqual([
      { symbol: 'H', count: 2, jar: 1, subtotal: 2 },
      { symbol: 'O', count: 1, jar: 16, subtotal: 16 },
    ])
    expect(breakdownText(r)).toBe('2(1) + 16 = 18')
  })

  it('combines repeated elements, including inside brackets', () => {
    const r = parseFormula('CH3COOH')
    expect(r.breakdown.map((b) => [b.symbol, b.count])).toEqual([
      ['C', 2],
      ['H', 4],
      ['O', 2],
    ])
    expect(breakdownText(parseFormula('Ca(OH)2'))).toBe('40 + 2(16) + 2(1) = 74')
  })
})

describe('kind (JAR / JMR / JFR)', () => {
  it.each([
    ['Na', 'atom'],
    ['O2', 'molecular'],
    ['CO2', 'molecular'],
    ['H2SO4', 'molecular'],
    ['NaCl', 'ionic'],
    ['CuSO4·5H2O', 'ionic'],
    ['(NH4)2SO4', 'ionic'],
    ['NH4Cl', 'ionic'],
  ])('%s is %s', (formula, kind) => {
    expect(parseFormula(formula).kind).toBe(kind)
  })
})

describe('input normalisation', () => {
  it('accepts spaces, unicode subscripts and different hydrate dots', () => {
    expect(normaliseFormula(' H₂ O ')).toBe('H2O')
    expect(parseFormula('CuSO₄ • 5H₂O').total).toBe(250)
    expect(parseFormula('CuSO4*5H2O').formula).toBe('CuSO4·5H2O')
  })
})

describe('errors', () => {
  const code = (input: string) => {
    const r = tryParseFormula(input)
    return r.ok ? null : [r.error.code, r.error.detail]
  }

  it.each([
    ['', ['empty', '']],
    ['Xy', ['unknownElement', 'Xy']],
    ['co2', ['lowercaseStart', 'c']],
    ['H2O)', ['unmatchedClose', ')']],
    ['Ca(OH2', ['unmatchedOpen', '(']],
    ['Ca(OH]2', ['unmatchedClose', ']']],
    ['()2', ['emptyGroup', '()']],
    ['2H2O', ['misplacedNumber', '2']], // molar mass of water is 18, not 36
    ['H2O·', ['unexpectedChar', '·']],
    ['H2O!', ['unexpectedChar', '!']],
    ['H-2', ['unexpectedChar', '-']],
  ])('%j', (input, expected) => {
    expect(code(input)).toEqual(expected)
  })

  it('throws FormulaError from parseFormula', () => {
    expect(() => parseFormula('Qq')).toThrow(FormulaError)
  })
})
