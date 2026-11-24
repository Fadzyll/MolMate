import { describe, expect, it } from 'vitest'
import { ELEMENTS, getElement } from '../../data/elements'
import { gridPosition, jarText, matchesSearch } from './categories'

const el = (s: string) => getElement(s)!

describe('matchesSearch', () => {
  it('matches symbol, English and Malay names, and exact proton number', () => {
    expect(matchesSearch(el('Na'), 'na')).toBe(true)
    expect(matchesSearch(el('Na'), 'sodium')).toBe(true)
    expect(matchesSearch(el('Na'), 'natrium')).toBe(true)
    expect(matchesSearch(el('Na'), '11')).toBe(true)
    expect(matchesSearch(el('Na'), '1')).toBe(false)
    expect(matchesSearch(el('Fe'), 'ferum')).toBe(true)
    expect(matchesSearch(el('Fe'), 'iron')).toBe(true)
    expect(matchesSearch(el('Fe'), 'copper')).toBe(false)
  })
  it('matches everything for an empty query', () => {
    expect(ELEMENTS.every((e) => matchesSearch(e, '  '))).toBe(true)
  })
})

describe('gridPosition', () => {
  it('places main-table elements by period and group', () => {
    expect(gridPosition(el('H'))).toEqual({ row: 1, col: 1 })
    expect(gridPosition(el('He'))).toEqual({ row: 1, col: 18 })
    expect(gridPosition(el('Fe'))).toEqual({ row: 4, col: 8 })
  })
  it('places lanthanides and actinides in rows 9 and 10', () => {
    expect(gridPosition(el('La'))).toEqual({ row: 9, col: 3 })
    expect(gridPosition(el('Lu'))).toEqual({ row: 9, col: 17 })
    expect(gridPosition(el('Ac'))).toEqual({ row: 10, col: 3 })
    expect(gridPosition(el('Lr'))).toEqual({ row: 10, col: 17 })
  })
  it('gives every element a unique cell', () => {
    const cells = new Set(ELEMENTS.map((e) => JSON.stringify(gridPosition(e))))
    expect(cells.size).toBe(118)
  })
})

describe('jarText', () => {
  it('brackets values for elements without stable isotopes', () => {
    expect(jarText(el('Cl'))).toBe('35.5')
    expect(jarText(el('Ra'))).toBe('(226)')
  })
})
