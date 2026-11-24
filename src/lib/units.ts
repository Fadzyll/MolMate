/**
 * Unit conversions used in the mole chapter. Each unit is stored as a power
 * of ten relative to the base unit of its dimension (g, dm³, mol), which
 * keeps results like 250 cm³ → 0.25 dm³ free of floating-point noise.
 */

export const UNITS = {
  mass: { mg: -3, g: 0, kg: 3 },
  volume: { cm3: -3, mL: -3, dm3: 0, L: 0, m3: 3 },
  amount: { mmol: -3, mol: 0 },
} as const

export type Dimension = keyof typeof UNITS
export type UnitOf<D extends Dimension> = keyof (typeof UNITS)[D] & string
export type MassUnit = UnitOf<'mass'>
export type VolumeUnit = UnitOf<'volume'>
export type AmountUnit = UnitOf<'amount'>

/** Display labels with proper superscripts. */
export const UNIT_LABELS: Record<string, string> = {
  mg: 'mg',
  g: 'g',
  kg: 'kg',
  cm3: 'cm³',
  mL: 'mL',
  dm3: 'dm³',
  L: 'L',
  m3: 'm³',
  mmol: 'mmol',
  mol: 'mol',
}

function power<D extends Dimension>(dimension: D, unit: UnitOf<D>): number {
  return (UNITS[dimension] as Record<string, number>)[unit]
}

/** Convert `value` between two units of the same dimension. */
export function convertUnit<D extends Dimension>(dimension: D, value: number, from: UnitOf<D>, to: UnitOf<D>): number {
  const diff = power(dimension, from) - power(dimension, to)
  return diff >= 0 ? value * 10 ** diff : value / 10 ** -diff
}

/**
 * The multiplier shown to students, e.g. cm³ → dm³ is "÷ 1000"
 * and dm³ → cm³ is "× 1000". Returns null when the units are equal in size.
 */
export function conversionFactor<D extends Dimension>(
  dimension: D,
  from: UnitOf<D>,
  to: UnitOf<D>,
): { op: 'multiply' | 'divide'; value: number } | null {
  const diff = power(dimension, from) - power(dimension, to)
  if (diff === 0) return null
  return { op: diff > 0 ? 'multiply' : 'divide', value: 10 ** Math.abs(diff) }
}

export const toGrams = (value: number, unit: MassUnit) => convertUnit('mass', value, unit, 'g')
export const toDm3 = (value: number, unit: VolumeUnit) => convertUnit('volume', value, unit, 'dm3')
