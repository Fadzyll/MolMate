/**
 * Mole concept conversions (Rajah 3.9). The number of moles is the hub:
 *   particles ⇄ moles   via the Avogadro constant N_A
 *   mass (g)  ⇄ moles   via the molar mass M (g mol⁻¹)
 *   gas volume (dm³) ⇄ moles via the molar volume V_m (dm³ mol⁻¹)
 *
 * All functions are pure. Volumes are always in dm³ and masses in g here;
 * convert other units with ./units first.
 */

/** Avogadro constant, as used in the KSSM/SPM syllabus (mol⁻¹). */
export const AVOGADRO = 6.02e23

/** Molar volume of any gas (dm³ mol⁻¹). */
export const MOLAR_VOLUME = {
  room: 24, // room conditions
  stp: 22.4, // standard temperature and pressure
} as const

export type Condition = keyof typeof MOLAR_VOLUME

export type Quantity = 'mole' | 'particles' | 'mass' | 'volume'

export type MoleErrorCode = 'notPositive' | 'notFinite' | 'missingMolarMass' | 'sameQuantity'

export class MoleInputError extends Error {
  code: MoleErrorCode
  constructor(code: MoleErrorCode, message: string) {
    super(message)
    this.name = 'MoleInputError'
    this.code = code
  }
}

function check(value: number, name: string) {
  if (!Number.isFinite(value)) throw new MoleInputError('notFinite', `${name} must be a number`)
  if (value <= 0) throw new MoleInputError('notPositive', `${name} must be greater than zero`)
}

// --- Mol ⇄ bilangan zarah: n = N ÷ N_A ---
export function molesFromParticles(particles: number): number {
  check(particles, 'Number of particles')
  return particles / AVOGADRO
}
export function particlesFromMoles(moles: number): number {
  check(moles, 'Number of moles')
  return moles * AVOGADRO
}

// --- Mol ⇄ jisim: n = m ÷ M ---
export function molesFromMass(mass: number, molarMass: number): number {
  check(mass, 'Mass')
  check(molarMass, 'Molar mass')
  return mass / molarMass
}
export function massFromMoles(moles: number, molarMass: number): number {
  check(moles, 'Number of moles')
  check(molarMass, 'Molar mass')
  return moles * molarMass
}
export function molarMassFrom(mass: number, moles: number): number {
  check(mass, 'Mass')
  check(moles, 'Number of moles')
  return mass / moles
}

// --- Mol ⇄ isi padu gas: n = V ÷ V_m ---
export function molesFromVolume(volumeDm3: number, molarVolume: number): number {
  check(volumeDm3, 'Volume')
  check(molarVolume, 'Molar volume')
  return volumeDm3 / molarVolume
}
export function volumeFromMoles(moles: number, molarVolume: number): number {
  check(moles, 'Number of moles')
  check(molarVolume, 'Molar volume')
  return moles * molarVolume
}
export function molarVolumeFrom(volumeDm3: number, moles: number): number {
  check(volumeDm3, 'Volume')
  check(moles, 'Number of moles')
  return volumeDm3 / moles
}

// --- Chain conversions (penukar berantai) ---

export interface ChainContext {
  /** Molar mass in g mol⁻¹; required when mass is the start or the target. */
  molarMass?: number
  /** Molar volume in dm³ mol⁻¹; defaults to room conditions. */
  molarVolume?: number
}

/**
 * One arrow in Rajah 3.9. `op` is what you do to `input` to get `output`.
 * The UI turns these into text such as "n = 8.8 ÷ 44 = 0.2 mol".
 */
export interface Step {
  from: Quantity
  to: Quantity
  op: 'multiply' | 'divide'
  factor: 'avogadro' | 'molarMass' | 'molarVolume'
  input: number
  factorValue: number
  output: number
}

export interface ChainResult {
  value: number
  steps: Step[]
}

const factorFor: Record<Exclude<Quantity, 'mole'>, Step['factor']> = {
  particles: 'avogadro',
  mass: 'molarMass',
  volume: 'molarVolume',
}

function factorValue(q: Exclude<Quantity, 'mole'>, ctx: ChainContext): number {
  if (q === 'particles') return AVOGADRO
  if (q === 'volume') return ctx.molarVolume ?? MOLAR_VOLUME.room
  if (ctx.molarMass === undefined) {
    throw new MoleInputError('missingMolarMass', 'Molar mass is needed to convert to or from mass')
  }
  return ctx.molarMass
}

/**
 * Convert any quantity to any other, always going through moles,
 * e.g. mass → mole → particles. Returns the answer plus each step.
 */
export function convert(from: Quantity, to: Quantity, value: number, ctx: ChainContext = {}): ChainResult {
  if (from === to) throw new MoleInputError('sameQuantity', 'Choose two different quantities')
  check(value, 'Value')

  const steps: Step[] = []
  let moles = value

  if (from !== 'mole') {
    const f = factorValue(from, ctx)
    check(f, 'Factor')
    moles = value / f
    steps.push({ from, to: 'mole', op: 'divide', factor: factorFor[from], input: value, factorValue: f, output: moles })
  }

  if (to === 'mole') return { value: moles, steps }

  const f = factorValue(to, ctx)
  check(f, 'Factor')
  const result = moles * f
  steps.push({ from: 'mole', to, op: 'multiply', factor: factorFor[to], input: moles, factorValue: f, output: result })
  return { value: result, steps }
}
