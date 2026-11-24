import {
  massFromMoles,
  molarMassFrom,
  molarVolumeFrom,
  molesFromMass,
  molesFromParticles,
  molesFromVolume,
  particlesFromMoles,
  volumeFromMoles,
} from '../../lib/mole'

/**
 * Every relationship in Rajah 3.9 has the same shape:
 *   n = X ÷ F,   X = n × F,   F = X ÷ n
 * where X is the quantity (N, m or V) and F the factor (N_A, M or V_m).
 */
export type RelationId = 'particles' | 'mass' | 'volume'
export type Unknown = 'n' | 'x' | 'f'

export interface Example {
  n?: string
  x?: string
  xExponent?: string
  xUnit?: string
  f?: string
}

export interface Relation {
  id: RelationId
  xSymbol: string
  fSymbol: string
  xLabel: 'N' | 'm' | 'V'
  fLabel: 'NA' | 'M' | 'Vm'
  /** Units the student can type X in; the first is the base unit used in the formula. */
  xUnits: readonly string[]
  fUnit: string
  /** How F is obtained: fixed constant, typed in, or chosen by room/STP toggle. */
  fMode: 'constant' | 'input' | 'condition'
  canSolve: readonly Unknown[]
  solve: {
    n: (x: number, f: number) => number
    x: (n: number, f: number) => number
    f?: (x: number, n: number) => number
  }
  examples: Partial<Record<Unknown, Example>>
}

export const RELATIONS: Record<RelationId, Relation> = {
  particles: {
    id: 'particles',
    xSymbol: 'N',
    fSymbol: 'N_A',
    xLabel: 'N',
    fLabel: 'NA',
    xUnits: [],
    fUnit: 'mol⁻¹',
    fMode: 'constant',
    canSolve: ['n', 'x'],
    solve: {
      n: (x) => molesFromParticles(x),
      x: (n) => particlesFromMoles(n),
    },
    examples: {
      n: { x: '1.204', xExponent: '24' },
      x: { n: '0.5' },
    },
  },
  mass: {
    id: 'mass',
    xSymbol: 'm',
    fSymbol: 'M',
    xLabel: 'm',
    fLabel: 'M',
    xUnits: ['g', 'kg', 'mg'],
    fUnit: 'g mol⁻¹',
    fMode: 'input',
    canSolve: ['n', 'x', 'f'],
    solve: {
      n: (x, f) => molesFromMass(x, f),
      x: (n, f) => massFromMoles(n, f),
      f: (x, n) => molarMassFrom(x, n),
    },
    examples: {
      n: { x: '8.8', xUnit: 'g', f: '44' },
      x: { n: '0.25', f: '58.5' },
      f: { x: '9', xUnit: 'g', n: '0.5' },
    },
  },
  volume: {
    id: 'volume',
    xSymbol: 'V',
    fSymbol: 'V_m',
    xLabel: 'V',
    fLabel: 'Vm',
    xUnits: ['dm3', 'cm3'],
    fUnit: 'dm³ mol⁻¹',
    fMode: 'condition',
    canSolve: ['n', 'x', 'f'],
    solve: {
      n: (x, f) => molesFromVolume(x, f),
      x: (n, f) => volumeFromMoles(n, f),
      f: (x, n) => molarVolumeFrom(x, n),
    },
    examples: {
      n: { x: '480', xUnit: 'cm3' },
      x: { n: '0.5' },
      f: { x: '4.8', xUnit: 'dm3', n: '0.2' },
    },
  },
}
