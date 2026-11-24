/**
 * Periodic table data for MolMate.
 *
 * JAR / RAM values follow the rounded values used in the KSSM textbook and
 * SPM: the standard atomic weight rounded to a whole number, except
 * chlorine (35.5). For elements with no stable isotope the mass number of
 * the longest-lived isotope is used, shown in brackets in the UI.
 */

export type Category =
  | 'alkali'
  | 'alkalineEarth'
  | 'transition'
  | 'postTransition'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'nobleGas'
  | 'lanthanide'
  | 'actinide'

export interface Element {
  /** Proton number (nombor proton). Equals the number of electrons in a neutral atom. */
  z: number
  symbol: string
  nameEn: string
  nameMs: string
  /** Relative atomic mass, SPM-rounded. */
  jar: number
  /** True when `jar` is the mass number of the most stable isotope (no stable isotopes). */
  radioactive: boolean
  period: number
  /** 1–18, or null for the f-block (lanthanides and actinides). */
  group: number | null
  category: Category
  /** Electrons in a neutral atom (= proton number). */
  electrons: number
  /** Electron arrangement such as "2.8.1", given for Z = 1–20 as in the syllabus. */
  electronArrangement: string | null
}

// symbol | English name | Malay name | JAR — in order of proton number.
const RAW = `
H|Hydrogen|Hidrogen|1
He|Helium|Helium|4
Li|Lithium|Litium|7
Be|Beryllium|Berilium|9
B|Boron|Boron|11
C|Carbon|Karbon|12
N|Nitrogen|Nitrogen|14
O|Oxygen|Oksigen|16
F|Fluorine|Fluorin|19
Ne|Neon|Neon|20
Na|Sodium|Natrium|23
Mg|Magnesium|Magnesium|24
Al|Aluminium|Aluminium|27
Si|Silicon|Silikon|28
P|Phosphorus|Fosforus|31
S|Sulfur|Sulfur|32
Cl|Chlorine|Klorin|35.5
Ar|Argon|Argon|40
K|Potassium|Kalium|39
Ca|Calcium|Kalsium|40
Sc|Scandium|Skandium|45
Ti|Titanium|Titanium|48
V|Vanadium|Vanadium|51
Cr|Chromium|Kromium|52
Mn|Manganese|Mangan|55
Fe|Iron|Ferum|56
Co|Cobalt|Kobalt|59
Ni|Nickel|Nikel|59
Cu|Copper|Kuprum|64
Zn|Zinc|Zink|65
Ga|Gallium|Galium|70
Ge|Germanium|Germanium|73
As|Arsenic|Arsenik|75
Se|Selenium|Selenium|79
Br|Bromine|Bromin|80
Kr|Krypton|Kripton|84
Rb|Rubidium|Rubidium|85
Sr|Strontium|Strontium|88
Y|Yttrium|Itrium|89
Zr|Zirconium|Zirkonium|91
Nb|Niobium|Niobium|93
Mo|Molybdenum|Molibdenum|96
Tc|Technetium|Teknetium|98
Ru|Ruthenium|Rutenium|101
Rh|Rhodium|Rodium|103
Pd|Palladium|Paladium|106
Ag|Silver|Argentum|108
Cd|Cadmium|Kadmium|112
In|Indium|Indium|115
Sn|Tin|Stanum|119
Sb|Antimony|Antimoni|122
Te|Tellurium|Telurium|128
I|Iodine|Iodin|127
Xe|Xenon|Xenon|131
Cs|Caesium|Sesium|133
Ba|Barium|Barium|137
La|Lanthanum|Lantanum|139
Ce|Cerium|Serium|140
Pr|Praseodymium|Praseodimium|141
Nd|Neodymium|Neodimium|144
Pm|Promethium|Prometium|145
Sm|Samarium|Samarium|150
Eu|Europium|Europium|152
Gd|Gadolinium|Gadolinium|157
Tb|Terbium|Terbium|159
Dy|Dysprosium|Disprosium|163
Ho|Holmium|Holmium|165
Er|Erbium|Erbium|167
Tm|Thulium|Tulium|169
Yb|Ytterbium|Iterbium|173
Lu|Lutetium|Lutetium|175
Hf|Hafnium|Hafnium|178
Ta|Tantalum|Tantalum|181
W|Tungsten|Tungsten|184
Re|Rhenium|Renium|186
Os|Osmium|Osmium|190
Ir|Iridium|Iridium|192
Pt|Platinum|Platinum|195
Au|Gold|Aurum|197
Hg|Mercury|Merkuri|201
Tl|Thallium|Talium|204
Pb|Lead|Plumbum|207
Bi|Bismuth|Bismut|209
Po|Polonium|Polonium|209
At|Astatine|Astatin|210
Rn|Radon|Radon|222
Fr|Francium|Fransium|223
Ra|Radium|Radium|226
Ac|Actinium|Aktinium|227
Th|Thorium|Torium|232
Pa|Protactinium|Protaktinium|231
U|Uranium|Uranium|238
Np|Neptunium|Neptunium|237
Pu|Plutonium|Plutonium|244
Am|Americium|Amerisium|243
Cm|Curium|Kurium|247
Bk|Berkelium|Berkelium|247
Cf|Californium|Kalifornium|251
Es|Einsteinium|Einsteinium|252
Fm|Fermium|Fermium|257
Md|Mendelevium|Mendelevium|258
No|Nobelium|Nobelium|259
Lr|Lawrencium|Lawrensium|262
Rf|Rutherfordium|Rutherfordium|267
Db|Dubnium|Dubnium|268
Sg|Seaborgium|Seaborgium|269
Bh|Bohrium|Bohrium|270
Hs|Hassium|Hassium|277
Mt|Meitnerium|Meitnerium|278
Ds|Darmstadtium|Darmstadtium|281
Rg|Roentgenium|Roentgenium|282
Cn|Copernicium|Kopernisium|285
Nh|Nihonium|Nihonium|286
Fl|Flerovium|Flerovium|289
Mc|Moscovium|Moskovium|290
Lv|Livermorium|Livermorium|293
Ts|Tennessine|Tenesin|294
Og|Oganesson|Oganeson|294
`

/** Last proton number of each period. */
const PERIOD_ENDS = [2, 10, 18, 36, 54, 86, 118]

export function periodOf(z: number): number {
  return PERIOD_ENDS.findIndex((end) => z <= end) + 1
}

export function groupOf(z: number): number | null {
  if (z === 1) return 1
  if (z === 2) return 18
  const period = periodOf(z)
  const pos = z - (PERIOD_ENDS[period - 2] ?? 0) // 1-based position within the period
  if (period <= 3) return pos <= 2 ? pos : pos + 10
  if (period <= 5) return pos
  // Periods 6 and 7 contain the 15-element f-block (La–Lu, Ac–Lr) at positions 3–17.
  if (pos <= 2) return pos
  if (pos <= 17) return null
  return pos - 14
}

const METALLOIDS = new Set(['B', 'Si', 'Ge', 'As', 'Sb', 'Te'])
const NONMETALS = new Set(['H', 'C', 'N', 'O', 'P', 'S', 'Se'])

function categoryOf(z: number, symbol: string, group: number | null): Category {
  if (z >= 57 && z <= 71) return 'lanthanide'
  if (z >= 89 && z <= 103) return 'actinide'
  if (METALLOIDS.has(symbol)) return 'metalloid'
  if (NONMETALS.has(symbol)) return 'nonmetal'
  if (group === 18) return 'nobleGas'
  if (group === 17) return 'halogen'
  if (group === 1) return 'alkali'
  if (group === 2) return 'alkalineEarth'
  if (group !== null && group >= 3 && group <= 12) return 'transition'
  return 'postTransition'
}

/**
 * Electron arrangement for the first 20 elements, filled 2, 8, 8, 2
 * as taught in the syllabus. Returns null beyond calcium.
 */
export function electronArrangement(z: number): string | null {
  if (z < 1 || z > 20) return null
  const shells: number[] = []
  let left = z
  for (const capacity of [2, 8, 8, 2]) {
    if (left <= 0) break
    const n = Math.min(left, capacity)
    shells.push(n)
    left -= n
  }
  return shells.join('.')
}

function isRadioactive(z: number): boolean {
  return z === 43 || z === 61 || z >= 84
}

export const ELEMENTS: readonly Element[] = RAW.trim()
  .split('\n')
  .map((line, i) => {
    const [symbol, nameEn, nameMs, jar] = line.split('|')
    const z = i + 1
    const group = groupOf(z)
    return {
      z,
      symbol,
      nameEn,
      nameMs,
      jar: Number(jar),
      radioactive: isRadioactive(z),
      period: periodOf(z),
      group,
      category: categoryOf(z, symbol, group),
      electrons: z,
      electronArrangement: electronArrangement(z),
    }
  })

const BY_SYMBOL = new Map(ELEMENTS.map((e) => [e.symbol, e]))

/** Look up an element by its exact (case-sensitive) symbol, e.g. "Cl". */
export function getElement(symbol: string): Element | undefined {
  return BY_SYMBOL.get(symbol)
}
